import { useState } from 'react'
import './FAQ.css'

export const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null)

    const faqs = [
        {
            question: "What is this Game Hub platform?",
            answer: "This is a browser-based game launcher platform that lets you play games directly in your browser using WebAssembly (WASM). Think of it like Netflix, but for games - no downloads, no installations, just click and play."
        },
        {
            question: "How does WebAssembly gaming work?",
            answer: "WebAssembly (WASM) allows games to run at near-native performance directly in your browser. We compile game engines and assets into WASM modules that your browser can execute, giving you a seamless gaming experience without any downloads."
        },
        {
            question: "Do I need to download or install anything?",
            answer: "No! That's the beauty of this platform. All games run directly in your browser. Just click 'Play' and the game loads instantly. Your browser handles everything - no external software, no installations, no hassle."
        },
        {
            question: "How do you add new games to the platform?",
            answer: "Each game is a self-contained module with a manifest.json file and a build folder containing WASM/JS assets. The platform reads these manifests dynamically, so adding new games doesn't require rewriting code - just drop in the game module and it appears in the library."
        },
        {
            question: "Will my game progress be saved?",
            answer: "Yes! We're building a save system that stores your game progress, settings, and achievements. In future phases, you'll have user accounts where all your data is securely stored and accessible from any device."
        },
        {
            question: "What technology stack powers this platform?",
            answer: "The platform uses React for the frontend launcher UI, Express.js backend for APIs and game catalog, Docker for containerization, and Nginx as a reverse proxy. Games are compiled to WebAssembly and served as static modules. Everything runs in a reproducible, scalable environment."
        }
    ]

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section className='FAQSection'>
            <div className="faq-header">
                <h2 className='faq-title'>Frequently Asked Questions</h2>
                <p className='faq-subtitle'>Everything you need to know about the platform</p>
            </div>

            <div className='faq-container'>
                {faqs.map((faq, index) => (
                    <div 
                        key={index} 
                        className={`faq-item ${openIndex === index ? 'active' : ''}`}
                        onClick={() => toggleFAQ(index)}
                    >
                        <div className='faq-question'>
                            <h3>{faq.question}</h3>
                            <span className='faq-icon'>{openIndex === index ? '−' : '+'}</span>
                        </div>
                        <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
                            <p>{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
