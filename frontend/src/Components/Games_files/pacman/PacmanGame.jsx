import { useEffect, useRef, useState } from 'react'
import './PacmanGame.css'

export const PacmanGame = () => {
    const canvasRef = useRef(null)
    const [score, setScore] = useState(0)
    const [lives, setLives] = useState(3)
    const [gameOver, setGameOver] = useState(false)
    const [gameWon, setGameWon] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    
    const audioRef = useRef({
        chomp: null,
        death: null,
        eatGhost: null,
        bgMusic: null
    })
    
    const gameStateRef = useRef({
        pacman: { x: 1, y: 1, direction: 'right', nextDirection: 'right' },
        ghosts: [],
        dots: [],
        powerPellets: [],
        score: 0,
        lives: 3,
        powerMode: false,
        powerModeTimer: 0
    })

    const CELL_SIZE = 30
    const PACMAN_SPEED = 150
    const GHOST_SPEED = 180

    // Maze layout (0 = wall, 1 = dot, 2 = power pellet, 3 = empty)
    const maze = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0],
        [0,2,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,2,0],
        [0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,1,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,1,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,1,0],
        [0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0],
        [0,0,0,0,1,0,0,0,3,0,3,0,0,0,1,0,0,0,0],
        [3,3,3,0,1,0,3,3,3,3,3,3,3,0,1,0,3,3,3],
        [0,0,0,0,1,0,3,0,0,0,0,0,3,0,1,0,0,0,0],
        [3,3,3,3,1,3,3,0,3,3,3,0,3,3,1,3,3,3,3],
        [0,0,0,0,1,0,3,0,0,0,0,0,3,0,1,0,0,0,0],
        [3,3,3,0,1,0,3,3,3,3,3,3,3,0,1,0,3,3,3],
        [0,0,0,0,1,0,3,0,0,0,0,0,3,0,1,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0],
        [0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,1,0],
        [0,2,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,2,0],
        [0,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,0],
        [0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0],
        [0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ]

    useEffect(() => {
        // Initialize audio
        audioRef.current.bgMusic = new Audio()
        audioRef.current.bgMusic.loop = true
        audioRef.current.bgMusic.volume = 0.3

        return () => {
            if (audioRef.current.bgMusic) {
                audioRef.current.bgMusic.pause()
            }
        }
    }, [])

    useEffect(() => {
        if (!gameStarted || gameOver || gameWon || isPaused) return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        const gameState = gameStateRef.current

        // Initialize dots and power pellets
        gameState.dots = []
        gameState.powerPellets = []
        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                if (maze[y][x] === 1) {
                    gameState.dots.push({ x, y })
                } else if (maze[y][x] === 2) {
                    gameState.powerPellets.push({ x, y })
                }
            }
        }

        // Initialize ghosts
        gameState.ghosts = [
            { x: 9, y: 9, direction: 'left', color: '#FF0000' },
            { x: 8, y: 10, direction: 'up', color: '#FFB8FF' },
            { x: 9, y: 10, direction: 'down', color: '#00FFFF' },
            { x: 10, y: 10, direction: 'right', color: '#FFB852' }
        ]

        // Keyboard controls
        const handleKeyPress = (e) => {
            const key = e.key.toLowerCase()
            if (key === 'arrowup' || key === 'w') gameState.pacman.nextDirection = 'up'
            if (key === 'arrowdown' || key === 's') gameState.pacman.nextDirection = 'down'
            if (key === 'arrowleft' || key === 'a') gameState.pacman.nextDirection = 'left'
            if (key === 'arrowright' || key === 'd') gameState.pacman.nextDirection = 'right'
            if (key === 'p') setIsPaused(prev => !prev)
        }
        window.addEventListener('keydown', handleKeyPress)

        // Game loop
        let lastTime = Date.now()
        let pacmanMoveTimer = 0
        let ghostMoveTimer = 0

        const gameLoop = () => {
            const currentTime = Date.now()
            const deltaTime = currentTime - lastTime
            lastTime = currentTime

            if (gameOver || gameWon) return

            // Update power mode timer
            if (gameState.powerMode) {
                gameState.powerModeTimer -= deltaTime
                if (gameState.powerModeTimer <= 0) {
                    gameState.powerMode = false
                }
            }

            // Move Pac-Man
            pacmanMoveTimer += deltaTime
            if (pacmanMoveTimer >= PACMAN_SPEED) {
                pacmanMoveTimer = 0
                movePacman(gameState)
            }

            // Move ghosts
            ghostMoveTimer += deltaTime
            if (ghostMoveTimer >= GHOST_SPEED) {
                ghostMoveTimer = 0
                moveGhosts(gameState)
            }

            // Check collisions
            checkCollisions(gameState)

            // Draw everything
            draw(ctx, gameState)

            requestAnimationFrame(gameLoop)
        }

        gameLoop()

        return () => {
            window.removeEventListener('keydown', handleKeyPress)
        }
    }, [gameStarted, gameOver, gameWon, isPaused])

    const movePacman = (gameState) => {
        const { pacman } = gameState
        const { nextDirection } = pacman

        // Try to move in next direction
        const nextPos = getNextPosition(pacman.x, pacman.y, nextDirection)
        if (canMove(nextPos.x, nextPos.y)) {
            pacman.direction = nextDirection
            pacman.x = nextPos.x
            pacman.y = nextPos.y
        } else {
            // Continue in current direction
            const currentPos = getNextPosition(pacman.x, pacman.y, pacman.direction)
            if (canMove(currentPos.x, currentPos.y)) {
                pacman.x = currentPos.x
                pacman.y = currentPos.y
            }
        }
    }

    const moveGhosts = (gameState) => {
        gameState.ghosts.forEach(ghost => {
            const possibleDirections = ['up', 'down', 'left', 'right'].filter(dir => {
                const pos = getNextPosition(ghost.x, ghost.y, dir)
                return canMove(pos.x, pos.y) && dir !== getOppositeDirection(ghost.direction)
            })

            if (possibleDirections.length > 0) {
                if (!gameState.powerMode) {
                    // Chase Pac-Man
                    const distances = possibleDirections.map(dir => {
                        const pos = getNextPosition(ghost.x, ghost.y, dir)
                        return {
                            dir,
                            dist: Math.abs(pos.x - gameState.pacman.x) + Math.abs(pos.y - gameState.pacman.y)
                        }
                    })
                    distances.sort((a, b) => a.dist - b.dist)
                    ghost.direction = distances[0].dir
                } else {
                    // Run away from Pac-Man
                    const distances = possibleDirections.map(dir => {
                        const pos = getNextPosition(ghost.x, ghost.y, dir)
                        return {
                            dir,
                            dist: Math.abs(pos.x - gameState.pacman.x) + Math.abs(pos.y - gameState.pacman.y)
                        }
                    })
                    distances.sort((a, b) => b.dist - a.dist)
                    ghost.direction = distances[0].dir
                }

                const nextPos = getNextPosition(ghost.x, ghost.y, ghost.direction)
                ghost.x = nextPos.x
                ghost.y = nextPos.y
            }
        })
    }

    const getNextPosition = (x, y, direction) => {
        switch (direction) {
            case 'up': return { x, y: y - 1 }
            case 'down': return { x, y: y + 1 }
            case 'left': return { x: x - 1, y }
            case 'right': return { x: x + 1, y }
            default: return { x, y }
        }
    }

    const getOppositeDirection = (direction) => {
        switch (direction) {
            case 'up': return 'down'
            case 'down': return 'up'
            case 'left': return 'right'
            case 'right': return 'left'
            default: return direction
        }
    }

    const canMove = (x, y) => {
        if (y < 0 || y >= maze.length || x < 0 || x >= maze[0].length) return false
        return maze[y][x] !== 0
    }

    const checkCollisions = (gameState) => {
        const { pacman, dots, powerPellets, ghosts } = gameState

        // Check dot collision
        const dotIndex = dots.findIndex(dot => dot.x === pacman.x && dot.y === pacman.y)
        if (dotIndex !== -1) {
            dots.splice(dotIndex, 1)
            gameState.score += 10
            setScore(gameState.score)
            playSound('chomp')

            if (dots.length === 0 && powerPellets.length === 0) {
                setGameWon(true)
                if (audioRef.current.bgMusic) audioRef.current.bgMusic.pause()
            }
        }

        // Check power pellet collision
        const pelletIndex = powerPellets.findIndex(p => p.x === pacman.x && p.y === pacman.y)
        if (pelletIndex !== -1) {
            powerPellets.splice(pelletIndex, 1)
            gameState.score += 50
            setScore(gameState.score)
            gameState.powerMode = true
            gameState.powerModeTimer = 7000
            playSound('chomp')
        }

        // Check ghost collision
        ghosts.forEach((ghost, index) => {
            if (ghost.x === pacman.x && ghost.y === pacman.y) {
                if (gameState.powerMode) {
                    // Eat ghost
                    gameState.score += 200
                    setScore(gameState.score)
                    ghost.x = 9
                    ghost.y = 9
                    playSound('eatGhost')
                } else {
                    // Lose life
                    gameState.lives -= 1
                    setLives(gameState.lives)
                    playSound('death')
                    if (gameState.lives <= 0) {
                        setGameOver(true)
                        if (audioRef.current.bgMusic) audioRef.current.bgMusic.pause()
                    } else {
                        // Reset positions
                        pacman.x = 1
                        pacman.y = 1
                        ghosts.forEach((g, i) => {
                            g.x = 9
                            g.y = 9 + (i % 2)
                        })
                    }
                }
            }
        })
    }

    const draw = (ctx, gameState) => {
        // Clear canvas
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        // Draw maze
        ctx.fillStyle = '#0000FF'
        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                if (maze[y][x] === 0) {
                    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
                }
            }
        }

        // Draw dots
        ctx.fillStyle = '#FFB852'
        gameState.dots.forEach(dot => {
            ctx.beginPath()
            ctx.arc(
                dot.x * CELL_SIZE + CELL_SIZE / 2,
                dot.y * CELL_SIZE + CELL_SIZE / 2,
                3,
                0,
                Math.PI * 2
            )
            ctx.fill()
        })

        // Draw power pellets
        ctx.fillStyle = '#FFFFFF'
        gameState.powerPellets.forEach(pellet => {
            ctx.beginPath()
            ctx.arc(
                pellet.x * CELL_SIZE + CELL_SIZE / 2,
                pellet.y * CELL_SIZE + CELL_SIZE / 2,
                6,
                0,
                Math.PI * 2
            )
            ctx.fill()
        })

        // Draw Pac-Man
        ctx.fillStyle = '#FFFF00'
        ctx.beginPath()
        ctx.arc(
            gameState.pacman.x * CELL_SIZE + CELL_SIZE / 2,
            gameState.pacman.y * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE / 2 - 2,
            0.2 * Math.PI,
            1.8 * Math.PI
        )
        ctx.lineTo(
            gameState.pacman.x * CELL_SIZE + CELL_SIZE / 2,
            gameState.pacman.y * CELL_SIZE + CELL_SIZE / 2
        )
        ctx.fill()

        // Draw ghosts
        gameState.ghosts.forEach(ghost => {
            ctx.fillStyle = gameState.powerMode ? '#0000FF' : ghost.color
            ctx.beginPath()
            ctx.arc(
                ghost.x * CELL_SIZE + CELL_SIZE / 2,
                ghost.y * CELL_SIZE + CELL_SIZE / 2,
                CELL_SIZE / 2 - 2,
                Math.PI,
                0
            )
            ctx.lineTo(ghost.x * CELL_SIZE + CELL_SIZE - 2, ghost.y * CELL_SIZE + CELL_SIZE - 2)
            ctx.lineTo(ghost.x * CELL_SIZE + CELL_SIZE - 6, ghost.y * CELL_SIZE + CELL_SIZE / 2 + 4)
            ctx.lineTo(ghost.x * CELL_SIZE + CELL_SIZE / 2, ghost.y * CELL_SIZE + CELL_SIZE - 2)
            ctx.lineTo(ghost.x * CELL_SIZE + 6, ghost.y * CELL_SIZE + CELL_SIZE / 2 + 4)
            ctx.lineTo(ghost.x * CELL_SIZE + 2, ghost.y * CELL_SIZE + CELL_SIZE - 2)
            ctx.closePath()
            ctx.fill()

            // Eyes
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(ghost.x * CELL_SIZE + 8, ghost.y * CELL_SIZE + 10, 5, 5)
            ctx.fillRect(ghost.x * CELL_SIZE + 17, ghost.y * CELL_SIZE + 10, 5, 5)
            ctx.fillStyle = '#000000'
            ctx.fillRect(ghost.x * CELL_SIZE + 10, ghost.y * CELL_SIZE + 12, 2, 2)
            ctx.fillRect(ghost.x * CELL_SIZE + 19, ghost.y * CELL_SIZE + 12, 2, 2)
        })
    }

    const playSound = (type) => {
        // Placeholder for sound effects
        // In production, load actual audio files
    }

    const startGame = () => {
        setGameStarted(true)
        setScore(0)
        setLives(3)
        setGameOver(false)
        setGameWon(false)
        setIsPaused(false)
        gameStateRef.current = {
            pacman: { x: 1, y: 1, direction: 'right', nextDirection: 'right' },
            ghosts: [],
            dots: [],
            powerPellets: [],
            score: 0,
            lives: 3,
            powerMode: false,
            powerModeTimer: 0
        }
        if (audioRef.current.bgMusic) {
            audioRef.current.bgMusic.play().catch(() => {})
        }
    }

    const restartGame = () => {
        startGame()
    }

    return (
        <div className="pacman-game-container">
            {!gameStarted ? (
                <div className="game-start-screen">
                    <h1 className="game-title">PAC-MAN</h1>
                    <p className="game-instructions">Eat all dots and avoid the ghosts!</p>
                    <button onClick={startGame} className="start-button">START GAME</button>
                    <div className="controls-info">
                        <p>Arrow Keys or WASD to move</p>
                        <p>Eat power pellets to turn ghosts blue</p>
                        <p>P to pause</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="game-info">
                        <div className="info-item">
                            <span className="info-label">Score:</span>
                            <span className="info-value">{score}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Lives:</span>
                            <span className="info-value">{'❤️'.repeat(lives)}</span>
                        </div>
                    </div>

                    <canvas
                        ref={canvasRef}
                        width={maze[0].length * CELL_SIZE}
                        height={maze.length * CELL_SIZE}
                        className="game-canvas"
                    />

                    {isPaused && (
                        <div className="game-overlay">
                            <div className="game-message">
                                <h2>⏸️ PAUSED</h2>
                                <p>Press P to continue</p>
                            </div>
                        </div>
                    )}

                    {(gameOver || gameWon) && (
                <div className="game-overlay">
                    <div className="game-message">
                        <h2>{gameWon ? '🎉 YOU WIN!' : '💀 GAME OVER'}</h2>
                        <p>Final Score: {score}</p>
                        <button onClick={restartGame} className="restart-button">
                            Play Again
                        </button>
                    </div>
                </div>
            )}
                </>
            )}
        </div>
    )
}
