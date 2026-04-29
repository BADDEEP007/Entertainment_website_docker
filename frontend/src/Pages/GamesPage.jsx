import { Navbar } from "../Components/HomePage/NavBar"
import { FAQ } from "../Components/FAQ/FAQ"
import { Footer } from "../Components/Footer/Footer"
import './GamesPage.css'
import SplashCursor from "../Components/React-bits/splash_cur"
import { useNavigate } from "react-router-dom"

const MOVIE_PLANNER_URL = import.meta.env.VITE_MOVIE_PLANNER_URL ?? "http://127.0.0.1:5000/new"

export const GamesPage = () => {
    const navigate = useNavigate();
    const allGames = [
        {
            id: 1,
            slug: "vicecity",
            title: "GTA Vice City",
            tagline: "Welcome to the 1980s. Welcome to Vice City.",
            description: "Step into the neon-soaked streets of Vice City in this iconic open-world adventure. Build your criminal empire, complete thrilling missions, and experience the ultimate 80s nostalgia.",
            genre: ["Action", "Open World", "Adventure"],
            image: "src/assets/image.png",
            rating: "4.8",
            players: "Single Player"
        },
        {
            id: 2,
            slug: "doom",
            title: "DOOM (1993)",
            tagline: "Rip and tear, until it is done.",
            description: "The legendary first-person shooter that defined a genre. Fight through hordes of demons from Hell in this classic fast-paced action game that runs perfectly in your browser.",
            genre: ["FPS", "Action", "Classic"],
            image: "src/assets/images/image.png",
            rating: "4.9",
            players: "Single Player"
        },
        {
            id: 3,
            slug: "pacman",
            title: "Pac-Man",
            tagline: "Wakka wakka wakka!",
            description: "The timeless arcade classic. Navigate mazes, eat dots, avoid ghosts, and chase high scores in this iconic game that started it all.",
            genre: ["Arcade", "Classic", "Casual"],
            image: "src/assets/images/PAC-MECHbyCalumAlexander Watt.jpg",
            rating: "4.7",
            players: "Single Player"
            
        },
        {
            id: 4,
            slug: "tetris",
            title: "Tetris",
            tagline: "Clear lines, chase perfection.",
            description: "The most addictive puzzle game ever created. Rotate and place falling blocks to clear lines and achieve the perfect game.",
            genre: ["Puzzle", "Classic", "Arcade"],
            image: "src/assets/images/download.jpg",
            rating: "4.8",
            players: "Single Player"
        },
        {
            id: 5,
            slug: "snake",
            title: "Snake",
            tagline: "Grow longer, don't bite yourself.",
            description: "The classic mobile game reimagined for the browser. Control the snake, eat food, grow longer, and avoid crashing into yourself.",
            genre: ["Arcade", "Classic", "Casual"],
            image: "src/assets/images/PaintforBaiCiZhan(snake)-LinaWong.jpg",
            rating: "4.5",
            players: "Single Player"
        },
        {
            id: 6,
            slug: "space-invaders",
            title: "Space Invaders",
            tagline: "Defend Earth from alien invasion.",
            description: "The arcade legend that launched the golden age of gaming. Shoot down waves of descending aliens before they reach the bottom.",
            genre: ["Arcade", "Shooter", "Classic"],
            image: "src/assets/images/SpaceInvadersCrossStitchPattern-EtsyUK.jpg",
            rating: "4.6",
            players: "Single Player"
        }
    ]

    return (
        <>
                 <SplashCursor/>

            <div className="games-page-header">
                <Navbar />
                <div className="games-hero">
                    <h1 className="games-hero-title">Play Games Based on Your Mood</h1>
                    <p className="games-hero-subtitle">Pick a vibe and dive in — action, puzzle, or classic arcade</p>
                </div>
            </div>

            <section className="all-games-section">
                <div className="games-grid">
                    {allGames.map(game => (
                        <div key={game.id} className="game-card">
                            <div className="game-card-image-container">
                                <img src={game.image} alt={game.title} className="game-card-image" />
                                <div className="game-card-overlay">
                                    <button className="game-play-btn" onClick={() => {
                                        
                                    if (game.slug == 'vicecity'){
                                        window.open(import.meta.env.VITE_URL,"_blank")
                                    }
                                    else{
                                        navigate(`/play/${game.slug}`)
                                    }
                                    
                                    }
                                    
                                    
                                    }
                                        
                                        
                                        >▶ PLAY</button>
                                </div>
                                <div className="game-rating-badge">
                                    <span className="rating-star">★</span>
                                    <span>{game.rating}</span>
                                </div>
                            </div>

                            <div className="game-card-content">
                                <h3 className="game-card-title">{game.title}</h3>
                                <p className="game-card-tagline">"{game.tagline}"</p>
                                <p className="game-card-description">{game.description}</p>

                                <div className="game-card-footer">
                                    <div className="game-card-genres">
                                        {game.genre.map((g, index) => (
                                            <span key={index} className="game-genre-tag">{g}</span>
                                        ))}
                                    </div>
                                    <span className="game-card-players">{game.players}</span>
                                </div>
                            </div>
                        </div>
                   
                    ))}
                </div>
            </section>

            {/* Cross-feature link to Recommendations */}
            <div className="games-crosslink-banner">
                <div className="crosslink-content">
                    <span className="crosslink-icon">🤖</span>
                    <div>
                        <h3>Not sure what to play?</h3>
                        <p>Let AI recommend a movie that matches your mood instead</p>
                    </div>
                    <a href={MOVIE_PLANNER_URL} target="_blank" rel="noopener noreferrer" className="crosslink-btn">
                        Get Recommendations →
                    </a>
                </div>
            </div>

            <FAQ />
            <Footer />
        </>
    )
}
