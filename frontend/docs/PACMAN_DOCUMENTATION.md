# Pac-Man Game - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Game Constants](#game-constants)
3. [React Hooks Used](#react-hooks-used)
4. [Game State Management](#game-state-management)
5. [Core Functions](#core-functions)
6. [Math & Logic Explained](#math--logic-explained)
7. [Rendering System](#rendering-system)

---

## Overview

Pac-Man is a maze chase game where you control a yellow character that eats dots while avoiding ghosts. The game uses HTML5 Canvas for rendering and React for state management.

---

## Game Constants

```javascript
const CELL_SIZE = 30
const PACMAN_SPEED = 150
const GHOST_SPEED = 180
```

### What they mean:
- **CELL_SIZE**: Each cell in the maze is 30 pixels wide/tall
- **PACMAN_SPEED**: Pac-Man moves every 150 milliseconds (0.15 seconds)
- **GHOST_SPEED**: Ghosts move every 180 milliseconds (slower than Pac-Man)

### Why these numbers?
- Smaller numbers = faster movement
- We use milliseconds because JavaScript's `Date.now()` returns time in milliseconds

---

## React Hooks Used

### 1. `useState` - Managing Game Data

```javascript
const [score, setScore] = useState(0)
const [lives, setLives] = useState(3)
const [gameOver, setGameOver] = useState(false)
```

**What it does**: Creates variables that React watches. When they change, the screen updates.

**Simple explanation**: 
- `score` holds the current score
- `setScore(100)` changes the score to 100 and updates the display
- Like a magic variable that automatically refreshes the UI

### 2. `useRef` - Storing Data Without Re-rendering

```javascript
const canvasRef = useRef(null)
const gameStateRef = useRef({ pacman: {...}, ghosts: [...] })
```

**What it does**: Stores data that doesn't need to trigger screen updates.

**Simple explanation**:
- `canvasRef` holds reference to the canvas HTML element
- `gameStateRef` stores game data (positions, directions) that changes every frame
- Using `useRef` prevents unnecessary re-renders (makes game faster)

**Why not useState?**
- `useState` re-renders the component every time it changes
- Game updates 60 times per second - that's too many re-renders!
- `useRef` changes without re-rendering

### 3. `useEffect` - Running Code at Specific Times

```javascript
useEffect(() => {
    // Code here runs when component loads
    return () => {
        // Cleanup code runs when component unloads
    }
}, [gameStarted, gameOver])
```

**What it does**: Runs code when the component mounts or when dependencies change.

**Simple explanation**:
- First `useEffect`: Sets up audio when game loads
- Second `useEffect`: Starts game loop when `gameStarted` becomes true
- The `return` function cleans up (removes event listeners, stops animations)

**The dependency array `[gameStarted, gameOver]`**:
- Effect runs again when these values change
- Empty array `[]` = run once on mount
- No array = run on every render (usually bad!)

---

## Game State Management

### The Maze Array

```javascript
const maze = [
    [0,0,0,0,0],  // Row 0
    [0,1,1,1,0],  // Row 1
    [0,1,0,1,0],  // Row 2
    [0,2,1,1,0],  // Row 3
    [0,0,0,0,0]   // Row 4
]
```

**What the numbers mean**:
- `0` = Wall (Pac-Man can't go here)
- `1` = Dot (Pac-Man eats this for 10 points)
- `2` = Power Pellet (Pac-Man eats this for 50 points, ghosts turn blue)
- `3` = Empty space (no dot, but Pac-Man can move here)

**How to read positions**:
- `maze[y][x]` - y is row (vertical), x is column (horizontal)
- `maze[2][3]` = Row 2, Column 3
- Arrays start at 0, not 1!

### Game State Object

```javascript
gameStateRef.current = {
    pacman: { x: 1, y: 1, direction: 'right', nextDirection: 'right' },
    ghosts: [
        { x: 9, y: 9, direction: 'left', color: '#FF0000' }
    ],
    dots: [{ x: 1, y: 1 }, { x: 2, y: 1 }],
    powerPellets: [{ x: 2, y: 2 }],
    score: 0,
    lives: 3,
    powerMode: false,
    powerModeTimer: 0
}
```

**Explanation**:
- **pacman.x, pacman.y**: Grid position (not pixels!)
- **direction**: Current movement direction
- **nextDirection**: Where player wants to go (queued input)
- **ghosts**: Array of ghost objects with positions and colors
- **dots/powerPellets**: Arrays of collectible positions
- **powerMode**: True when ghosts are vulnerable
- **powerModeTimer**: Milliseconds remaining in power mode

---

## Core Functions

### 1. `movePacman(gameState)` - Moving Pac-Man

```javascript
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
```

**Step-by-step explanation**:

1. **Get next position**: Calculate where Pac-Man would be if he moved
2. **Check if valid**: Can Pac-Man move there? (not a wall)
3. **If yes**: Update direction and position
4. **If no**: Try to continue in current direction instead

**Why two checks?**
- Player presses UP while moving RIGHT
- If UP is blocked by wall, keep moving RIGHT
- This makes controls feel smooth (no sudden stops)

### 2. `getNextPosition(x, y, direction)` - Calculate Next Position

```javascript
const getNextPosition = (x, y, direction) => {
    switch (direction) {
        case 'up': return { x, y: y - 1 }
        case 'down': return { x, y: y + 1 }
        case 'left': return { x: x - 1, y }
        case 'right': return { x: x + 1, y }
        default: return { x, y }
    }
}
```

**Math explanation**:
- **UP**: y decreases (y - 1) because y=0 is at the top
- **DOWN**: y increases (y + 1)
- **LEFT**: x decreases (x - 1)
- **RIGHT**: x increases (x + 1)

**Grid coordinate system**:
```
     x →
y  (0,0) (1,0) (2,0)
↓  (0,1) (1,1) (2,1)
   (0,2) (1,2) (2,2)
```

### 3. `canMove(x, y)` - Check if Position is Valid

```javascript
const canMove = (x, y) => {
    if (y < 0 || y >= maze.length || x < 0 || x >= maze[0].length) return false
    return maze[y][x] !== 0
}
```

**Logic breakdown**:

1. **Boundary check**: `y < 0 || y >= maze.length`
   - Is y negative? (above the maze)
   - Is y too big? (below the maze)
   - Same for x (left/right boundaries)

2. **Wall check**: `maze[y][x] !== 0`
   - If the cell is 0, it's a wall
   - `!== 0` means "not equal to 0"
   - Returns true if it's 1, 2, or 3 (walkable)

**Example**:
```javascript
canMove(1, 1)  // Check position (1,1)
// Step 1: Is 1 < 0? No. Is 1 >= 22? No. Is 1 < 0? No. Is 1 >= 19? No.
// Step 2: Is maze[1][1] !== 0? If it's 1 (dot), return true
```

### 4. `moveGhosts(gameState)` - Ghost AI

```javascript
const moveGhosts = (gameState) => {
    gameState.ghosts.forEach(ghost => {
        // Get all valid directions (not walls, not backwards)
        const possibleDirections = ['up', 'down', 'left', 'right'].filter(dir => {
            const pos = getNextPosition(ghost.x, ghost.y, dir)
            return canMove(pos.x, pos.y) && dir !== getOppositeDirection(ghost.direction)
        })

        if (possibleDirections.length > 0) {
            if (!gameState.powerMode) {
                // CHASE MODE: Find direction closest to Pac-Man
                const distances = possibleDirections.map(dir => {
                    const pos = getNextPosition(ghost.x, ghost.y, dir)
                    return {
                        dir,
                        dist: Math.abs(pos.x - gameState.pacman.x) + 
                              Math.abs(pos.y - gameState.pacman.y)
                    }
                })
                distances.sort((a, b) => a.dist - b.dist)
                ghost.direction = distances[0].dir
            } else {
                // FLEE MODE: Find direction farthest from Pac-Man
                const distances = possibleDirections.map(dir => {
                    const pos = getNextPosition(ghost.x, ghost.y, dir)
                    return {
                        dir,
                        dist: Math.abs(pos.x - gameState.pacman.x) + 
                              Math.abs(pos.y - gameState.pacman.y)
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
```

**AI Logic explained**:

**Step 1: Find valid moves**
```javascript
const possibleDirections = ['up', 'down', 'left', 'right'].filter(...)
```
- `.filter()` keeps only directions that pass the test
- Test: Can move there AND not going backwards

**Step 2: Calculate distances**
```javascript
dist: Math.abs(pos.x - gameState.pacman.x) + Math.abs(pos.y - gameState.pacman.y)
```

This is **Manhattan Distance** (also called Taxicab Distance):
- `Math.abs()` = absolute value (always positive)
- `Math.abs(5 - 3)` = 2
- `Math.abs(3 - 5)` = 2 (same result!)

**Example**:
```
Ghost at (2, 2), Pac-Man at (5, 4)
Distance = |2-5| + |2-4| = 3 + 2 = 5
```

**Why Manhattan Distance?**
- Ghosts can't move diagonally
- They move in a grid (like a taxi in Manhattan)
- Diagonal distance would be wrong for grid movement

**Step 3: Sort and choose**
```javascript
distances.sort((a, b) => a.dist - b.dist)  // Smallest first (chase)
distances.sort((a, b) => b.dist - a.dist)  // Largest first (flee)
```

**How `.sort()` works**:
- If `a.dist - b.dist` is negative, a comes first
- If positive, b comes first
- If zero, order doesn't change

**Example**:
```javascript
[{dir:'up', dist:5}, {dir:'down', dist:2}, {dir:'left', dist:8}]
// After sort (a.dist - b.dist):
[{dir:'down', dist:2}, {dir:'up', dist:5}, {dir:'left', dist:8}]
// Ghost chooses 'down' (smallest distance = closest to Pac-Man)
```

### 5. `checkCollisions(gameState)` - Detect Interactions

```javascript
const checkCollisions = (gameState) => {
    const { pacman, dots, powerPellets, ghosts } = gameState

    // Check dot collision
    const dotIndex = dots.findIndex(dot => dot.x === pacman.x && dot.y === pacman.y)
    if (dotIndex !== -1) {
        dots.splice(dotIndex, 1)  // Remove dot
        gameState.score += 10
        setScore(gameState.score)
    }

    // Check power pellet collision
    const pelletIndex = powerPellets.findIndex(p => p.x === pacman.x && p.y === pacman.y)
    if (pelletIndex !== -1) {
        powerPellets.splice(pelletIndex, 1)
        gameState.score += 50
        setScore(gameState.score)
        gameState.powerMode = true
        gameState.powerModeTimer = 7000  // 7 seconds
    }

    // Check ghost collision
    ghosts.forEach((ghost) => {
        if (ghost.x === pacman.x && ghost.y === pacman.y) {
            if (gameState.powerMode) {
                // Eat ghost
                gameState.score += 200
                ghost.x = 9
                ghost.y = 9  // Respawn at center
            } else {
                // Lose life
                gameState.lives -= 1
                setLives(gameState.lives)
                if (gameState.lives <= 0) {
                    setGameOver(true)
                }
            }
        }
    })
}
```

**JavaScript methods explained**:

**`.findIndex()`**:
```javascript
const dotIndex = dots.findIndex(dot => dot.x === pacman.x && dot.y === pacman.y)
```
- Searches array for first item that matches condition
- Returns index (position in array) if found
- Returns -1 if not found

**Example**:
```javascript
const dots = [{x:1,y:1}, {x:2,y:2}, {x:3,y:3}]
const index = dots.findIndex(dot => dot.x === 2 && dot.y === 2)
// index = 1 (second item, arrays start at 0)
```

**`.splice()`**:
```javascript
dots.splice(dotIndex, 1)
```
- Removes items from array
- First parameter: starting index
- Second parameter: how many to remove
- Modifies the original array

**Example**:
```javascript
const arr = [10, 20, 30, 40]
arr.splice(1, 1)  // Remove 1 item at index 1
// arr is now [10, 30, 40]
```

---

## Math & Logic Explained

### 1. Time-Based Movement

```javascript
let lastTime = Date.now()
let pacmanMoveTimer = 0

const gameLoop = () => {
    const currentTime = Date.now()
    const deltaTime = currentTime - lastTime
    lastTime = currentTime

    pacmanMoveTimer += deltaTime
    if (pacmanMoveTimer >= PACMAN_SPEED) {
        pacmanMoveTimer = 0
        movePacman(gameState)
    }
}
```

**What is deltaTime?**
- Time elapsed since last frame (in milliseconds)
- Makes game run at same speed on all computers

**Example**:
```
Frame 1: currentTime = 1000ms, lastTime = 0ms
deltaTime = 1000 - 0 = 1000ms

Frame 2: currentTime = 1016ms, lastTime = 1000ms
deltaTime = 1016 - 1000 = 16ms (60 FPS)
```

**Timer accumulation**:
```
pacmanMoveTimer = 0
Add 16ms → pacmanMoveTimer = 16
Add 16ms → pacmanMoveTimer = 32
Add 16ms → pacmanMoveTimer = 48
...
Add 16ms → pacmanMoveTimer = 160 (>= 150, so move!)
Reset to 0, repeat
```

### 2. Power Mode Timer

```javascript
if (gameState.powerMode) {
    gameState.powerModeTimer -= deltaTime
    if (gameState.powerModeTimer <= 0) {
        gameState.powerMode = false
    }
}
```

**Countdown logic**:
```
Start: powerModeTimer = 7000ms (7 seconds)
After 16ms: 7000 - 16 = 6984ms
After 16ms: 6984 - 16 = 6968ms
...
After many frames: 10 - 16 = -6ms (<= 0, power mode ends!)
```

### 3. Array Iteration

```javascript
gameState.ghosts.forEach(ghost => {
    // Do something with each ghost
})
```

**What `.forEach()` does**:
- Loops through every item in array
- Runs function for each item
- `ghost` is the current item

**Equivalent to**:
```javascript
for (let i = 0; i < gameState.ghosts.length; i++) {
    const ghost = gameState.ghosts[i]
    // Do something with ghost
}
```

---

## Rendering System

### Canvas Drawing Basics

```javascript
const ctx = canvas.getContext('2d')
```
- `ctx` = context (the drawing tool)
- Like getting a paintbrush for the canvas

### Drawing the Maze

```javascript
ctx.fillStyle = '#0000FF'  // Blue color
for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
        if (maze[y][x] === 0) {
            ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
        }
    }
}
```

**Nested loops explained**:
- Outer loop: goes through each row (y)
- Inner loop: goes through each column (x) in that row
- If cell is a wall (0), draw a blue rectangle

**Pixel position calculation**:
```
Grid position (2, 3) with CELL_SIZE = 30
Pixel X = 2 * 30 = 60 pixels from left
Pixel Y = 3 * 30 = 90 pixels from top
```

### Drawing Pac-Man

```javascript
ctx.fillStyle = '#FFFF00'  // Yellow
ctx.beginPath()
ctx.arc(
    gameState.pacman.x * CELL_SIZE + CELL_SIZE / 2,  // Center X
    gameState.pacman.y * CELL_SIZE + CELL_SIZE / 2,  // Center Y
    CELL_SIZE / 2 - 2,  // Radius
    0.2 * Math.PI,  // Start angle
    1.8 * Math.PI   // End angle
)
ctx.lineTo(
    gameState.pacman.x * CELL_SIZE + CELL_SIZE / 2,
    gameState.pacman.y * CELL_SIZE + CELL_SIZE / 2
)
ctx.fill()
```

**Arc parameters explained**:
- **Center**: Grid position * CELL_SIZE + half cell (to center it)
- **Radius**: Half the cell size minus 2 pixels (padding)
- **Angles**: In radians (Math.PI = 180 degrees)
  - `0.2 * Math.PI` = 36 degrees (mouth opening)
  - `1.8 * Math.PI` = 324 degrees (almost full circle)

**Why `lineTo()`?**
- Creates the "mouth" by drawing line to center
- Makes Pac-Man look like he's eating

### Drawing Circles (Dots)

```javascript
ctx.beginPath()
ctx.arc(x, y, radius, 0, Math.PI * 2)
ctx.fill()
```

**Full circle**:
- Start angle: 0
- End angle: Math.PI * 2 (360 degrees)
- Creates a complete circle

---

## Key JavaScript Concepts Used

### 1. Arrow Functions
```javascript
const movePacman = (gameState) => {
    // function body
}
```
Same as:
```javascript
function movePacman(gameState) {
    // function body
}
```

### 2. Destructuring
```javascript
const { pacman, ghosts } = gameState
```
Same as:
```javascript
const pacman = gameState.pacman
const ghosts = gameState.ghosts
```

### 3. Ternary Operator
```javascript
const color = gameState.powerMode ? '#0000FF' : ghost.color
```
Same as:
```javascript
let color
if (gameState.powerMode) {
    color = '#0000FF'
} else {
    color = ghost.color
}
```

### 4. Template Literals
```javascript
`Score: ${score}`
```
Same as:
```javascript
'Score: ' + score
```

---

## Performance Optimizations

### 1. Using `useRef` instead of `useState`
- Prevents re-renders on every frame
- Game runs at 60 FPS = 60 re-renders per second would be slow!

### 2. `requestAnimationFrame`
- Browser-optimized animation loop
- Pauses when tab is not visible (saves battery)
- Syncs with monitor refresh rate

### 3. Cleanup in `useEffect`
```javascript
return () => {
    window.removeEventListener('keydown', handleKeyPress)
    cancelAnimationFrame(animationId)
}
```
- Prevents memory leaks
- Removes event listeners when component unmounts
- Stops animation loop

---

## Common Patterns

### Event Handling
```javascript
const handleKeyPress = (e) => {
    if (e.key === 'ArrowUp') gameState.pacman.nextDirection = 'up'
}
window.addEventListener('keydown', handleKeyPress)
```

### Conditional Rendering
```javascript
{!gameStarted ? (
    <StartScreen />
) : (
    <GameCanvas />
)}
```

### State Updates
```javascript
setScore(prev => prev + 10)  // Using previous value
setScore(100)  // Setting directly
```

---

This documentation covers all the core concepts, math, and JavaScript features used in the Pac-Man game!
