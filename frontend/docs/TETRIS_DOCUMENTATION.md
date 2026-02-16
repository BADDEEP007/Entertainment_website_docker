# Tetris Game - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Game Constants](#game-constants)
3. [Tetris Pieces (Tetrominos)](#tetris-pieces-tetrominos)
4. [Core Game Logic](#core-game-logic)
5. [Rotation System](#rotation-system)
6. [Collision Detection](#collision-detection)
7. [Line Clearing](#line-clearing)
8. [Scoring System](#scoring-system)

---

## Overview

Tetris is a puzzle game where falling blocks (tetrominos) must be arranged to form complete horizontal lines. When a line is complete, it disappears and you score points.

---

## Game Constants

```javascript
const COLS = 10
const ROWS = 20
const CELL_SIZE = 30
const COLORS = ['#000000', '#FF0D72', '#0DC2FF', '#0DFF72', '#F538FF', '#FF8E0D', '#FFE138', '#3877FF']
```

### Explanation:
- **COLS**: Board is 10 cells wide (standard Tetris)
- **ROWS**: Board is 20 cells tall
- **CELL_SIZE**: Each cell is 30x30 pixels
- **COLORS**: Array of colors for different piece types
  - Index 0: Black (empty cell)
  - Index 1-7: Colors for the 7 different tetromino shapes

---

## Tetris Pieces (Tetrominos)

### The 7 Shapes

```javascript
const SHAPES = [
    [[1,1,1,1]],           // I-piece (line)
    [[1,1],[1,1]],         // O-piece (square)
    [[0,1,0],[1,1,1]],     // T-piece
    [[1,0,0],[1,1,1]],     // L-piece
    [[0,0,1],[1,1,1]],     // J-piece
    [[0,1,1],[1,1,0]],     // S-piece
    [[1,1,0],[0,1,1]]      // Z-piece
]
```

### Visual Representation:

**I-piece** (Index 0):
```
[1,1,1,1]
████████
```

**O-piece** (Index 1):
```
[1,1]
[1,1]
████
████
```

**T-piece** (Index 2):
```
[0,1,0]
[1,1,1]
  ██
██████
```

**L-piece** (Index 3):
```
[1,0,0]
[1,1,1]
██
██████
```

**J-piece** (Index 4):
```
[0,0,1]
[1,1,1]
    ██
██████
```

**S-piece** (Index 5):
```
[0,1,1]
[1,1,0]
  ████
████
```

**Z-piece** (Index 6):
```
[1,1,0]
[0,1,1]
████
  ████
```

### How Shapes Are Stored

Each shape is a 2D array (array of arrays):
```javascript
[[0,1,0],
 [1,1,1]]
```

- Outer array: rows
- Inner arrays: columns
- `1` = filled cell
- `0` = empty cell

**Accessing a cell**:
```javascript
const shape = [[0,1,0], [1,1,1]]
shape[0][1]  // Row 0, Column 1 = 1 (filled)
shape[0][0]  // Row 0, Column 0 = 0 (empty)
```

---

## Core Game Logic

### Game State

```javascript
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
```

**Explanation**:
- **board**: 20x10 grid storing placed pieces
- **currentPiece**: The falling piece (2D array)
- **currentX, currentY**: Top-left position of current piece
- **currentColor**: Color index (1-7)
- **dropCounter**: Accumulated time for auto-drop
- **dropInterval**: How often piece drops (milliseconds)
- **lastTime**: Previous frame timestamp

### Creating the Board

```javascript
Array(ROWS).fill(null).map(() => Array(COLS).fill(0))
```

**Step-by-step**:
1. `Array(ROWS)` creates array with 20 empty slots
2. `.fill(null)` fills with null (placeholder)
3. `.map(() => Array(COLS).fill(0))` replaces each null with a new array of 10 zeros

**Result**:
```javascript
[
    [0,0,0,0,0,0,0,0,0,0],  // Row 0
    [0,0,0,0,0,0,0,0,0,0],  // Row 1
    // ... 18 more rows
]
```

**Why not just `Array(ROWS).fill(Array(COLS).fill(0))`?**
- That would create the same array reference 20 times
- Changing one row would change all rows!
- `.map()` creates a new array for each row

---

## Core Functions

### 1. `spawnPiece(gameState)` - Create New Piece

```javascript
const spawnPiece = (gameState) => {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length)
    gameState.currentPiece = SHAPES[shapeIndex]
    gameState.currentColor = shapeIndex + 1
    gameState.currentX = Math.floor(COLS / 2) - Math.floor(gameState.currentPiece[0].length / 2)
    gameState.currentY = 0

    if (checkCollision(gameState, 0, 0)) {
        setGameOver(true)
    }
}
```

**Random piece selection**:
```javascript
Math.floor(Math.random() * SHAPES.length)
```
- `Math.random()` returns 0.0 to 0.999...
- Multiply by 7 (SHAPES.length) = 0.0 to 6.999...
- `Math.floor()` rounds down = 0, 1, 2, 3, 4, 5, or 6

**Centering the piece**:
```javascript
Math.floor(COLS / 2) - Math.floor(gameState.currentPiece[0].length / 2)
```

**Example with T-piece**:
```
COLS = 10, piece width = 3
Center = floor(10/2) - floor(3/2)
       = 5 - 1
       = 4 (starts at column 4)

Board:    0 1 2 3 4 5 6 7 8 9
Piece:            T T T
```

**Game over check**:
- If new piece collides immediately, board is full
- Game over!

### 2. `movePiece(gameState, dir)` - Horizontal Movement

```javascript
const movePiece = (gameState, dir) => {
    if (!checkCollision(gameState, dir, 0)) {
        gameState.currentX += dir
        playSound('move')
    }
}
```

**Parameters**:
- `dir`: -1 for left, +1 for right

**Logic**:
1. Check if moving left/right would cause collision
2. If safe, update X position
3. Play sound effect

### 3. `dropPiece(gameState)` - Move Down

```javascript
const dropPiece = (gameState) => {
    if (!checkCollision(gameState, 0, 1)) {
        gameState.currentY++
    } else {
        mergePiece(gameState)
        clearLines(gameState)
        spawnPiece(gameState)
    }
}
```

**Logic**:
1. Try to move down (Y + 1)
2. If can't move down:
   - Piece has landed
   - Merge it into the board
   - Check for complete lines
   - Spawn new piece

### 4. `hardDrop(gameState)` - Instant Drop

```javascript
const hardDrop = (gameState) => {
    while (!checkCollision(gameState, 0, 1)) {
        gameState.currentY++
    }
    mergePiece(gameState)
    clearLines(gameState)
    spawnPiece(gameState)
}
```

**How it works**:
- `while` loop keeps moving down
- Stops when collision detected
- Then merges and spawns new piece

**Example**:
```
Start: Y = 2
Loop 1: Y = 3 (no collision, continue)
Loop 2: Y = 4 (no collision, continue)
Loop 3: Y = 5 (collision! stop)
Final: Y = 4 (piece lands)
```

---

## Rotation System

### The Rotation Function

```javascript
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
```

### How Rotation Works (Matrix Transpose + Reverse)

**Original piece**:
```javascript
[
    [0,1,0],  // Row 0
    [1,1,1]   // Row 1
]
```

**Step 1: Transpose (swap rows and columns)**
```javascript
gameState.currentPiece.map(row => row[i])
```

For each column index `i`:
- i=0: Take column 0 from all rows → [0, 1]
- i=1: Take column 1 from all rows → [1, 1]
- i=2: Take column 2 from all rows → [0, 1]

Result:
```javascript
[
    [0,1],  // Was column 0
    [1,1],  // Was column 1
    [0,1]   // Was column 2
]
```

**Step 2: Reverse each row**
```javascript
.reverse()
```

Result:
```javascript
[
    [1,0],  // [0,1] reversed
    [1,1],  // [1,1] reversed (same)
    [1,0]   // [0,1] reversed
]
```

**Visual transformation**:
```
Before:        After:
  ██           ██
██████         ██
               ██
```

### Why This Works

**Clockwise rotation = Transpose + Reverse**

Original:
```
A B C
D E F
```

Transpose:
```
A D
B E
C F
```

Reverse each row:
```
D A
E B
F C
```

This is a 90° clockwise rotation!

### Rotation Validation

```javascript
if (checkCollision(gameState, 0, 0)) {
    gameState.currentPiece = previousPiece
}
```

- Try rotation
- If it causes collision (hits wall or other pieces)
- Undo rotation (restore previous shape)

---

## Collision Detection

### The Collision Function

```javascript
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
```

### Step-by-Step Explanation

**Parameters**:
- `offsetX`: How much to move horizontally (for testing)
- `offsetY`: How much to move vertically (for testing)

**Loop through piece**:
```javascript
for (let y = 0; y < gameState.currentPiece.length; y++)
```
- Goes through each row of the piece

```javascript
for (let x = 0; x < gameState.currentPiece[y].length; x++)
```
- Goes through each cell in that row

**Check only filled cells**:
```javascript
if (gameState.currentPiece[y][x])
```
- Only check cells with value 1 (filled)
- Skip cells with value 0 (empty)

**Calculate board position**:
```javascript
const newX = gameState.currentX + x + offsetX
const newY = gameState.currentY + y + offsetY
```

**Example**:
```
Piece position: (5, 3)
Cell in piece: (1, 0) - second column, first row
Offset: (0, 1) - testing move down

Board position = 5 + 1 + 0 = 6 (X)
                 3 + 0 + 1 = 4 (Y)
Check board[4][6]
```

**Boundary checks**:
```javascript
if (newX < 0 || newX >= COLS || newY >= ROWS) return true
```
- Left wall: newX < 0
- Right wall: newX >= 10
- Bottom: newY >= 20
- (No top check because pieces spawn above board)

**Collision with placed pieces**:
```javascript
if (newY >= 0 && gameState.board[newY][newX]) return true
```
- Only check if Y is on the board (>= 0)
- If board cell is filled (not 0), collision!

---

## Merging Pieces

### The Merge Function

```javascript
const mergePiece = (gameState) => {
    for (let y = 0; y < gameState.currentPiece.length; y++) {
        for (let x = 0; x < gameState.currentPiece[y].length; x++) {
            if (gameState.currentPiece[y][x]) {
                gameState.board[gameState.currentY + y][gameState.currentX + x] = gameState.currentColor
            }
        }
    }
}
```

**What it does**:
- Copies current piece into the board
- Piece becomes permanent
- Uses piece's color

**Example**:
```
Piece at (4, 18):
[0,1,0]
[1,1,1]

Board before:
Row 18: [0,0,0,0,0,0,0,0,0,0]
Row 19: [0,0,0,0,0,0,0,0,0,0]

Board after:
Row 18: [0,0,0,0,0,3,0,0,0,0]  (color 3)
Row 19: [0,0,0,0,3,3,3,0,0,0]
```

---

## Line Clearing

### The Clear Function

```javascript
const clearLines = (gameState) => {
    let linesCleared = 0
    for (let y = ROWS - 1; y >= 0; y--) {
        if (gameState.board[y].every(cell => cell !== 0)) {
            gameState.board.splice(y, 1)
            gameState.board.unshift(Array(COLS).fill(0))
            linesCleared++
            y++  // Check same row again
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
```

### Line Detection

```javascript
if (gameState.board[y].every(cell => cell !== 0))
```

**`.every()` method**:
- Tests if ALL cells pass the condition
- Returns true only if every cell is not 0 (filled)

**Example**:
```javascript
[1,2,3,4,5].every(cell => cell !== 0)  // true (all filled)
[1,2,0,4,5].every(cell => cell !== 0)  // false (has empty cell)
```

### Removing Lines

```javascript
gameState.board.splice(y, 1)
gameState.board.unshift(Array(COLS).fill(0))
```

**Step 1: Remove the line**
```javascript
.splice(y, 1)
```
- Removes 1 row at index y

**Step 2: Add empty line at top**
```javascript
.unshift(Array(COLS).fill(0))
```
- `.unshift()` adds to beginning of array
- Adds new empty row at top

**Example**:
```
Before:
Row 0: [0,0,0,0,0,0,0,0,0,0]
Row 1: [0,0,0,0,0,0,0,0,0,0]
Row 2: [1,1,1,1,1,1,1,1,1,1]  ← Full line
Row 3: [1,0,1,0,1,0,1,0,1,0]

After splice(2, 1):
Row 0: [0,0,0,0,0,0,0,0,0,0]
Row 1: [0,0,0,0,0,0,0,0,0,0]
Row 2: [1,0,1,0,1,0,1,0,1,0]  ← Moved up

After unshift:
Row 0: [0,0,0,0,0,0,0,0,0,0]  ← New empty row
Row 1: [0,0,0,0,0,0,0,0,0,0]
Row 2: [0,0,0,0,0,0,0,0,0,0]
Row 3: [1,0,1,0,1,0,1,0,1,0]
```

### Re-checking Same Row

```javascript
y++
```

**Why increment y?**
- Loop decrements y at end: `y--`
- If we clear a line, rows shift down
- Need to check same row number again
- `y++` cancels out the `y--`

**Example**:
```
y = 19 (bottom row)
Clear line at 19
y++ makes y = 20
Loop does y--, making y = 19 again
Check row 19 again (which is now the old row 18)
```

---

## Scoring System

### Points Array

```javascript
const points = [0, 100, 300, 500, 800][linesCleared]
```

**Scoring table**:
- 0 lines: 0 points
- 1 line: 100 points
- 2 lines: 300 points (not 200!)
- 3 lines: 500 points
- 4 lines: 800 points (Tetris!)

**Why bonus for multiple lines?**
- Rewards strategic play
- Clearing 4 lines at once is harder
- Encourages building up pieces

### Level System

```javascript
setLevel(Math.floor(newLines / 10) + 1)
```

**Calculation**:
```
Lines cleared: 0-9   → Level 1
Lines cleared: 10-19 → Level 2
Lines cleared: 20-29 → Level 3
```

**Math**:
```
15 lines cleared
floor(15 / 10) + 1 = floor(1.5) + 1 = 1 + 1 = 2 (Level 2)
```

### Speed Increase

```javascript
gameState.dropInterval = Math.max(100, 1000 - Math.floor(newLines / 10) * 100)
```

**Calculation**:
```
Start: 1000ms (1 second per drop)
Level 2: 1000 - 1 * 100 = 900ms
Level 3: 1000 - 2 * 100 = 800ms
...
Level 10: 1000 - 9 * 100 = 100ms (minimum)
```

**`Math.max(100, ...)`**:
- Ensures speed never goes below 100ms
- Game would be unplayable if too fast

---

## Drawing System

### Drawing the Board

```javascript
for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
        if (gameState.board[y][x]) {
            ctx.fillStyle = COLORS[gameState.board[y][x]]
            ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1)
        }
    }
}
```

**Why `CELL_SIZE - 1`?**
- Creates 1-pixel gap between cells
- Makes grid visible
- Looks cleaner

### Drawing Current Piece

```javascript
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
```

**Position calculation**:
```
Piece position: (5, 3)
Cell in piece: (1, 0)
Screen position: (5 + 1) * 30 = 180 pixels X
                 (3 + 0) * 30 = 90 pixels Y
```

### Drawing Grid Lines

```javascript
for (let y = 0; y <= ROWS; y++) {
    ctx.beginPath()
    ctx.moveTo(0, y * CELL_SIZE)
    ctx.lineTo(COLS * CELL_SIZE, y * CELL_SIZE)
    ctx.stroke()
}
```

**Horizontal lines**:
- Loop from 0 to 20 (21 lines for 20 rows)
- Each line at y * 30 pixels
- Draw from left (0) to right (300)

**Vertical lines**: Same logic for columns

---

## Key Algorithms Summary

### 1. Random Selection
```javascript
Math.floor(Math.random() * array.length)
```

### 2. Matrix Rotation
```javascript
matrix[0].map((_, i) => matrix.map(row => row[i]).reverse())
```

### 3. Collision Detection
- Check boundaries
- Check board cells
- Only for filled cells in piece

### 4. Line Clearing
- Check if row is full
- Remove row
- Add empty row at top

### 5. Speed Progression
```javascript
Math.max(minSpeed, baseSpeed - level * increment)
```

---

This covers all the core concepts and algorithms used in Tetris!
