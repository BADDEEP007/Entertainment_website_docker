import './NavBar.css'
import { Link, useLocation } from 'react-router-dom'

const MOVIE_PLANNER_URL = import.meta.env.VITE_MOVIE_PLANNER_URL ?? "http://127.0.0.1:5000/new"

export const Navbar = () => {
    const location = useLocation()

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/'
        return location.pathname.startsWith(path)
    }

    return (
        <section className="Navbar">
            <Link to="/" className="Logo" style={{ textDecoration: 'none' }}>
                <div className="logo-icon">✦</div>
                <h3>EntertainAI</h3>
            </Link>
            <nav className="main-navigation">
                <ul className="navbar-option">
                    <li><Link to="/" className={isActive('/') ? 'nav-active' : ''}>Home</Link></li>
                    <li><Link to="/games" className={isActive('/games') ? 'nav-active' : ''}>🎮 Games</Link></li>
                    <li><Link to="/ai" className={isActive('/ai') ? 'nav-active' : ''}>🎨 Create</Link></li>
                    <li>
                        <a href={MOVIE_PLANNER_URL} target="_blank" rel="noopener noreferrer" className="nav-movie-planner">
                            🤖 Recommendations
                        </a>
                    </li>
                </ul>
            </nav>
            <Link to="/login" className="nav-cta-button">
                Login
            </Link>
        </section>
    )
}
