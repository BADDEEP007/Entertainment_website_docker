import './FeaturedGames.css'
import { Link } from 'react-router-dom'

export const FeaturedGames = () => {
    const featuredGames = [
        {
            id: 1,
            title: "GTA Vice City",
            tagline: "Welcome to the 1980s. Welcome to Vice City.",
            description: "Experience the iconic open-world action game right in your browser. Explore Vice City, complete missions, and build your criminal empire in this legendary title.",
            genre: ["Action", "Open World", "Adventure"],
            image: "src/assets/image.png",
            rating: "4.8",
            players: "Single Player"
        }
    ]

    return (
        <section className='FeaturedGamesSection'>
            <div className="games-header">
                <h2 className='games-title'>Featured Games</h2>
                <p className='games-subtitle'>Handpicked titles for the ultimate browser gaming experience</p>
            </div>

            <div className='featured-games-grid'>
                {featuredGames.map(game => (
                    <div key={game.id} className='featured-game-card'>
                        <div className="game-image-container">
                            <img src={game.image} alt={game.title} className='game-image' />
                            <div className="game-overlay">
                                <button className='play-button'>▶ PLAY NOW</button>
                            </div>
                        </div>
                        
                        <div className='game-content'>
                            <div className='game-header-info'>
                                <h3 className='game-title'>{game.title}</h3>
                                <div className='game-rating'>
                                    <span className='star'>★</span>
                                    <span>{game.rating}</span>
                                </div>
                            </div>
                            
                            <p className='game-tagline'>"{game.tagline}"</p>
                            <p className='game-description'>{game.description}</p>
                            
                            <div className='game-meta'>
                                <div className='game-genres'>
                                    {game.genre.map((g, index) => (
                                        <span key={index} className='genre-tag'>{g}</span>
                                    ))}
                                </div>
                                <span className='game-players'>{game.players}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className='view-all-container'>
                <Link to="/games" className='view-all-button'>
                    View All Games →
                </Link>
            </div>
        </section>
    )
}
