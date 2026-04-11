import './NavBar.css'
import { Link } from 'react-router-dom'

export const Navbar = () => {
    return (
        <section className="Navbar">
            <div className="Logo">
                <div className="logo-icon">🎮</div>
                <h3>GameHub</h3>
            </div>
            <nav className="main-navigation">
                <ul className="navbar-option">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/#about">About</Link></li>
                    <li><Link to="/games">Games</Link></li>
                    <li className="nav-item-disabled"><span className="nav-disabled-link">AI Models<span className="nav-coming-soon">Soon</span></span></li>
                    <li><Link to="/#faq">FAQ</Link></li>
                </ul>
            </nav>
            <Link to="/login" className="nav-cta-button">
                Login
            </Link>
        </section>
    )
}
