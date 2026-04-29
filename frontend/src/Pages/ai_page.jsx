import { useNavigate } from "react-router-dom"
import { Navbar } from "../Components/HomePage/NavBar"
import { Footer } from "../Components/Footer/Footer"
import "./ai_page.css"

const MOVIE_PLANNER_URL = import.meta.env.VITE_MOVIE_PLANNER_URL ?? "http://127.0.0.1:5000/new"

export const AIPage = () => {
    const navigate = useNavigate()

    const handleGetStarted = () => navigate("/ai/chat")
    const handleImageGen = () => navigate("/ai/chat?mode=image")
    const handleVideoGen = () => navigate("/ai/chat?mode=video")

    return (
        <>
            <div className="ai-page-container">
                <Navbar />
                
                <section className="ai-hero-section">
                    <div className="ai-hero-background">
                        <div className="anime-particles">
                            <div className="particle anime-star">*</div>
                            <div className="particle anime-star">+</div>
                            <div className="particle anime-star">*</div>
                            <div className="particle anime-star">+</div>
                            <div className="particle anime-star">*</div>
                        </div>
                    </div>

                    <div className="ai-hero-content">
                        <div className="ai-hero-badge">
                            <span className="badge-icon">🎨</span>
                            <span>Generative AI Studio</span>
                        </div>

                        <h1 className="ai-hero-title">
                            Create Anime Art
                            <span className="gradient-text"> with AI</span>
                        </h1>

                        <p className="ai-hero-description">
                            Transform your imagination into breathtaking anime visuals.
                            Describe your idea, let the AI Director refine it, and watch
                            your vision come to life in seconds.
                        </p>

                        <div className="ai-features-grid">
                            <div className="ai-feature-card" onClick={handleImageGen} style={{ cursor: "pointer" }}>
                                <div className="feature-icon">IMG</div>
                                <h3>Image Generation</h3>
                                <p>Create stunning anime characters, backgrounds, and scenes in seconds</p>
                            </div>

                            <div className="ai-feature-card" onClick={handleVideoGen} style={{ cursor: "pointer" }}>
                                <div className="feature-icon">VID</div>
                                <h3>Video Generation</h3>
                                <p>Bring your anime to life with smooth animated sequences</p>
                            </div>
                        </div>

                        <button className="ai-cta-button" onClick={handleGetStarted}>
                            <span>Start Creating</span>
                            <span className="button-arrow">&rarr;</span>
                        </button>
                    </div>
                </section>

                <section className="ai-samples-section">
                    <h2 className="samples-title">See What You Can Create</h2>
                    <p className="samples-subtitle">Explore stunning examples of AI-generated anime art</p>
                    
                    <div className="samples-grid">
                        <div className="sample-card" onClick={handleImageGen} style={{ cursor: "pointer" }}>
                            <div className="sample-placeholder image-sample">
                                <span className="sample-label">Image Sample</span>
                                <p className="sample-text">High-quality anime character portraits with detailed expressions and vibrant colors</p>
                            </div>
                        </div>

                        <div className="sample-card" onClick={handleVideoGen} style={{ cursor: "pointer" }}>
                            <div className="sample-placeholder video-sample">
                                <span className="sample-label">Video Sample</span>
                                <p className="sample-text">Animated sequences with smooth transitions and dynamic camera movements</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Cross-feature link to Recommendations */}
                <div className="ai-crosslink-banner">
                    <div className="ai-crosslink-content">
                        <span className="ai-crosslink-icon">🤖</span>
                        <div>
                            <h3>Want a movie with a similar vibe?</h3>
                            <p>After generating your art, let AI find movies that match the same mood and aesthetic</p>
                        </div>
                        <a href={MOVIE_PLANNER_URL} target="_blank" rel="noopener noreferrer" className="ai-crosslink-btn">
                            Get Movie Recommendations →
                        </a>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    )
}
