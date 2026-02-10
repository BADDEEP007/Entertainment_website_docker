import '../About/AboutSection.css'
import { useState } from 'react'

export const About = () => {
    const Buttons = [
        {
            id: 1,
            label: "Platform",
            mainText:
                "A modular game launcher built with React, Express, and Docker. Games are served as WebAssembly modules with manifest-based loading - add new games without touching the core codebase.",
            columns: [
                {
                    title: "Frontend",
                    mainDescription: "React-based launcher UI that displays the game library, reads manifests dynamically, and launches games with a single click. Clean, fast, and responsive."
                },
                {
                    title: "Backend",
                    mainDescription: "Express.js API serving game catalog data, user profiles, save states, and settings. Scalable architecture ready for future expansion."
                },
                {
                    title: "Infrastructure",
                    mainDescription: "Dockerized environment with Nginx reverse proxy. Production-ready containerization with multi-stage builds and optimized images."
                }
            ]
        },
        {
            id: 2,
            label: "Technology",
            mainText:
                "Built on modern web standards - WebAssembly for near-native game performance, containerization for reproducible deployments, and a clean API-driven architecture.",
            columns: [
                {
                    title: "WebAssembly",
                    mainDescription: "Games compiled to WASM run at near-native speeds directly in the browser. No plugins, no downloads - just pure performance."
                },
                {
                    title: "Docker",
                    mainDescription: "Consistent development and production environments. Hot reload in dev, optimized multi-stage builds for production deployment."
                },
                {
                    title: "Modular Design",
                    mainDescription: "Each game is a self-contained module with manifest.json. Drop in new games without rewriting code - the platform handles the rest."
                }
            ]
        },
        {
            id: 3,
            label: "Roadmap",
            mainText:
                "Currently in Phase 1 - building the platform skeleton. Future phases include user accounts, save systems, game settings, and production deployment to AWS.",
            columns: [
                {
                    title: "Phase 1-2",
                    mainDescription: "Platform skeleton with game catalog API, static game hosting, and Docker dev environment. Foundation for everything that follows."
                },
                {
                    title: "Phase 3-4",
                    mainDescription: "Production containerization with Nginx reverse proxy, multi-stage builds, and proper environment configuration for deployment."
                },
                {
                    title: "Phase 5+",
                    mainDescription: "User authentication, save metadata storage, per-user settings, CI/CD pipeline, and AWS EC2 deployment with optional S3/CloudFront."
                }
            ]
        }
    ]

    const [select, setselect] = useState(1)
    const activeData = Buttons.find(btn => btn.id == select)

    return (
        <>
        <section className='AboutSection'>
            {/* Gaming decorative elements */}
            <div className="gaming-particles">
                <div className="particle particle-1">◆</div>
                <div className="particle particle-2">◇</div>
                <div className="particle particle-3">◈</div>
                <div className="particle particle-4">◆</div>
                <div className="particle particle-5">◇</div>
                <div className="particle particle-6">◈</div>
            </div>

            <h3 className='About_us'>How It Works</h3>
            
            <nav>
                {Buttons.map(btn => (
                    <button
                        key={btn.id}
                        onClick={() => { setselect(btn.id) }}
                        className={`about_button ${select === btn.id ? 'active' : ''}`}>
                        {btn.label}
                    </button>
                ))}
            </nav>

            <div className='About_Dynamic_data'>
                <p className='About_main_text'>
                    {activeData.mainText}
                </p>
                <div className='About_3_col'>
                    {activeData.columns.map((col, index) => (
                        <div key={index} className='Info_card_about'>
                            <div className="notiglow"></div>
                            <div className="notiborderglow"></div>
                            <h4 className='notititle'>{col.title}</h4>
                            <p className='notibody'>{col.mainDescription}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        </>
    )
}