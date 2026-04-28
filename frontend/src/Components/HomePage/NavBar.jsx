import './NavBar.css'
import { Link } from 'react-router-dom'

const MOVIE_PLANNER_URL = import.meta.env.VITE_MOVIE_PLANNER_URL ?? "http://127.0.0.1:5000/new"

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
                    <li><Link to="/ai">Artist</Link></li>
                    <li>
                        <a href={MOVIE_PLANNER_URL} target="_blank" rel="noopener noreferrer" className="nav-movie-planner">
                            🎬 Movie Planner
                        </a>
                    </li>
                    <li><Link to="/#faq">FAQ</Link></li>
                </ul>
            </nav>
            <Link to="/login" className="nav-cta-button">
                Login
            </Link>
        </section>
    )
}
