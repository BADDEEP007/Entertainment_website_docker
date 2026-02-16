# Snake Game - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Game Constants](#game-constants)
3. [Snake Data Structure](#snake-data-structure)
4. [Movement System](#movement-system)
5. [Collision Detection](#collision-detection)
6. [Food Generation](#food-generation)
7. [Growth Mechanics](#growth-mechanics)
8. [Rendering System](#rendering-system)

---

## Overview

Snake is a classic game where you control a snake that grows longer as it eats food. The challenge is avoiding walls and your own body as you get longer.

---

## Game Constants

```javascript
const CELL_SIZE = 25
const GRID_WIDTH = 20
const GRID_HEIGHT = 20
const INITIAL_SPEED = 150
```

### Explanation:
- **CELL_SIZE**: Each grid cell is 25x25 pixels
- **GRID_WIDTH**: 20 cells wide (500 pixels total)
- **GRID_HEIGHT**: 20 cells tall (500 pixels total)
- **INITIAL_SPEED**: Snake moves every 150ms at start

---

## Snake Data Structure

### Game State

```javascript
gameStateRef.current = {
    snake: [{ x: 10, y: 10 }],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: { x: 15, y: 15 },
    speed: INITIAL_SPEED,
    lastMoveTime: 0
}
```

### The Snake Array

```javascript
snake: [
    { x: 10, y: 10 },  // Head
    { x: 9, y: 10 },   // Body segment 1
    { x: 8, y: 10 },   // Body segment 2
    { x: 7, y: 10 }    // Tail
]
```

**Key concepts**:
- Snake is an array of position objects
- Index 0 is always the head
- Last index is always the tail
- Each segment is one grid cell

**Visual representation**:
```
Grid:
. . . . . . . . . .
. . . . . . . . . .
. . . H B B T . . .  (H=Head, B=Body, T=Tail)
. . . . . . . . . .
```

### Direction Object

```javascript
direction: { x: 1, y: 0 }
```

**Direction values**:
- Right: `{ x: 1, y: 0 }`
- Left: `{ x: -1, y: 0 }`
- Up: `{ x: 0, y: -1 }`
- Down: `{ x: 0, y: 1 }`

**Why separate x and y?**
- Easy to add to position: `newX = head.x + direction.x`
- Can check direction: `if (direction.x === 0)` means moving vertically

### Next Direction (Input Queue)

```javascript
nextDirection: { x: 1, y: 0 }
```

**Why have both `direction` and `nextDirection`?**

**Problem without queue**:
```
Snake moving right
Player presses UP then RIGHT very quickly
Both inputs happen before next move
Second input (RIGHT) overwrites first (UP)
Snake tries to go right while already going right (no change)
```

**Solution with queue**:
```
Current direction: RIGHT
Player presses UP → nextDirection = UP
On next move: direction becomes UP, snake moves up
Player presses RIGHT → nextDirection = RIGHT
On next move: direction becomes RIGHT, snake moves right
```

---

## Movement System

### The Update Function

```javascript
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
        setScore(prev => prev + 10)
        spawnFood(gameState)
        gameState.speed = Math.max(50, gameState.speed - 2)
    } else {
        gameState.snake.pop()
    }
}
```

### Step-by-Step Breakdown

#### Step 1: Apply Direction

```javascript
gameState.direction = gameState.nextDirection
```

- Update current direction from queued input
- This is where the input queue gets processed

#### Step 2: Create New Head

```javascript
const head = { ...gameState.snake[0] }
head.x += gameState.direction.x
head.y += gameState.direction.y
```

**Spread operator `{...}`**:
- Creates a copy of the head object
- Without it, we'd modify the existing head

**Example**:
```javascript
// Current head at (10, 10), moving right
const head = { x: 10, y: 10 }
head.x += 1  // x becomes 11
head.y += 0  // y stays 10
// New head position: (11, 10)
```

#### Step 3: Check Wall Collision

```javascript
if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT)
```

**Boundary checks**:
- `head.x < 0`: Hit left wall
- `head.x >= 20`: Hit right wall (grid is 0-19)
- `head.y < 0`: Hit top wall
- `head.y >= 20`: Hit bottom wall

**Visual**:
```
Grid boundaries:
  0 1 2 ... 18 19
0 ┌─────────────┐
1 │             │
2 │    GAME     │
. │    AREA     │
. │             │
19└─────────────┘

Valid positions: 0-19 for both x and y
```

#### Step 4: Check Self Collision

```javascript
if (gameState.snake.some(segment => segment.x === head.x && segment.y === head.y))
```

**`.some()` method**:
- Tests if ANY segment matches condition
- Returns true if at least one match found
- Stops checking after first match (efficient)

**Example**:
```javascript
snake = [
    { x: 10, y: 10 },  // Head
    { x: 9, y: 10 },
    { x: 9, y: 11 },
    { x: 10, y: 11 }   // Tail
]

// New head would be at (10, 11)
// Check: Does any segment have x=10 and y=11?
// Yes! The tail is at (10, 11)
// Collision detected!
```

#### Step 5: Add New Head

```javascript
gameState.snake.unshift(head)
```

**`.unshift()` method**:
- Adds element to beginning of array
- Shifts all other elements right
- Returns new array length

**Example**:
```javascript
// Before
snake = [
    { x: 10, y: 10 },  // Index 0 (head)
    { x: 9, y: 10 },   // Index 1
    { x: 8, y: 10 }    // Index 2 (tail)
]

// After unshift({ x: 11, y: 10 })
snake = [
    { x: 11, y: 10 },  // Index 0 (new head)
    { x: 10, y: 10 },  // Index 1 (old head)
    { x: 9, y: 10 },   // Index 2
    { x: 8, y: 10 }    // Index 3 (tail)
]
```

#### Step 6: Food Check and Growth

```javascript
if (head.x === gameState.food.x && head.y === gameState.food.y) {
    // Ate food
    setScore(prev => prev + 10)
    spawnFood(gameState)
    gameState.speed = Math.max(50, gameState.speed - 2)
} else {
    // Didn't eat food
    gameState.snake.pop()
}
```

**Growth logic**:
- If food eaten: Keep the extra segment (snake grows)
- If no food: Remove tail (snake stays same length)

**Why this works**:
```
Before move (length 3):
[Head, Body, Tail]

After adding new head (length 4):
[NewHead, Head, Body, Tail]

If ate food:
Keep all 4 segments (grew by 1)

If no food:
Remove tail → [NewHead, Head, Body] (back to length 3)
```

**Speed increase**:
```javascript
gameState.speed = Math.max(50, gameState.speed - 2)
```
- Decrease interval by 2ms each food
- Minimum 50ms (maximum speed)
- Makes game progressively harder

**Example**:
```
Start: 150ms
After 1 food: 148ms
After 2 foods: 146ms
...
After 50 foods: 50ms (minimum reached)
```

---

## Food Generation

### The Spawn Function

```javascript
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
```

### Do-While Loop

```javascript
do {
    // Code here runs at least once
} while (condition)
```

**How it works**:
1. Generate random position
2. Check if position overlaps snake
3. If yes, repeat step 1
4. If no, use that position

**Why do-while instead of while?**
- Need to generate at least one position before checking
- `while` checks condition first (might never run)
- `do-while` runs once, then checks

### Random Position

```javascript
x: Math.floor(Math.random() * GRID_WIDTH)
```

**Calculation**:
```
Math.random() = 0.0 to 0.999...
Multiply by 20 = 0.0 to 19.999...
Math.floor() = 0 to 19 (valid grid positions)
```

### Collision Check

```javascript
gameState.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)
```

- Returns true if food overlaps any snake segment
- Loop continues if true (generates new position)
- Loop stops if false (position is clear)

**Example scenario**:
```
Attempt 1: Food at (10, 10) → Snake head is there → Try again
Attempt 2: Food at (5, 7) → Snake body is there → Try again
Attempt 3: Food at (15, 3) → Clear! → Use this position
```

---

## Input Handling

### Keyboard Event Handler

```javascript
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
}
```

### Direction Validation

```javascript
if ((e.key === 'ArrowUp' || e.key === 'w') && direction.y === 0)
```

**Why check `direction.y === 0`?**

**Problem without check**:
```
Snake moving UP (direction.y = -1)
Player presses DOWN
Snake would reverse into itself
Instant death!
```

**Solution**:
```
Snake moving UP (direction.y = -1)
Check: direction.y === 0? No! (it's -1)
Ignore DOWN input
Snake continues UP
```

**Logic table**:
```
Current Direction | Can Change To
------------------|---------------
UP (y=-1)         | LEFT, RIGHT (not DOWN)
DOWN (y=1)        | LEFT, RIGHT (not UP)
LEFT (x=-1)       | UP, DOWN (not RIGHT)
RIGHT (x=1)       | UP, DOWN (not LEFT)
```

**The check**:
- `direction.y === 0` means moving horizontally (can change to vertical)
- `direction.x === 0` means moving vertically (can change to horizontal)

---

## Rendering System

### Drawing the Snake

```javascript
gameState.snake.forEach((segment, index) => {
    if (index === 0) {
        // Draw head
        ctx.fillStyle = '#0DFF72'
        ctx.fillRect(
            segment.x * CELL_SIZE + 1,
            segment.y * CELL_SIZE + 1,
            CELL_SIZE - 2,
            CELL_SIZE - 2
        )
        // Draw eyes
        drawEyes(segment, gameState.direction)
    } else {
        // Draw body
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
```

### Head vs Body

**Head (index 0)**:
- Solid color
- Has eyes
- Slightly larger (CELL_SIZE - 2)

**Body (index > 0)**:
- Gradient color
- No eyes
- Slightly smaller (CELL_SIZE - 4)

### Drawing Eyes

```javascript
const eyeSize = 3
const eyeOffset = 6

if (gameState.direction.x === 1) { // Right
    ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - eyeOffset, segment.y * CELL_SIZE + 5, eyeSize, eyeSize)
    ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - eyeOffset, segment.y * CELL_SIZE + CELL_SIZE - 8, eyeSize, eyeSize)
}
```

**Eye positioning logic**:
- Eyes face the direction of movement
- Two eyes positioned based on direction
- Each eye is 3x3 pixels

**Direction-based positioning**:
```
Moving RIGHT: Eyes on right side of head
Moving LEFT: Eyes on left side
Moving UP: Eyes on top
Moving DOWN: Eyes on bottom
```

### Gradient Creation

```javascript
const gradient = ctx.createLinearGradient(
    segment.x * CELL_SIZE,              // Start X
    segment.y * CELL_SIZE,              // Start Y
    segment.x * CELL_SIZE + CELL_SIZE,  // End X
    segment.y * CELL_SIZE + CELL_SIZE   // End Y
)
gradient.addColorStop(0, '#0DFF72')  // Green at start
gradient.addColorStop(1, '#0DC2FF')  // Blue at end
```

**What is a gradient?**
- Smooth color transition
- From one color to another
- Creates depth effect

**Color stops**:
- 0 = start position (0%)
- 1 = end position (100%)
- Can add stops at 0.5 for middle color

**Visual**:
```
Start (0)          End (1)
#0DFF72 ────────► #0DC2FF
Green              Blue
```

### Drawing Food

```javascript
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
```

**Circle parameters**:
- **Center X**: Grid X * cell size + half cell (centers it)
- **Center Y**: Grid Y * cell size + half cell
- **Radius**: Half cell size minus 3 pixels (padding)
- **Start angle**: 0
- **End angle**: 2π (full circle)

**Example**:
```
Food at grid (5, 5), CELL_SIZE = 25
Center X = 5 * 25 + 12.5 = 137.5 pixels
Center Y = 5 * 25 + 12.5 = 137.5 pixels
Radius = 12.5 - 3 = 9.5 pixels
```

---

## Game Loop

### Time-Based Movement

```javascript
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
```

### How It Works

**Parameters**:
- `time`: Current timestamp from `requestAnimationFrame`
- Automatically provided by browser
- In milliseconds

**Delta time calculation**:
```javascript
const timeSinceLastMove = time - gameState.lastMoveTime
```

**Example**:
```
Frame 1: time = 1000, lastMoveTime = 0
timeSinceLastMove = 1000 - 0 = 1000ms

Frame 2: time = 1016, lastMoveTime = 0
timeSinceLastMove = 1016 - 0 = 1016ms

Frame 3: time = 1032, lastMoveTime = 0
timeSinceLastMove = 1032 - 0 = 1032ms
```

**Movement check**:
```javascript
if (timeSinceLastMove >= gameState.speed)
```

- If enough time passed, move snake
- Reset timer
- Update game state

**Why this approach?**
- Decouples rendering from game logic
- Renders at 60 FPS (smooth)
- Game updates at slower rate (150ms)
- Consistent speed on all devices

---

## Key Algorithms

### 1. Snake Growth

```
Add head → Check food → Remove tail (if no food)
```

### 2. Collision Detection

```
Check boundaries → Check self → Check food
```

### 3. Direction Queue

```
Store next input → Apply on next move → Prevents invalid moves
```

### 4. Food Spawning

```
Generate random → Check overlap → Repeat if needed
```

### 5. Speed Progression

```
speed = max(minSpeed, currentSpeed - increment)
```

---

## Common Patterns Used

### 1. Array Methods

**`.unshift()`**: Add to beginning
```javascript
arr.unshift(item)  // [item, ...arr]
```

**`.pop()`**: Remove from end
```javascript
arr.pop()  // arr without last item
```

**`.some()`**: Test if any match
```javascript
arr.some(item => condition)  // true/false
```

**`.forEach()`**: Loop through all
```javascript
arr.forEach((item, index) => { ... })
```

### 2. Object Spread

```javascript
const copy = { ...original }
```
- Creates shallow copy
- Prevents modifying original

### 3. Do-While Loop

```javascript
do {
    // Runs at least once
} while (condition)
```

### 4. Ternary Operator

```javascript
const value = condition ? ifTrue : ifFalse
```

### 5. Math Functions

**`Math.floor()`**: Round down
```javascript
Math.floor(3.7) // 3
```

**`Math.max()`**: Get largest
```javascript
Math.max(50, speed - 2) // At least 50
```

**`Math.random()`**: Random 0-1
```javascript
Math.random() * 20 // 0 to 19.999...
```

---

## Performance Considerations

### 1. Using `useRef` for Game State
- No re-renders on every frame
- Faster updates

### 2. Efficient Collision Detection
- `.some()` stops at first match
- Doesn't check all segments unnecessarily

### 3. Time-Based Updates
- Consistent speed across devices
- Smooth rendering

### 4. Canvas Rendering
- Hardware accelerated
- Efficient for 2D graphics

---

This covers all the core concepts, algorithms, and JavaScript features used in the Snake game!
