import { useEffect, useRef, useState } from 'react'
import './SnakeGame.css'

export const SnakeGame = () => {
    const canvasRef = useRef(null)
    const [score, setScore] = useState(0)
    const [highScore, setHighScore] = useState(0)
    const [gameOver, setGameOver] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    
    const audioRef = useRef({
        eat: null,
        gameOver: null,
        bgMusic: null
    })

    const CELL_SIZE = 25
    const GRID_WIDTH = 20
    const GRID_HEIGHT = 20
    const INITIAL_SPEED = 150

    const gameStateRef = useRef({
        snake: [{ x: 10, y: 10 }],
        direction: { x: 1, y: 0 },
        nextDirection: { x: 1, y: 0 },
        food: { x: 15, y: 15 },
        speed: INITIAL_SPEED,
        lastMoveTime: 0
    })

    useEffect(() => {
        // Create audio elements
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
        if (!gameStarted || gameOver || isPaused) return

        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const gameState = gameStateRef.current

        const handleKeyPress = (e) => {
            const { direction, nextDirection } = gameState
            
            if ((e.key === 'ArrowUp' || e.key === 'w') && direction.y === 0) {
                gameState.nextDirection = { x: 0, y: -1 }
            }
            if ((e.key === 'ArrowDown' || e.key === 's') && direction.y === 0) {
                gameState.nextDirection = { x: 0, y: 1 }
            }
            if ((e.key === 'ArrowLeft' || e.key === 'a') && direction.x === 0) {
                gameState.nextDirection = { x: -1, y: 0 }
            }
            if ((e.key === 'ArrowRight' || e.key === 'd') && direction.x === 0) {
                gameState.nextDirection = { x: 1, y: 0 }
            }
            if (e.key === 'p') {
                setIsPaused(prev => !prev)
            }
        }
        window.addEventListener('keydown', handleKeyPress)

        let animationId
        const gameLoop = (time = 0) => {
            const timeSinceLastMove = time - gameState.lastMoveTime

            if (timeSinceLastMove >= gameState.speed) {
                gameState.lastMoveTime = time
                updateGame(gameState)
            }

            draw(ctx, gameState)
            animationId = requestAnimationFrame(gameLoop)
        }

        gameLoop()

        return () => {
            window.removeEventListener('keydown', handleKeyPress)
            cancelAnimationFrame(animationId)
        }
    }, [gameStarted, gameOver, isPaused])

    const updateGame = (gameState) => {
        gameState.direction = gameState.nextDirection

        const head = { ...gameState.snake[0] }
        head.x += gameState.direction.x
        head.y += gameState.direction.y

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
            endGame()
            return
        }

        // Check self collision
        if (gameState.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            endGame()
            return
        }

        gameState.snake.unshift(head)

        // Check food collision
        if (head.x === gameState.food.x && head.y === gameState.food.y) {
            setScore(prev => {
                const newScore = prev + 10
                if (newScore > highScore) {
                    setHighScore(newScore)
                }
                return newScore
            })
            spawnFood(gameState)
            playSound('eat')
            // Increase speed slightly
            gameState.speed = Math.max(50, gameState.speed - 2)
        } else {
            gameState.snake.pop()
        }
    }

    const spawnFood = (gameState) => {
        let newFood
        do {
            newFood = {
                x: Math.floor(Math.random() * GRID_WIDTH),
                y: Math.floor(Math.random() * GRID_HEIGHT)
            }
        } while (gameState.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y))
        
        gameState.food = newFood
    }

    const draw = (ctx, gameState) => {
        // Clear canvas
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        // Draw grid
        ctx.strokeStyle = '#1a1a1a'
        for (let x = 0; x <= GRID_WIDTH; x++) {
            ctx.beginPath()
            ctx.moveTo(x * CELL_SIZE, 0)
            ctx.lineTo(x * CELL_SIZE, GRID_HEIGHT * CELL_SIZE)
            ctx.stroke()
        }
        for (let y = 0; y <= GRID_HEIGHT; y++) {
            ctx.beginPath()
            ctx.moveTo(0, y * CELL_SIZE)
            ctx.lineTo(GRID_WIDTH * CELL_SIZE, y * CELL_SIZE)
            ctx.stroke()
        }

        // Draw snake
        gameState.snake.forEach((segment, index) => {
            if (index === 0) {
                // Head
                ctx.fillStyle = '#0DFF72'
                ctx.fillRect(
                    segment.x * CELL_SIZE + 1,
                    segment.y * CELL_SIZE + 1,
                    CELL_SIZE - 2,
                    CELL_SIZE - 2
                )
                // Eyes
                ctx.fillStyle = '#000'
                const eyeSize = 3
                const eyeOffset = 6
                if (gameState.direction.x === 1) { // Right
                    ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - eyeOffset, segment.y * CELL_SIZE + 5, eyeSize, eyeSize)
                    ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - eyeOffset, segment.y * CELL_SIZE + CELL_SIZE - 8, eyeSize, eyeSize)
                } else if (gameState.direction.x === -1) { // Left
                    ctx.fillRect(segment.x * CELL_SIZE + eyeOffset - eyeSize, segment.y * CELL_SIZE + 5, eyeSize, eyeSize)
                    ctx.fillRect(segment.x * CELL_SIZE + eyeOffset - eyeSize, segment.y * CELL_SIZE + CELL_SIZE - 8, eyeSize, eyeSize)
                } else if (gameState.direction.y === -1) { // Up
                    ctx.fillRect(segment.x * CELL_SIZE + 5, segment.y * CELL_SIZE + eyeOffset - eyeSize, eyeSize, eyeSize)
                    ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - 8, segment.y * CELL_SIZE + eyeOffset - eyeSize, eyeSize, eyeSize)
                } else { // Down
                    ctx.fillRect(segment.x * CELL_SIZE + 5, segment.y * CELL_SIZE + CELL_SIZE - eyeOffset, eyeSize, eyeSize)
                    ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - 8, segment.y * CELL_SIZE + CELL_SIZE - eyeOffset, eyeSize, eyeSize)
                }
            } else {
                // Body
                const gradient = ctx.createLinearGradient(
                    segment.x * CELL_SIZE,
                    segment.y * CELL_SIZE,
                    segment.x * CELL_SIZE + CELL_SIZE,
                    segment.y * CELL_SIZE + CELL_SIZE
                )
                gradient.addColorStop(0, '#0DFF72')
                gradient.addColorStop(1, '#0DC2FF')
                ctx.fillStyle = gradient
                ctx.fillRect(
                    segment.x * CELL_SIZE + 2,
                    segment.y * CELL_SIZE + 2,
                    CELL_SIZE - 4,
                    CELL_SIZE - 4
                )
            }
        })

        // Draw food
        ctx.fillStyle = '#FF0D72'
        ctx.beginPath()
        ctx.arc(
            gameState.food.x * CELL_SIZE + CELL_SIZE / 2,
            gameState.food.y * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE / 2 - 3,
            0,
            Math.PI * 2
        )
        ctx.fill()
    }

    const playSound = (type) => {
        // Placeholder for sound effects
    }

    const endGame = () => {
        setGameOver(true)
        playSound('gameOver')
        if (audioRef.current.bgMusic) {
            audioRef.current.bgMusic.pause()
        }
    }

    const startGame = () => {
        setGameStarted(true)
        setScore(0)
        setGameOver(false)
        setIsPaused(false)
        gameStateRef.current = {
            snake: [{ x: 10, y: 10 }],
            direction: { x: 1, y: 0 },
            nextDirection: { x: 1, y: 0 },
            food: { x: 15, y: 15 },
            speed: INITIAL_SPEED,
            lastMoveTime: 0
        }
        if (audioRef.current.bgMusic) {
            audioRef.current.bgMusic.play().catch(() => {})
        }
    }

    const restartGame = () => {
        startGame()
    }

    return (
        <div className="snake-game-container">
            {!gameStarted ? (
                <div className="game-start-screen">
                    <h1 className="game-title">SNAKE</h1>
                    <p className="game-instructions">Eat food, grow longer, don't bite yourself!</p>
                    <button onClick={startGame} className="start-button">START GAME</button>
                    <div className="controls-info">
                        <p>Arrow Keys or WASD to move</p>
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
                            <span className="info-label">High Score:</span>
                            <span className="info-value">{highScore}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Length:</span>
                            <span className="info-value">{gameStateRef.current.snake.length}</span>
                        </div>
                    </div>

                    <canvas
                        ref={canvasRef}
                        width={GRID_WIDTH * CELL_SIZE}
                        height={GRID_HEIGHT * CELL_SIZE}
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

                    {gameOver && (
                        <div className="game-overlay">
                            <div className="game-message">
                                <h2>💀 GAME OVER</h2>
                                <p>Final Score: {score}</p>
                                <p>Snake Length: {gameStateRef.current.snake.length}</p>
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
