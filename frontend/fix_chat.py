f = '/home/baddeep/Projects/Entertainment_website_docker/frontend/src/Pages/ai_chat_page.jsx'
with open(f, 'r', encoding='utf-8') as fh:
    c = fh.read()

# 1. Remove unused IMAGE_API_URL constant
c = c.replace(
    '\nconst IMAGE_API_URL = import.meta.env.VITE_IMAGE_API_URL ?? "http://localhost:7860/generate"\n',
    '\n'
)

# 2. Remove VIDEO mode
c = c.replace(
    'const MODES = { IMAGE: "image", VIDEO: "video" }',
    'const MODES = { IMAGE: "image" }'
)

old_welcome = '''const WELCOME = {
    [MODES.IMAGE]: "hola amigos , Namaste , Hello , Konichiwa , Ohayo , My Friend i am an Artist I Will Paint your idea into life but make sure the idea you describe should be of animated image art style cause u know i am Learning HeHe.",
    [MODES.VIDEO]: "Hi! I'm your Anime Video Generator. Describe the animation, scene, or sequence you want and I'll bring it to life.",
}'''
new_welcome = '''const WELCOME = {
    [MODES.IMAGE]: "hola amigos , Namaste , Hello , Konichiwa , Ohayo , My Friend i am an Artist I Will Paint your idea into life but make sure the idea you describe should be of animated image art style cause u know i am Learning HeHe.",
}'''
c = c.replace(old_welcome, new_welcome)

old_suggestions = '''const SUGGESTIONS = {
    [MODES.IMAGE]: [
        "A samurai standing in cherry blossom rain",
        "Cyberpunk anime girl with neon lights",
        "Cozy anime cafe interior at night",
        "Dragon flying over a fantasy castle",
    ],
    [MODES.VIDEO]: [
        "A ninja running through a forest",
        "Ocean waves crashing at sunset",
        "A mecha robot powering up",
        "Sakura petals falling in slow motion",
    ],
}'''
new_suggestions = '''const SUGGESTIONS = [
    "A samurai standing in cherry blossom rain",
    "Cyberpunk anime girl with neon lights",
    "Cozy anime cafe interior at night",
    "Dragon flying over a fantasy castle",
]'''
c = c.replace(old_suggestions, new_suggestions)

# 3. Switch localStorage to sessionStorage
c = c.replace('localStorage.getItem(STORAGE_KEY)', 'sessionStorage.getItem(STORAGE_KEY)')
c = c.replace('localStorage.setItem(STORAGE_KEY', 'sessionStorage.setItem(STORAGE_KEY')
c = c.replace('localStorage.getItem(ACTIVE_ID_KEY)', 'sessionStorage.getItem(ACTIVE_ID_KEY)')
c = c.replace('localStorage.setItem(ACTIVE_ID_KEY', 'sessionStorage.setItem(ACTIVE_ID_KEY')

# 4. Fix generateWithPrompt axios block
old_gen = '''        try {
            const response = await axios.post(
                "http://localhost:3000/generate",
                {
                    prompts: [chosenPrompt]
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log(response.data)
            
           
            const b64 = Array.isArray(data) ? data[0] : (data.image ?? data.images?.[0] ?? data)
            const dataUrl = b64.startsWith("data:") ? b64 : `data:image/png;base64,${b64}`'''

new_gen = '''        try {
            const { data } = await axios.post("/api/generate", { prompts: [chosenPrompt] }, {
                headers: { "Content-Type": "application/json", "x-pinggy-no-screen": "true" },
            })
            const raw = Array.isArray(data) ? data[0] : (data.url ?? data.image ?? data.images?.[0] ?? data)
            const dataUrl = typeof raw === "string" && raw.startsWith("http") ? raw : `data:image/png;base64,${raw}`'''

c = c.replace(old_gen, new_gen)

# 5. Fix suggestions rendering (now an array)
c = c.replace('{SUGGESTIONS[mode].map((s, i) => (', '{SUGGESTIONS.map((s, i) => (')

# 6. Remove mode switcher, keep static label
old_switcher = '''                    <div className="mode-switcher">
                        <button
                            className={`mode-btn ${mode === MODES.IMAGE ? "active" : ""}`}
                            onClick={() => handleModeSwitch(MODES.IMAGE)}
                        >
                            &#128444; Image
                        </button>
                        <button
                            className={`mode-btn ${mode === MODES.VIDEO ? "active" : ""}`}
                            onClick={() => handleModeSwitch(MODES.VIDEO)}
                        >
                            &#127916; Video
                        </button>
                    </div>'''
new_switcher = '''                    <div className="mode-switcher">
                        <span className="mode-btn active">&#128444; Image</span>
                    </div>'''
c = c.replace(old_switcher, new_switcher)

with open(f, 'w', encoding='utf-8') as fh:
    fh.write(c)

print('axios /api/generate:', 'axios.post("/api/generate"' in c)
print('sessionStorage:', 'sessionStorage' in c)
print('VIDEO removed:', 'MODES.VIDEO' not in c)
print('imageUrl fix:', 'raw.startsWith("http")' in c)
print('old fetch gone:', 'await fetch(' not in c)
