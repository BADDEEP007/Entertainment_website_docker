# Games Documentation - Master Overview

## Introduction

This document provides a high-level overview of all three games and the common concepts they share. For detailed documentation on each game, see:

- [Pac-Man Documentation](./PACMAN_DOCUMENTATION.md)
- [Tetris Documentation](./TETRIS_DOCUMENTATION.md)
- [Snake Documentation](./SNAKE_DOCUMENTATION.md)

---

## Common Technologies & Concepts

### 1. React Hooks

All three games use the same React hooks for state management:

#### `useState` - UI State
```javascript
const [score, setScore] = useState(0)
const [gameOver, setGameOver] = useState(false)
```

**When to use**: Data that affects what the user sees
- Score display
- Game over screen
- Lives counter

#### `useRef` - Game State
```javascript
const gameStateRef = useRef({ positions, speed, etc })
```

**When to use**: Data that changes every frame
- Character positions
- Movement timers
- Game board state

**Why the difference?**
- `useState` triggers re-render (slow if used 60 times/second)
- `useRef` doesn't trigger re-render (fast for game logic)

#### `useEffect` - Lifecycle Management
```javascript
useEffect(() => {
    // Setup code
    return () => {
        // Cleanup code
    }
}, [dependencies])
```

**When to use**:
- Starting game loop
- Adding event listeners
- Loading audio
- Cleaning up on unmount

---

### 2. HTML5 Canvas

All games use Canvas for rendering:

```javascript
const canvas = canvasRef.current
const ctx = canvas.getContext('2d')
```

#### Basic Drawing Operations

**Rectangle**:
```javascript
ctx.fillStyle = '#FF0000'  // Red
ctx.fillRect(x, y, width, height)
```

**Circle**:
```javascript
ctx.beginPath()
ctx.arc(centerX, centerY, radius, startAngle, endAngle)
ctx.fill()
```

**Line**:
```javascript
ctx.beginPath()
ctx.moveTo(x1, y1)
ctx.lineTo(x2, y2)
ctx.stroke()
```

#### Canvas Coordinate System

```
(0,0) ────────► X
  │
  │
  │
  ▼
  Y
```

- Origin (0,0) is top-left
- X increases to the right
- Y increases downward
- All measurements in pixels

---

### 3. Game Loop Pattern

All games use the same game loop structure:

```javascript
const gameLoop = (time) => {
    // 1. Calculate delta time
    const deltaTime = time - lastTime
    lastTime = time

    // 2. Update game state
    updateGame(deltaTime)

    // 3. Draw everything
    draw(ctx, gameState)

    // 4. Request next frame
    requestAnimationFrame(gameLoop)
}
```

#### Why This Pattern?

**Delta Time**:
- Measures time since last frame
- Makes game speed consistent
- Works on slow and fast computers

**Separation of Concerns**:
- Update logic separate from rendering
- Easy to debug
- Can update at different rate than rendering

**requestAnimationFrame**:
- Browser-optimized
- Runs at 60 FPS (usually)
- Pauses when tab not visible

---

### 4. Grid-Based Movement

All games use grid coordinates:

```javascript
// Grid position
const gridX = 5
const gridY = 3

// Convert to pixels
const pixelX = gridX * CELL_SIZE
const pixelY = gridY * CELL_SIZE
```

#### Why Grids?

**Advantages**:
- Simpler collision detection
- Easier to understand
- Classic retro feel
- Less computation

**Example**:
```
Grid (3x3):
[0,0] [1,0] [2,0]
[0,1] [1,1] [2,1]
[0,2] [1,2] [2,2]

With CELL_SIZE = 30:
Pixel (0,0) to (90,90)
```

---

### 5. Collision Detection

Each game has different collision needs:

#### Pac-Man: Point Collision
```javascript
if (pacman.x === dot.x && pacman.y === dot.y) {
    // Collision!
}
```
- Simple equality check
- Works because everything is on grid

#### Tetris: Shape Collision
```javascript
for (let y = 0; y < piece.length; y++) {
    for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x] && board[newY + y][newX + x]) {
            // Collision!
        }
    }
}
```
- Check each cell of piece
- Against board cells
- More complex due to shapes

#### Snake: Array Search
```javascript
if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    // Collision!
}
```
- Check if head hits any body segment
- Uses `.some()` for efficiency

---

### 6. Time-Based Updates

All games use timers for movement:

```javascript
let moveTimer = 0
const MOVE_INTERVAL = 150  // milliseconds

const update = (deltaTime) => {
    moveTimer += deltaTime
    
    if (moveTimer >= MOVE_INTERVAL) {
        moveTimer = 0
        moveCharacter()
    }
}
```

#### How It Works

**Frame 1**: deltaTime = 16ms
```
moveTimer = 0 + 16 = 16ms
16 < 150, so don't move yet
```

**Frame 2**: deltaTime = 16ms
```
moveTimer = 16 + 16 = 32ms
32 < 150, so don't move yet
```

**...continues...**

**Frame 10**: deltaTime = 16ms
```
moveTimer = 144 + 16 = 160ms
160 >= 150, so MOVE!
Reset moveTimer to 0
```

---

### 7. Input Handling

All games handle keyboard input:

```javascript
const handleKeyPress = (e) => {
    if (e.key === 'ArrowUp') {
        // Move up
    }
    if (e.key === 'ArrowDown') {
        // Move down
    }
    // etc...
}

window.addEventListener('keydown', handleKeyPress)
```

#### Input Queue Pattern

Used in Pac-Man and Snake:

```javascript
// Store next direction
gameState.nextDirection = newDirection

// Apply on next move
gameState.direction = gameState.nextDirection
```

**Why?**
- Prevents missed inputs
- Allows buffering
- Smoother controls

---

## Common JavaScript Concepts

### 1. Array Methods

#### `.forEach()` - Loop Through All
```javascript
array.forEach((item, index) => {
    console.log(item, index)
})
```

#### `.map()` - Transform Array
```javascript
const doubled = [1, 2, 3].map(x => x * 2)
// [2, 4, 6]
```

#### `.filter()` - Keep Some Items
```javascript
const evens = [1, 2, 3, 4].filter(x => x % 2 === 0)
// [2, 4]
```

#### `.some()` - Test If Any Match
```javascript
const hasNegative = [1, -2, 3].some(x => x < 0)
// true
```

#### `.every()` - Test If All Match
```javascript
const allPositive = [1, 2, 3].every(x => x > 0)
// true
```

#### `.find()` - Get First Match
```javascript
const first = [1, 2, 3].find(x => x > 1)
// 2
```

#### `.findIndex()` - Get Index of First Match
```javascript
const index = [1, 2, 3].findIndex(x => x > 1)
// 1
```

#### `.splice()` - Remove Items
```javascript
const arr = [1, 2, 3, 4]
arr.splice(1, 2)  // Remove 2 items starting at index 1
// arr is now [1, 4]
```

#### `.unshift()` - Add to Beginning
```javascript
const arr = [2, 3]
arr.unshift(1)
// arr is now [1, 2, 3]
```

#### `.pop()` - Remove from End
```javascript
const arr = [1, 2, 3]
arr.pop()
// arr is now [1, 2]
```

---

### 2. Math Functions

#### `Math.floor()` - Round Down
```javascript
Math.floor(3.7)  // 3
Math.floor(3.2)  // 3
Math.floor(-3.7) // -4
```

#### `Math.ceil()` - Round Up
```javascript
Math.ceil(3.2)  // 4
Math.ceil(3.7)  // 4
```

#### `Math.round()` - Round to Nearest
```javascript
Math.round(3.4)  // 3
Math.round(3.5)  // 4
```

#### `Math.abs()` - Absolute Value
```javascript
Math.abs(-5)   // 5
Math.abs(5)    // 5
Math.abs(-3.7) // 3.7
```

#### `Math.max()` - Get Largest
```javascript
Math.max(1, 5, 3)  // 5
Math.max(...[1, 5, 3])  // 5 (with spread)
```

#### `Math.min()` - Get Smallest
```javascript
Math.min(1, 5, 3)  // 1
```

#### `Math.random()` - Random 0 to 1
```javascript
Math.random()  // 0.0 to 0.999...
Math.random() * 10  // 0.0 to 9.999...
Math.floor(Math.random() * 10)  // 0 to 9
```

#### `Math.PI` - Pi Constant
```javascript
Math.PI  // 3.14159...
Math.PI * 2  // Full circle in radians
```

---

### 3. Object Operations

#### Destructuring
```javascript
const obj = { x: 5, y: 10, z: 15 }
const { x, y } = obj
// x = 5, y = 10
```

#### Spread Operator
```javascript
const obj1 = { a: 1, b: 2 }
const obj2 = { ...obj1, c: 3 }
// obj2 = { a: 1, b: 2, c: 3 }
```

#### Property Shorthand
```javascript
const x = 5
const y = 10
const obj = { x, y }
// Same as { x: x, y: y }
```

---

### 4. Control Flow

#### If-Else
```javascript
if (condition) {
    // Do this
} else if (otherCondition) {
    // Do that
} else {
    // Do something else
}
```

#### Ternary Operator
```javascript
const value = condition ? ifTrue : ifFalse
```

#### Switch Statement
```javascript
switch (direction) {
    case 'up':
        y--
        break
    case 'down':
        y++
        break
    default:
        // Do nothing
}
```

#### For Loop
```javascript
for (let i = 0; i < 10; i++) {
    console.log(i)
}
```

#### While Loop
```javascript
while (condition) {
    // Keep doing this
}
```

#### Do-While Loop
```javascript
do {
    // Do this at least once
} while (condition)
```

---

## Game-Specific Algorithms

### Pac-Man: Ghost AI (Manhattan Distance)

```javascript
const distance = Math.abs(ghost.x - pacman.x) + Math.abs(ghost.y - pacman.y)
```

**What it calculates**: Grid distance between two points

**Example**:
```
Ghost at (2, 3)
Pac-Man at (5, 7)
Distance = |2-5| + |3-7| = 3 + 4 = 7 moves
```

---

### Tetris: Matrix Rotation

```javascript
const rotated = matrix[0].map((_, i) =>
    matrix.map(row => row[i]).reverse()
)
```

**What it does**: Rotates 2D array 90° clockwise

**Steps**:
1. Transpose (swap rows/columns)
2. Reverse each row

**Example**:
```
Before:        After:
[1,2,3]        [7,4,1]
[4,5,6]   →    [8,5,2]
[7,8,9]        [9,6,3]
```

---

### Snake: Growth Mechanism

```javascript
snake.unshift(newHead)  // Add head
if (!ateFood) {
    snake.pop()  // Remove tail
}
```

**How it works**:
- Always add new head
- Remove tail only if didn't eat
- If ate food, keep tail (grows by 1)

---

## Performance Tips

### 1. Use `useRef` for Frequently Updated Data
```javascript
// ❌ Bad - re-renders 60 times/second
const [position, setPosition] = useState({ x: 0, y: 0 })

// ✅ Good - no re-renders
const positionRef = useRef({ x: 0, y: 0 })
```

### 2. Cleanup Event Listeners
```javascript
useEffect(() => {
    window.addEventListener('keydown', handler)
    return () => {
        window.removeEventListener('keydown', handler)
    }
}, [])
```

### 3. Use `requestAnimationFrame`
```javascript
// ❌ Bad - not synced with display
setInterval(gameLoop, 16)

// ✅ Good - browser optimized
requestAnimationFrame(gameLoop)
```

### 4. Minimize Canvas Clears
```javascript
// Clear once per frame
ctx.fillRect(0, 0, width, height)
// Then draw everything
```

---

## Common Patterns Summary

### State Management
- `useState` for UI
- `useRef` for game logic
- `useEffect` for lifecycle

### Game Loop
- Calculate delta time
- Update game state
- Render frame
- Request next frame

### Collision Detection
- Grid-based: equality check
- Shape-based: nested loops
- Array-based: `.some()` method

### Input Handling
- Event listeners
- Direction queuing
- Validation checks

### Rendering
- Clear canvas
- Draw background
- Draw game objects
- Draw UI

---

## Debugging Tips

### 1. Console Logging
```javascript
console.log('Position:', x, y)
console.log('Game State:', gameState)
```

### 2. Visual Debugging
```javascript
// Draw collision boxes
ctx.strokeStyle = 'red'
ctx.strokeRect(x, y, width, height)
```

### 3. Pause Game
```javascript
if (isPaused) return  // Skip update
```

### 4. Slow Motion
```javascript
gameState.speed = 1000  // Very slow
```

---

## Next Steps

### Adding New Features

1. **Sound Effects**
   - Use Web Audio API
   - Load audio files
   - Play on events

2. **High Scores**
   - Use localStorage
   - Save/load scores
   - Display leaderboard

3. **Difficulty Levels**
   - Adjust speed
   - Change AI behavior
   - Modify scoring

4. **Power-ups**
   - Add new collectibles
   - Temporary effects
   - Visual indicators

5. **Multiplayer**
   - WebSocket connection
   - Sync game state
   - Handle latency

---

## Resources

### Learning JavaScript
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)

### Canvas API
- [MDN Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)

### React Hooks
- [React Hooks Documentation](https://react.dev/reference/react)

### Game Development
- [Game Programming Patterns](https://gameprogrammingpatterns.com/)

---

## Glossary

**Canvas**: HTML element for drawing graphics
**Context**: Drawing tool for canvas (ctx)
**Delta Time**: Time elapsed since last frame
**Frame**: One update/render cycle
**FPS**: Frames per second (usually 60)
**Grid**: 2D array representing game board
**Hook**: React function for state/lifecycle
**Ref**: React reference to value/element
**Render**: Draw to screen
**State**: Data that changes over time
**Tick**: One game update cycle

---

This overview covers the common concepts across all three games. For detailed explanations of each game's specific mechanics, see the individual documentation files!
