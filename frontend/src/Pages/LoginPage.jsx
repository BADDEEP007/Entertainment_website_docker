import { useState } from 'react'
import { Navbar } from "../Components/HomePage/NavBar"
import './LoginPage.css'

export const LoginPage = () => {
    const [isSignup, setIsSignup] = useState(false)

    return (
        <>
            <div className="login-page">
                <Navbar />
                
                {/* Floating particles */}
                <div className="login-particles">
                    <div className="particle particle-1">◆</div>
                    <div className="particle particle-2">◇</div>
                    <div className="particle particle-3">◈</div>
                    <div className="particle particle-4">◆</div>
                    <div className="particle particle-5">◇</div>
                    <div className="particle particle-6">◈</div>
                </div>

                <div className="login-container">
                    <div className="login-card">
                        <div className="login-header">
                            <h1>{isSignup ? 'Create Account' : 'Welcome Back'}</h1>
                            <p>{isSignup ? 'Join the gaming revolution' : 'Login to continue gaming'}</p>
                        </div>

                        <button className="google-signin-btn">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
                                <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
                                <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
                                <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
                            </svg>
                            <span>Continue with Google</span>
                        </button>

                        <div className="divider">
                            <span>or</span>
                        </div>

                        <form className="login-form">
                            {isSignup && (
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <input 
                                        type="text" 
                                        id="username" 
                                        placeholder="Choose a username"
                                        required
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                            {isSignup && (
                                <div className="form-group">
                                    <label htmlFor="confirm-password">Confirm Password</label>
                                    <input 
                                        type="password" 
                                        id="confirm-password" 
                                        placeholder="Confirm your password"
                                        required
                                    />
                                </div>
                            )}

                            {!isSignup && (
                                <div className="form-options">
                                    <label className="checkbox-label">
                                        <input type="checkbox" />
                                        <span>Remember me</span>
                                    </label>
                                    <a href="#" className="forgot-password">Forgot password?</a>
                                </div>
                            )}

                            <button type="submit" className="submit-btn">
                                {isSignup ? 'Sign Up' : 'Login'}
                            </button>
                        </form>

                        <div className="toggle-form">
                            <p>
                                {isSignup ? 'Already have an account?' : "Don't have an account?"}
                                <button onClick={() => setIsSignup(!isSignup)}>
                                    {isSignup ? 'Login' : 'Sign Up'}
                                </button>
                            </p>
                        </div>
                    </div>

                    <div className="login-visual">
                        <div className="visual-content">
                            <h2>Start Your Gaming Journey</h2>
                            <ul className="features-list">
                                <li>
                                    <span className="feature-icon">✓</span>
                                    <span>Access 6+ browser games instantly</span>
                                </li>
                                <li>
                                    <span className="feature-icon">✓</span>
                                    <span>Save your progress across devices</span>
                                </li>
                                <li>
                                    <span className="feature-icon">✓</span>
                                    <span>No downloads or installations</span>
                                </li>
                                <li>
                                    <span className="feature-icon">✓</span>
                                    <span>WebAssembly-powered performance</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
