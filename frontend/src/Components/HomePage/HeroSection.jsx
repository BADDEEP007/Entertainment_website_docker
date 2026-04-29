import './HeroSection.css'
import { useNavigate } from 'react-router-dom'

const MOVIE_PLANNER_URL = import.meta.env.VITE_MOVIE_PLANNER_URL ?? "http://127.0.0.1:5000/new"

export const Herosection = () => {
    const navigate = useNavigate()

    return (
        <section className="herosection">
            <div className="hero-content">
                <div className="hero-badge">
                    <span className="badge-dot"></span>
                    <span className="badge-text">AI-Powered Entertainment</span>
                </div>

                <h1 className="hero-title">
                    AI-Powered
                    <span className="hero-title-highlight"> Entertainment</span>
                    <br />Platform
                </h1>

                <p className="hero-description">
                    A unified platform combining gaming, AI-generated creativity,
                    and intelligent recommendations — all in one place.
                </p>

                {/* Three feature cards */}
                <div className="hero-feature-cards">
                    <div className="hero-feature-card" onClick={() => navigate('/games')}>
                        <div className="hfc-icon">🎮</div>
                        <div className="hfc-body">
                            <h3>Gaming</h3>
                            <p>Play classic browser games instantly</p>
                        </div>
                        <span className="hfc-arrow">→</span>
                    </div>

                    <div className="hero-feature-card" onClick={() => navigate('/ai')}>
                        <div className="hfc-icon">🎨</div>
                        <div className="hfc-body">
                            <h3>Create</h3>
                            <p>Generate anime art with AI</p>
                        </div>
                        <span className="hfc-arrow">→</span>
                    </div>

                    <div className="hero-feature-card" onClick={() => window.open(MOVIE_PLANNER_URL, '_blank')}>
                        <div className="hfc-icon">🤖</div>
                        <div className="hfc-body">
                            <h3>Smart Recommendations</h3>
                            <p>Mood-based movie picks via AI</p>
                        </div>
                        <span className="hfc-arrow">→</span>
                    </div>
                </div>

                <div className="hero-stats">
                    <div className="stat-item">
                        <span className="stat-number">6+</span>
                        <span className="stat-label">Games</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-number">AI</span>
                        <span className="stat-label">Art Studio</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-number">∞</span>
                        <span className="stat-label">Recommendations</span>
                    </div>
                </div>
            </div>

            <div className="hero-visual">
                <div className="animated-grid">
                    <div className="grid-line grid-line-1"></div>
                    <div className="grid-line grid-line-2"></div>
                    <div className="grid-line grid-line-3"></div>
                    <div className="grid-line grid-line-4"></div>
                    <div className="grid-line grid-line-5"></div>

                    <div className="floating-cube cube-1">
                        <div className="cube-face front"></div>
                        <div className="cube-face back"></div>
                        <div className="cube-face left"></div>
                        <div className="cube-face right"></div>
                        <div className="cube-face top"></div>
                        <div className="cube-face bottom"></div>
                    </div>

                    <div className="floating-cube cube-2">
                        <div className="cube-face front"></div>
                        <div className="cube-face back"></div>
                        <div className="cube-face left"></div>
                        <div className="cube-face right"></div>
                        <div className="cube-face top"></div>
                        <div className="cube-face bottom"></div>
                    </div>

                    <div className="floating-cube cube-3">
                        <div className="cube-face front"></div>
                        <div className="cube-face back"></div>
                        <div className="cube-face left"></div>
                        <div className="cube-face right"></div>
                        <div className="cube-face top"></div>
                        <div className="cube-face bottom"></div>
                    </div>
                </div>
                <div className="visual-glow"></div>
            </div>
        </section>
    )
}
