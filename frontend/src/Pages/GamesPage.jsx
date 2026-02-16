import { Navbar } from "../Components/HomePage/NavBar"
import { FAQ } from "../Components/FAQ/FAQ"
import { Footer } from "../Components/Footer/Footer"
import './GamesPage.css'
import SplashCursor from "../Components/React-bits/splash_cur"
import { useNavigate } from "react-router-dom"
export const GamesPage = () => {
    const navigate = useNavigate();
    const allGames = [
        {
            id: 1,
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
            title: "Pac-Man",
            tagline: "Wakka wakka wakka!",
            description: "The timeless arcade classic. Navigate mazes, eat dots, avoid ghosts, and chase high scores in this iconic game that started it all.",
            genre: ["Arcade", "Classic", "Casual"],
            image: "src/assets/images/PAC-MECH by Calum Alexander Watt.jpg",
            rating: "4.7",
            players: "Single Player"
            
        },
        {
            id: 4,
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
            title: "Snake",
            tagline: "Grow longer, don't bite yourself.",
            description: "The classic mobile game reimagined for the browser. Control the snake, eat food, grow longer, and avoid crashing into yourself.",
            genre: ["Arcade", "Classic", "Casual"],
            image: "src/assets/images/Paint for BaiCiZhan (snake) - Lina Wong.jpg",
            rating: "4.5",
            players: "Single Player"
        },
        {
            id: 6,
            title: "Space Invaders",
            tagline: "Defend Earth from alien invasion.",
            description: "The arcade legend that launched the golden age of gaming. Shoot down waves of descending aliens before they reach the bottom.",
            genre: ["Arcade", "Shooter", "Classic"],
            image: "src/assets/images/Space Invaders Cross Stitch Pattern - Etsy UK.jpg",
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
                    <h1 className="games-hero-title">Game Library</h1>
                    <p className="games-hero-subtitle">Discover your next favorite browser game</p>
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
                                        console.log("clicked:", game.id);
                                        navigate(`/play/${game.id}`)}}>▶ PLAY</button>
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
            
            <FAQ />
            <Footer />
        </>
    )
}
