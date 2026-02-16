import { useEffect, useRef, useState } from 'react'
import './TetrisGame.css'

export const TetrisGame = () => {
    const canvasRef = useRef(null)
    const [score, setScore] = useState(0)
    const [level, setLevel] = useState(1)
    const [lines, setLines] = useState(0)
    const [gameOver, setGameOver] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    
    const audioRef = useRef({
        move: null,
        rotate: null,
        clear: null,
        gameOver: null,
        bgMusic: null
    })

    const COLS = 10
    const ROWS = 20
    const CELL_SIZE = 30
    const COLORS = ['#000000', '#FF0D72', '#0DC2FF', '#0DFF72', '#F538FF', '#FF8E0D', '#FFE138', '#3877FF']

    const SHAPES = [
        [[1,1,1,1]], // I
        [[1,1],[1,1]], // O
        [[0,1,0],[1,1,1]], // T
        [[1,0,0],[1,1,1]], // L
        [[0,0,1],[1,1,1]], // J
        [[0,1,1],[1,1,0]], // S
        [[1,1,0],[0,1,1]]  // Z
    ]

    const gameStateRef = useRef({
        board: Array(ROWS).fill(null).map(() => Array(COLS).fill(0)),
        currentPiece: null,
        currentX: 0,
        currentY: 0,
        currentColor: 1,
        dropCounter: 0,
        dropInterval: 1000,
        lastTime: 0
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

        if (!gameState.currentPiece) {
            spawnPiece(gameState)
        }

        const handleKeyPress = (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a') movePiece(gameState, -1)
            if (e.key === 'ArrowRight' || e.key === 'd') movePiece(gameState, 1)
            if (e.key === 'ArrowDown' || e.key === 's') dropPiece(gameState)
            if (e.key === 'ArrowUp' || e.key === 'w') rotatePiece(gameState)
            if (e.key === ' ') hardDrop(gameState)
            if (e.key === 'p') setIsPaused(prev => !prev)
        }
        window.addEventListener('keydown', handleKeyPress)

        let animationId
        const gameLoop = (time = 0) => {
            const deltaTime = time - gameState.lastTime
            gameState.lastTime = time
            gameState.dropCounter += deltaTime

            if (gameState.dropCounter > gameState.dropInterval) {
                dropPiece(gameState)
                gameState.dropCounter = 0
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

    const spawnPiece = (gameState) => {
        const shapeIndex = Math.floor(Math.random() * SHAPES.length)
        gameState.currentPiece = SHAPES[shapeIndex]
        gameState.currentColor = shapeIndex + 1
        gameState.currentX = Math.floor(COLS / 2) - Math.floor(gameState.currentPiece[0].length / 2)
        gameState.currentY = 0

        if (checkCollision(gameState, 0, 0)) {
            setGameOver(true)
            playSound('gameOver')
            if (audioRef.current.bgMusic) audioRef.current.bgMusic.pause()
        }
    }

    const movePiece = (gameState, dir) => {
        if (!checkCollision(gameState, dir, 0)) {
            gameState.currentX += dir
            playSound('move')
        }
    }

    const dropPiece = (gameState) => {
        if (!checkCollision(gameState, 0, 1)) {
            gameState.currentY++
        } else {
            mergePiece(gameState)
            clearLines(gameState)
            spawnPiece(gameState)
        }
    }

    const hardDrop = (gameState) => {
        while (!checkCollision(gameState, 0, 1)) {
            gameState.currentY++
        }
        mergePiece(gameState)
        clearLines(gameState)
        spawnPiece(gameState)
    }

    const rotatePiece = (gameState) => {
        const rotated = gameState.currentPiece[0].map((_, i) =>
            gameState.currentPiece.map(row => row[i]).reverse()
        )
        const previousPiece = gameState.currentPiece
        gameState.currentPiece = rotated

        if (checkCollision(gameState, 0, 0)) {
            gameState.currentPiece = previousPiece
        } else {
            playSound('rotate')
        }
    }

    const checkCollision = (gameState, offsetX, offsetY) => {
        for (let y = 0; y < gameState.currentPiece.length; y++) {
            for (let x = 0; x < gameState.currentPiece[y].length; x++) {
                if (gameState.currentPiece[y][x]) {
                    const newX = gameState.currentX + x + offsetX
                    const newY = gameState.currentY + y + offsetY

                    if (newX < 0 || newX >= COLS || newY >= ROWS) return true
                    if (newY >= 0 && gameState.board[newY][newX]) return true
                }
            }
        }
        return false
    }

    const mergePiece = (gameState) => {
        for (let y = 0; y < gameState.currentPiece.length; y++) {
            for (let x = 0; x < gameState.currentPiece[y].length; x++) {
                if (gameState.currentPiece[y][x]) {
                    gameState.board[gameState.currentY + y][gameState.currentX + x] = gameState.currentColor
                }
            }
        }
    }

    const clearLines = (gameState) => {
        let linesCleared = 0
        for (let y = ROWS - 1; y >= 0; y--) {
            if (gameState.board[y].every(cell => cell !== 0)) {
                gameState.board.splice(y, 1)
                gameState.board.unshift(Array(COLS).fill(0))
                linesCleared++
                y++
            }
        }

        if (linesCleared > 0) {
            const points = [0, 100, 300, 500, 800][linesCleared]
            setScore(prev => prev + points)
            setLines(prev => {
                const newLines = prev + linesCleared
                setLevel(Math.floor(newLines / 10) + 1)
                gameState.dropInterval = Math.max(100, 1000 - Math.floor(newLines / 10) * 100)
                return newLines
            })
            playSound('clear')
        }
    }

    const draw = (ctx, gameState) => {
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        // Draw board
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                if (gameState.board[y][x]) {
                    ctx.fillStyle = COLORS[gameState.board[y][x]]
                    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1)
                }
            }
        }

        // Draw current piece
        if (gameState.currentPiece) {
            ctx.fillStyle = COLORS[gameState.currentColor]
            for (let y = 0; y < gameState.currentPiece.length; y++) {
                for (let x = 0; x < gameState.currentPiece[y].length; x++) {
                    if (gameState.currentPiece[y][x]) {
                        ctx.fillRect(
                            (gameState.currentX + x) * CELL_SIZE,
                            (gameState.currentY + y) * CELL_SIZE,
                            CELL_SIZE - 1,
                            CELL_SIZE - 1
                        )
                    }
                }
            }
        }

        // Draw grid
        ctx.strokeStyle = '#333333'
        for (let y = 0; y <= ROWS; y++) {
            ctx.beginPath()
            ctx.moveTo(0, y * CELL_SIZE)
            ctx.lineTo(COLS * CELL_SIZE, y * CELL_SIZE)
            ctx.stroke()
        }
        for (let x = 0; x <= COLS; x++) {
            ctx.beginPath()
            ctx.moveTo(x * CELL_SIZE, 0)
            ctx.lineTo(x * CELL_SIZE, ROWS * CELL_SIZE)
            ctx.stroke()
        }
    }

    const playSound = (type) => {
        // Placeholder for sound effects
        // In production, load actual audio files
    }

    const startGame = () => {
        setGameStarted(true)
        setScore(0)
        setLevel(1)
        setLines(0)
        setGameOver(false)
        setIsPaused(false)
        gameStateRef.current = {
            board: Array(ROWS).fill(null).map(() => Array(COLS).fill(0)),
            currentPiece: null,
            currentX: 0,
            currentY: 0,
            currentColor: 1,
            dropCounter: 0,
            dropInterval: 1000,
            lastTime: 0
        }
        if (audioRef.current.bgMusic) {
            audioRef.current.bgMusic.play().catch(() => {})
        }
    }

    const restartGame = () => {
        startGame()
    }

    return (
        <div className="tetris-game-container">
            {!gameStarted ? (
                <div className="game-start-screen">
                    <h1 className="game-title">TETRIS</h1>
                    <p className="game-instructions">Stack blocks and clear lines!</p>
                    <button onClick={startGame} className="start-button">START GAME</button>
                    <div className="controls-info">
                        <p>← → : Move</p>
                        <p>↑ : Rotate</p>
                        <p>↓ : Soft Drop</p>
                        <p>SPACE : Hard Drop</p>
                        <p>P : Pause</p>
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
                            <span className="info-label">Level:</span>
                            <span className="info-value">{level}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Lines:</span>
                            <span className="info-value">{lines}</span>
                        </div>
                    </div>

                    <canvas
                        ref={canvasRef}
                        width={COLS * CELL_SIZE}
                        height={ROWS * CELL_SIZE}
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
                                <p>Score: {score}</p>
                                <p>Lines: {lines}</p>
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
