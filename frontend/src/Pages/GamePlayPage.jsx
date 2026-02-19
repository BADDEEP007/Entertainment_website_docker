import { useParams, useNavigate } from 'react-router-dom'
import { PacmanGame } from '../Components/Games_files/pacman/PacmanGame'
import { TetrisGame } from '../Components/Games_files/tetris/TetrisGame'
import { SnakeGame } from '../Components/Games_files/snake/SnakeGame'
import './GamePlayPage.css'
import { Vicecity } from '../Components/Games_files/ViceCity/Vicecity'

export const GamePlayPage = () => {

    const { gameId } = useParams()
    const navigate = useNavigate()

    const games = {
        'pacman': {
            name: 'Pac-Man',
            component: <PacmanGame />,
            description: 'Classic arcade maze chase game'
        },
        'tetris': {
            name: 'Tetris',
            component: <TetrisGame />,
            description: 'Block stacking puzzle game'
        },
        'snake': {
            name: 'Snake',
            component: <SnakeGame />,
            description: 'Classic snake game'
        },
        'space-invaders': {
            name: 'Space Invaders',
            component: <div className="coming-soon">Space Invaders - Coming Soon!</div>,
            description: 'Retro space shooter'
        },
        'doom': {
            name: 'DOOM',
            component: <div className="coming-soon">DOOM - Coming Soon!</div>,
            description: 'Classic FPS shooter'
        },
        'vice-city': {
            name: 'GTA Vice City',
            component:'vicecity',
            description: 'Open world action adventure'
        }
    }

    console.log(import.meta.env.VITE_API_URL)
    console.log("ENV OBJECT:", import.meta.env)

    const currentGame = games[gameId]

    if (!currentGame) {
        return (
            <div className="game-play-page">
                <div className="arcade-header">
                    <button onClick={() => navigate('/games')} className="back-button">
                        ← Back to Games
                    </button>
                    <h1 className="arcade-title">Game Not Found</h1>
                </div>
                <div className="game-not-found">
                    <p>The game you're looking for doesn't exist.</p>
                    <button onClick={() => navigate('/games')} className="arcade-button">
                        Browse Games
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="game-play-page">
            {/* Arcade-style scanlines */}
            <div className="scanlines"></div>
            
            {/* CRT effect overlay */}
            <div className="crt-overlay"></div>

            {/* Floating particles */}
            <div className="arcade-particles">
                <div className="particle particle-1">◆</div>
                <div className="particle particle-2">◇</div>
                <div className="particle particle-3">◈</div>
                <div className="particle particle-4">◆</div>
                <div className="particle particle-5">◇</div>
                <div className="particle particle-6">◈</div>
            </div>

            <div className="arcade-header">
                <button onClick={() => navigate('/games')} className="back-button">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Back to Arcade</span>
                </button>
                
                <div className="game-title-container">
                    <div className="arcade-badge">
                        <span className="badge-dot"></span>
                        <span className="badge-text">Now Playing</span>
                    </div>
                    <h1 className="arcade-title">{currentGame.name}</h1>
                    <p className="arcade-subtitle">{currentGame.description}</p>
                </div>

                <div className="arcade-controls-hint">
                    <span className="controls-icon">🎮</span>
                    <span>Use keyboard controls</span>
                </div>
            </div>

            <div className="game-container">
                <div className="arcade-frame">
                    <div className="frame-corner frame-corner-tl"></div>
                    <div className="frame-corner frame-corner-tr"></div>
                    <div className="frame-corner frame-corner-bl"></div>
                    <div className="frame-corner frame-corner-br"></div>
                    
                    <div className="game-screen">
                        {currentGame.component === "vicecity" ? (
    <button onClick={() => window.open("http://localhost:8000", "_blank")}>
      Launch Vice City
    </button>
  ) : (
    currentGame.component
  )}
                    </div>
                </div>
            </div>

            <div className="arcade-footer">
                <div className="arcade-info">
                    <div className="info-box">
                        <span className="info-icon">🕹️</span>
                        <span>Classic Arcade</span>
                    </div>
                    <div className="info-box">
                        <span className="info-icon">⚡</span>
                        <span>WebAssembly Powered</span>
                    </div>
                    <div className="info-box">
                        <span className="info-icon">🌐</span>
                        <span>Browser Based</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
