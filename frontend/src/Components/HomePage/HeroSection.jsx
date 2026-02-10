import './HeroSection.css'

export const Herosection = () => {
    return (
        <>
        <section className="herosection">
            <div className="hero-content">
                <div className="hero-badge">
                    <span className="badge-dot"></span>
                    <span className="badge-text">WebAssembly Powered</span>
                </div>
                
                <h1 className="hero-title">
                    Browser-Based
                    <span className="hero-title-highlight"> Game Hub</span>
                </h1>
                
                <p className="hero-description">
                    Play games instantly in your browser with near-native performance. 
                    No downloads, no installations - just pure WebAssembly-powered gaming. 
                    Built with React, Express, and Docker for a seamless experience.
                </p>

                <div className="hero-stats">
                    <div className="stat-item">
                        <span className="stat-number">6+</span>
                        <span className="stat-label">Games</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-number">0ms</span>
                        <span className="stat-label">Load Time</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-number">100%</span>
                        <span className="stat-label">Browser</span>
                    </div>
                </div>

                <div className="hero-actions">
                    <a href="/games" className="btn-primary">
                        <span>Explore Games</span>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </a>
                    <a href="#about" className="btn-secondary">
                        <span>Learn More</span>
                    </a>
                </div>

                <div className="hero-tech-stack">
                    <span className="tech-label">Built with:</span>
                    <div className="tech-items">
                        <span className="tech-item">React</span>
                        <span className="tech-item">Express</span>
                        <span className="tech-item">Docker</span>
                        <span className="tech-item">WebAssembly</span>
                        <span className="tech-item">Nginx</span>
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
        </>
    )
}