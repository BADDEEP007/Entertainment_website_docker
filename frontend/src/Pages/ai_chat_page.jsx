import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { enhancePrompt } from "../hooks/usePromptEnhancer"
import { DEFAULT_MODEL } from "../data/imageModels"
import { 
    Menu, 
    X, 
    Plus, 
    Home, 
    ImageIcon, 
    Send, 
    Zap,
    Sparkles,
    Download,
    FileText
} from "../components/Icons"
import "./ai_chat_page.css"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000"



const MODES = { IMAGE: "image" }

const WELCOME = {
    [MODES.IMAGE]: "hola amigos , Namaste , Hello , Konichiwa , Ohayo , My Friend i am an Artist I Will Paint your idea into life but make sure the idea you describe should be of animated image art style cause u know i am Learning HeHe.",
}

const STORAGE_KEY = "ai_chat_sessions_1"
const ACTIVE_ID_KEY = "ai_chat_active_id_1"

let msgId = 0
const newMsg = (role, content, type = "text", meta = {}) => ({
    id: ++msgId,
    role,
    content,
    type,
    meta,
})

function loadSessions(initialMode) {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY)
        if (raw) {
            const parsed = JSON.parse(raw)
            if (Array.isArray(parsed) && parsed.length > 0) {
                parsed.forEach(s => s.messages.forEach(m => { if (m.id >= msgId) msgId = m.id }))
                return parsed
            }
        }
    } catch (_) { }
    return [{ id: 1, title: "New Chat", mode: initialMode, messages: [newMsg("assistant", WELCOME[initialMode])] }]
}

function loadActiveId(sessions) {
    try {
        const raw = sessionStorage.getItem(ACTIVE_ID_KEY)
        if (raw) {
            const id = JSON.parse(raw)
            if (sessions.find(s => s.id === id)) return id
        }
    } catch (_) { }
    return sessions[0]?.id ?? 1
}

export const AIChatPage = () => {
    const navigate = useNavigate()
    const initialMode = MODES.IMAGE

    const [sessions, setSessions] = useState(() => loadSessions(initialMode))
    const [activeId, setActiveId] = useState(() => {
        const s = loadSessions(initialMode)
        return loadActiveId(s)
    })
    const [mode, setMode] = useState(() => {
        const s = loadSessions(initialMode)
        const id = loadActiveId(s)
        return s.find(x => x.id === id)?.mode ?? initialMode
    })
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [viewingPrompt, setViewingPrompt] = useState(null)
    const bottomRef = useRef(null)
    const textareaRef = useRef(null)

    const activeSession = sessions.find(s => s.id === activeId)

    useEffect(() => {
        try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessions)) } catch (_) { }
    }, [sessions])

    useEffect(() => {
        try { sessionStorage.setItem(ACTIVE_ID_KEY, JSON.stringify(activeId)) } catch (_) { }
    }, [activeId])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [activeSession?.messages, loading])

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px"
        }
    }, [input])

    const updateSession = (id, updater) =>
        setSessions(prev => prev.map(s => s.id === id ? updater(s) : s))

    const appendMsg = (sessionId, msg) =>
        updateSession(sessionId, s => ({ ...s, messages: [...s.messages, msg] }))

    const handleNewChat = () => {
        const id = Date.now()
        setSessions(prev => [{ id, title: "New Chat", mode, messages: [newMsg("assistant", WELCOME[mode])] }, ...prev])
        setActiveId(id)
        setInput("")
    }

    const generateWithPrompt = async (sessionId, chosenPrompt) => {
        const pendingMsg = newMsg("assistant", `Generating your anime image: "${chosenPrompt}"`, "image-pending")
        appendMsg(sessionId, pendingMsg)

        try {
            const response = await axios.post(`${API_URL}/generate-image`, { 
                prompts: [chosenPrompt]
            }, {
                headers: { "Content-Type": "application/json" },
            })
            const imageUrl = response.data.url
            console.log(imageUrl)
            updateSession(sessionId, s => ({
                ...s,
                messages: s.messages.map(m =>
                    m.id === pendingMsg.id
                        ? { ...m, type: "image-result", meta: { ...m.meta, urls: imageUrl, prompt: chosenPrompt } }
                        : m
                ),
            }))
        } catch (err) {
            console.log(err)
            updateSession(sessionId, s => ({
                ...s,
                messages: s.messages.map(m =>
                    m.id === pendingMsg.id
                        ? { ...m, type: "text", content: `Image generation failed: ${err.message}` }
                        : m
                ),
            }))
        }
    }

    const handleChoice = (msgChoiceId, choice, sessionId) => {
        setSessions(prev => prev.map(s => {
            if (s.id !== sessionId) return s
            return {
                ...s,
                messages: s.messages.map(m =>
                    m.id === msgChoiceId ? { ...m, meta: { ...m.meta, chosen: choice } } : m
                ),
            }
        }))

        const session = sessions.find(s => s.id === sessionId)
        const choiceMsg = session?.messages.find(m => m.id === msgChoiceId)
        if (!choiceMsg) return

        const chosenPrompt = choice === "mine"
            ? choiceMsg.meta.userPrompt
            : choiceMsg.meta.directorPrompt

        generateWithPrompt(sessionId, chosenPrompt)
    }

    // Goes through the director first, then generates
    const handleSend = async () => {
        const text = input.trim()
        if (!text || loading) return

        const sessionId = activeId

        const userMsg = newMsg("user", text)
        updateSession(sessionId, s => ({
            ...s,
            title: s.title === "New Chat" ? text.slice(0, 30) : s.title,
            messages: [...s.messages, userMsg],
        }))
        setInput("")
        setLoading(true)

        try {
            const directorPrompt = await enhancePrompt(text)
            const choiceMsg = newMsg("assistant", "", "choice", {
                userPrompt: text,
                directorPrompt,
                chosen: null,
            })
            appendMsg(sessionId, choiceMsg)
        } catch (err) {
            appendMsg(sessionId, newMsg("assistant", `Could not reach the director (${err.message}). Generating with your prompt.`))
            generateWithPrompt(sessionId, text)
        }

        setLoading(false)
    }

    // Skips the director — generates directly with the user's prompt
    const handleDirectGenerate = () => {
        const text = input.trim()
        if (!text || loading) return

        const sessionId = activeId

        const userMsg = newMsg("user", text)
        updateSession(sessionId, s => ({
            ...s,
            title: s.title === "New Chat" ? text.slice(0, 30) : s.title,
            messages: [...s.messages, userMsg],
        }))
        setInput("")
        generateWithPrompt(sessionId, text)
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleDownload = (dataUrl, prompt) => {
        const a = document.createElement("a")
        a.href = dataUrl
        a.download = `${prompt.slice(0, 40).replace(/[^a-z0-9]/gi, "_")}.png`
        a.click()
    }



    return (
        <div className="chat-layout">
            {/* Sidebar */}
            <aside className={`chat-sidebar ${sidebarOpen ? "open" : "closed"}`}>
                <div className="sidebar-header">
                    <span className="sidebar-logo">
                        <Sparkles size={20} className="logo-icon" />
                        AnimeAI
                    </span>
                    <button className="icon-btn" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
                        <X size={20} />
                    </button>
                </div>
                <button className="new-chat-btn" onClick={handleNewChat}>
                    <Plus size={18} />
                    <span>New Chat</span>
                </button>
                <div className="sidebar-section-label">Recent</div>
                <ul className="chat-history-list">
                    {sessions.map(s => (
                        <li
                            key={s.id}
                            className={`history-item ${s.id === activeId ? "active" : ""}`}
                            onClick={() => { setActiveId(s.id); setMode(s.mode) }}
                        >
                            <span className="history-mode-dot" data-mode={s.mode} />
                            <span className="history-title">{s.title}</span>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Main */}
            <div className="chat-main">
                <header className="chat-topbar">
                    {!sidebarOpen && (
                        <button className="icon-btn" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
                            <Menu size={20} />
                        </button>
                    )}
                    <button 
                        className="home-btn" 
                        onClick={() => navigate('/')}
                        title="Go to Home"
                    >
                        <Home size={18} />
                        <span>Home</span>
                    </button>
                    <div className="mode-switcher">
                        <span className="mode-btn active">
                            <ImageIcon size={18} />
                            <span>Image Generation</span>
                        </span>
                    </div>
                    <div className="model-badge">
                        <Sparkles size={16} />
                        <span>{DEFAULT_MODEL.shortName}</span>
                    </div>
                </header>

                <div className="chat-messages">
                    {activeSession?.messages.map(msg => (
                        <div key={msg.id} className={`message-row ${msg.role}`}>
                            {msg.role === "assistant" && <div className="avatar assistant-avatar">AI</div>}

                            {msg.type === "choice" ? (
                                <div className="choice-card">
                                    <p className="choice-heading">
                                        <Sparkles size={18} className="inline-icon" />
                                        The Director has upgraded your prompt. Which version do you prefer?
                                    </p>
                                    <div className="choice-options">
                                        <div className={`choice-option ${msg.meta.chosen === "mine" ? "chosen" : ""}`}>
                                            <div className="choice-label">Your Prompt</div>
                                            <p className="choice-text">{msg.meta.userPrompt}</p>
                                            {!msg.meta.chosen && (
                                                <button className="choice-btn mine" onClick={() => handleChoice(msg.id, "mine", activeId)}>
                                                    Use Mine
                                                </button>
                                            )}
                                            {msg.meta.chosen === "mine" && <span className="chosen-badge">Selected</span>}
                                        </div>
                                        <div className={`choice-option director ${msg.meta.chosen === "director" ? "chosen" : ""}`}>
                                            <div className="choice-label">
                                                <Sparkles size={14} className="inline-icon" />
                                                Director's Upgrade
                                            </div>
                                            <p className="choice-text">{msg.meta.directorPrompt}</p>
                                            {!msg.meta.chosen && (
                                                <button className="choice-btn director" onClick={() => handleChoice(msg.id, "director", activeId)}>
                                                    Use Director's
                                                </button>
                                            )}
                                            {msg.meta.chosen === "director" && <span className="chosen-badge">Selected</span>}
                                        </div>
                                    </div>
                                    <button
                                        className="view-full-prompt-btn"
                                        onClick={() => setViewingPrompt({ userPrompt: msg.meta.userPrompt, directorPrompt: msg.meta.directorPrompt })}
                                    >
                                        <FileText size={16} />
                                        View Full Director Prompt
                                    </button>
                                </div>
                            ) : msg.type === "image-result" ? (
                                <div className="message-bubble image-result">
                                    <img src={msg.meta.urls} alt={msg.meta.prompt} className="generated-image" />
                                    <div className="image-result-info">
                                        <span className="image-model-badge">
                                            <Sparkles size={14} />
                                            {DEFAULT_MODEL.shortName}
                                        </span>
                                        <button className="download-btn" onClick={() => handleDownload(msg.meta.urls, msg.meta.prompt)}>
                                            <Download size={16} />
                                            Download
                                        </button>
                                    </div>
                                </div>
                            ) : msg.type === "image-pending" ? (
                                <div className="message-bubble image-generating">
                                    <div className="img-gen-loader">
                                        <div className="img-gen-shimmer" />
                                        <div className="img-gen-bars">
                                            <span /><span /><span /><span /><span />
                                        </div>
                                        <p className="img-gen-label">
                                            <Sparkles size={16} className="inline-icon" />
                                            Painting your vision...
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className={`message-bubble ${msg.type}`}>
                                    <p>{msg.content}</p>
                                </div>
                            )}

                            {msg.role === "user" && <div className="avatar user-avatar">U</div>}
                        </div>
                    ))}

                    {loading && (
                        <div className="message-row assistant">
                            <div className="avatar assistant-avatar">AI</div>
                            <div className="message-bubble">
                                <div className="typing-indicator"><span /><span /><span /></div>
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                <div className="chat-input-area">
                    <div className="input-box">
                        <textarea
                            ref={textareaRef}
                            className="chat-textarea"
                            placeholder={`Describe the anime ${mode} you want to generate...`}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                        />
                        <button
                            className="direct-gen-btn"
                            onClick={handleDirectGenerate}
                            disabled={!input.trim() || loading}
                            title="Generate directly (skip director)"
                            aria-label="Generate directly"
                        >
                            <Zap size={18} />
                        </button>
                        <button
                            className={`send-btn ${input.trim() && !loading ? "ready" : ""}`}
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            title="Send to director first"
                            aria-label="Send message"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <p className="input-hint">
                        <Send size={12} className="hint-icon" />
                        with director
                        <span className="hint-separator">·</span>
                        <Zap size={12} className="hint-icon" />
                        direct generate
                        <span className="hint-separator">·</span>
                        Shift+Enter for new line
                    </p>
                </div>
            </div>

            {/* Full Director Prompt Modal */}
            {viewingPrompt && (
                <div className="prompt-modal-overlay" onClick={() => setViewingPrompt(null)}>
                    <div className="prompt-modal" onClick={e => e.stopPropagation()}>
                        <div className="prompt-modal-header">
                            <span>
                                <Sparkles size={18} className="inline-icon" />
                                Full Director Prompt
                            </span>
                            <button className="icon-btn" onClick={() => setViewingPrompt(null)} aria-label="Close modal">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="prompt-modal-section">
                            <div className="prompt-modal-label">Your Original Prompt</div>
                            <pre className="prompt-modal-text">{viewingPrompt.userPrompt}</pre>
                        </div>
                        <div className="prompt-modal-section">
                            <div className="prompt-modal-label">
                                <Sparkles size={14} className="inline-icon" />
                                Director's Full Prompt
                            </div>
                            <pre className="prompt-modal-text">{viewingPrompt.directorPrompt}</pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
