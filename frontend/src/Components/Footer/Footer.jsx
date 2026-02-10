import './Footer.css'
import github from "../../assets/github.svg"
import discord from "../../assets/Discord.svg"
import linkdin from "../../assets/linkdin.svg"

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-particles">
                <div className="particle particle-1">◆</div>
                <div className="particle particle-2">◇</div>
                <div className="particle particle-3">◈</div>
                <div className="particle particle-4">◆</div>
            </div>

            <div className="footer-content">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <span className="logo-icon">🎮</span>
                        <h3>GameHub</h3>
                    </div>
                    <p className="footer-tagline">
                        Browser-based gaming platform powered by WebAssembly
                    </p>
                </div>

                <div className="footer-links">
                    <div className="footer-column">
                        <h4>Platform</h4>
                        <a href="/">Home</a>
                        <a href="/games">Games</a>
                        <a href="/#about">About</a>
                        <a href="/#faq">FAQ</a>
                    </div>

                    <div className="footer-column">
                        <h4>Resources</h4>
                        <a href="#">Documentation</a>
                        <a href="#">API</a>
                        <a href="#">Support</a>
                        <a href="#">Status</a>
                    </div>

                    <div className="footer-column">
                        <h4>Legal</h4>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Cookie Policy</a>
                        <a href="#">Licenses</a>
                    </div>
                </div>

                <div className="footer-social">
                    <h4>Connect</h4>
                    <div className="social-icons">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <img src={github} alt="GitHub" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <img src={linkdin} alt="LinkedIn" />
                        </a>
                        <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <img src={discord} alt="Discord" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p className="footer-copyright">
                    © 2026 GameHub. All rights reserved.
                </p>
                <p className="footer-tech">
                    Built with React • Express • Docker • WebAssembly
                </p>
            </div>
        </footer>
    )
}
