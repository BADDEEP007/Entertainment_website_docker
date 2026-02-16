import { useEffect , useRef , useState } from "react";


// ====== Config ======
const TILE = 40;

// 0 empty, 1 wall
const GRID = [
  [1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,0,1],
  [1,0,1,0,1,0,0,0,1,0,1,1],
  [1,0,0,0,0,0,1,0,0,0,0,1],
  [1,0,1,1,0,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1],
];
const grid = GRID.map(row => row.map(v => (v === 0 ? 2 : v)));
grid[1][1] = 0; // pac start tile empty


const DIRS = {
  left:  { x: -1, y:  0 },
  right: { x:  1, y:  0 },
  up:    { x:  0, y: -1 },
  down:  { x:  0, y:  1 },
};

// ====== Helpers ======
function toTile(x, y, tileSize) {
  return { tx: Math.floor(x / tileSize), ty: Math.floor(y / tileSize) };
}

function tileCenter(tx, ty, tileSize) {
  return { cx: (tx + 0.5) * tileSize, cy: (ty + 0.5) * tileSize };
}

function isWall(grid, tx, ty) {
  if (ty < 0 || ty >= grid.length || tx < 0 || tx >= grid[0].length) return true;
  return grid[ty][tx] === 1;
}

function canMove(grid, tx, ty, dir) {
  return !isWall(grid, tx + dir.x, ty + dir.y);
}

function near(a, b, eps = 3) {
  return Math.abs(a - b) <= eps;
}

// ====== State ======
function makeInitialState() {
  // Start Pac at tile (1,1)

  const startTx = 1, startTy = 1;
  const { cx, cy } = tileCenter(startTx, startTy, TILE);

  return {
    tileSize: TILE,
    grid: GRID,
    score: 0,
    lives: 3,
    time : 0,
    paused: false,
    gameOver: false,

    pac: {
      x: cx,
      y: cy,
      r: TILE * 0.35,
      dir: DIRS.right,
      nextDir: DIRS.right,
      speed: 220, // pixels/sec; tweak later
    },
  };
}

// ====== Input ======
function handleKey(e, s) {
    
  const k = e.key.toLowerCase();

  // Pause toggle
  if (k === "p") s.paused = !s.paused;

  if (k === "arrowleft" || k === "a") s.pac.nextDir = DIRS.left;
  if (k === "arrowright" || k === "d") s.pac.nextDir = DIRS.right;
  if (k === "arrowup" || k === "w") s.pac.nextDir = DIRS.up;
  if (k === "arrowdown" || k === "s") s.pac.nextDir = DIRS.down;
}

// ====== Update ======
function update(s, dt) {
    s.time += dt;
  updatePac(s, dt);
}

function updatePac(s, dt) {
  const p = s.pac;
  const grid = s.grid;
  const ts = s.tileSize;

  // Current tile + center
  const { tx, ty } = toTile(p.x, p.y, ts);
  const { cx, cy } = tileCenter(tx, ty, ts);

  // Turning only near tile center (arcade feel)
  const atCenter = near(p.x, cx, 3) && near(p.y, cy, 3);

  if (atCenter) {
    // Snap to exact center to avoid drift
    p.x = cx;
    p.y = cy;

    // Try buffered direction
    if (canMove(grid, tx, ty, p.nextDir)) {
      p.dir = p.nextDir;
    }

    // If blocked in current dir, stop
    if (!canMove(grid, tx, ty, p.dir)) return;
  }

  // Move smoothly
  const nx = p.x + p.dir.x * p.speed * dt;
  const ny = p.y + p.dir.y * p.speed * dt;

  // Block walls by checking next tile
  const nt = toTile(nx, ny, ts);
  if (isWall(grid, nt.tx, nt.ty)) return;

  p.x = nx;
  p.y = ny;
}

// ====== Draw ======
function draw(canvas, s) {

  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const ts = s.tileSize;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw maze
  for (let y = 0; y < s.grid.length; y++) {
    for (let x = 0; x < s.grid[0].length; x++) {
      // grid lines (debug)
      ctx.strokeStyle = "#222";
      ctx.strokeRect(x * ts, y * ts, ts, ts);

    if (s.grid[y][x] === 1) {
  ctx.fillStyle = "#1e4ed8";
  const pad = 4;
  ctx.fillRect(x * ts + pad, y * ts + pad, ts - pad * 2, ts - pad * 2);
}
    }
  }
  for (let y = 0; y < s.grid.length; y++) {
  for (let x = 0; x < s.grid[0].length; x++) {
    if (s.grid[y][x] === 2) {
      ctx.fillStyle = "#f5f5f5";
      const cx = (x + 0.5) * ts;
      const cy = (y + 0.5) * ts;
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}


  // Highlight Pac tile (debug)
  const { tx, ty } = toTile(s.pac.x, s.pac.y, ts);
  ctx.strokeStyle = "#f97316";
  ctx.lineWidth = 2;
  ctx.strokeRect(tx * ts, ty * ts, ts, ts);
  ctx.lineWidth = 1;

  drawPacman(ctx, s.pac, s.time);

  // Draw Pac
 
}

 function drawPacman(ctx, p, time) {
  // Mouth animation: open/close
  const moving = (p.dir.x !== 0 || p.dir.y !== 0);
  const chomp = moving ? (0.25 + 0.20 * Math.abs(Math.sin(time * 10))) : 0.05; 
  // chomp is radians-ish fraction of PI

  // Direction angle
  let ang = 0;
  if (p.dir.x === 1) ang = 0;
  if (p.dir.x === -1) ang = Math.PI;
  if (p.dir.y === 1) ang = Math.PI / 2;
  if (p.dir.y === -1) ang = -Math.PI / 2;

  const mouth = chomp * Math.PI;

  ctx.fillStyle = "#facc15";
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.arc(p.x, p.y, p.r, ang + mouth, ang - mouth, false);
  ctx.closePath();
  ctx.fill();
}
const PacmenCanvas = () => {

    const canvasref = useRef(null)
    const stateref = useRef(null)
    const lastref = useRef(0)
    const rafRef = useRef(null)

    const [hud , setHud] = useState(
        {
            score : 0, 
            lives : 3,
            paused: false
        }
    )

    useEffect(()=>{
        stateref.current = makeInitialState();

        const onKeyDown = (e) => handleKey(e, stateref.current);
        window.addEventListener("keydown", onKeyDown)

        const loop = (t)=>{
            const dt = Math.min(0.033 , (t-lastref.current)/1000  ||  0);
            lastref.current = t ;

            const s = stateref.current;
            if (!s.paused && !s.gameOver) update(s,dt);
            draw(canvasref.current , s);

            if (t % 100 < 16) setHud({ score: s.score, lives: s.lives, paused: s.paused });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(rafRef.current);
    };

        
    },[])
  return (
    <div>
        <div> Score :{hud.score} l lives: {hud.lives} l {hud.paused ? "paused" : "running"}</div>
        <canvas ref = {canvasref} width={1200} height={600}/>
    </div>
  )
}

export default PacmenCanvas