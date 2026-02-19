# 🎮 GameHub - Browser-Based Game Platform

![GameHub Hero](./frontend/docs//images/Screenshot%202026-02-11%20022826.png)

> A modern WebAssembly-powered game launcher platform. Play games instantly in your browser - no downloads, no installations required.

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)
[![WebAssembly](https://img.shields.io/badge/WebAssembly-Powered-654FF0?logo=webassembly)](https://webassembly.org/)

---

## 🚀 Quick Start 


```bash
# Frontend setup
cd frontend
npm install
npm run dev

# Backend setup (separate terminal)
cd backend
pip install -r requirements.txt
python server.py
```

Visit `http://localhost:5173` for frontend and `http://localhost:8000` for backend API.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Games Library](#-games-library)
- [Development Roadmap](#-development-roadmap)
- [Architecture](#-architecture)
- [Contributing](#-contributing)

---

## 🎯 Overview

GameHub is a Netflix-style platform for browser-based games. Built with modern web technologies, it delivers near-native gaming performance through WebAssembly, all within your browser.

### Why GameHub?

- **Zero Installation** - Games load instantly in your browser
- **WebAssembly Performance** - Near-native speed and efficiency
- **Modular Architecture** - Easy to add new games via manifest files
- **Containerized** - Docker-ready for consistent deployments
- **Scalable** - Built to handle growth from day one

---

## ✨ Features

### Current Features (Phase 1)

- ✅ **Modern UI** - Minimal design with smooth animations
- ✅ **Game Library** - Browse 6+ games with detailed info
- ✅ **User Authentication** - Login/Signup with Google OAuth ready
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Dark Theme** - Easy on the eyes with glassmorphism effects
- ✅ **Animated Elements** - Floating particles, scanlines, 3D cubes

### Coming Soon

- 🔄 **Game Catalog API** - Backend serving game metadata
- 🔄 **WebAssembly Games** - Actual playable games
- 🔄 **User Profiles** - Save progress and settings
- 🔄 **Cloud Saves** - Continue gaming across devices
- 🔄 **Leaderboards** - Compete with other players

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library with latest features
- **React Router 7** - Client-side routing
- **CSS3** - Custom animations and glassmorphism effects
- **Vite 5** - Fast build tool and dev server

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server



### Infrastructure
- **Docker** - Containerization
- **AWS EC2** - Production hosting (planned)




---

## 📁 Project Structure

```
├── frontend/                    # React application
│   ├── public/
│   │   ├── fonts/              # Custom fonts (Orbitron, Rajdhani)
│   │   ├── sounds/             # Audio assets
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/             # Images and icons
│   │   ├── Components/
│   │   │   ├── About/          # Platform info section
│   │   │   ├── FAQ/            # FAQ accordion
│   │   │   ├── Footer/         # Site footer with social links
│   │   │   ├── Games/          # Featured games showcase
│   │   │   ├── HomePage/       # Hero section and navbar
│   │   │   └── React-bits/     # Reusable UI components
│   │   ├── Pages/
│   │   │   ├── HomePage.jsx    # Landing page
│   │   │   ├── GamesPage.jsx   # Full game library
│   │   │   └── LoginPage.jsx   # Authentication
│   │   ├── styles/             # Component-specific styles
│   │   ├── utils/              # Helper functions
│   │   ├── App.jsx             # Root component with routing
│   │   └── main.jsx            # Entry point
│   ├── docs/                   # Game documentation
│   │   ├── images/             # Screenshots and assets
│   │   ├── GAMES_OVERVIEW.md   # Common game concepts
│   │   ├── PACMAN_DOCUMENTATION.md
│   │   ├── SNAKE_DOCUMENTATION.md
│   │   └── TETRIS_DOCUMENTATION.md
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # FastAPI server
│   ├── additions/              # Additional modules
│   │   ├── cache.py           # Caching utilities
│   │   ├── packed.py          # Game packing
│   │   └── saves.py           # Save game management
│   ├── backend_server/         # Server binaries
│   ├── dist/                   # Built game files
│   │   ├── modules/           # Game modules
│   │   ├── game.js            # Game loader
│   │   ├── index.html         # Game player
│   │   └── *.js               # js-dos SDK files
│   ├── saves/                  # User save files
│   ├── server.py              # Main FastAPI server
│   ├── requirements.txt       # Python dependencies
│   └── revcdos.bin            # DOS game binary
│
├── .gitignore
├── .nvmrc                      # Node version
├── README.md                   # This file
└── yarn.lock
```

---

## 🎮 Games Library

### Available Games

| Game | Genre | Difficulty | Status |
|------|-------|-----------|--------|
| **GTA Vice City** | Action/Open World | Complex | Featured |
| **Pac-Man** | Arcade/Classic | Easy | Playable |
| **Tetris** | Puzzle | Easy | Playable |
| **Snake** | Arcade/Casual | Easy | Playable |

### Built-in Browser Games

The platform includes three fully playable browser games built with React and Canvas:

- **Pac-Man** - Classic maze chase with ghost AI
- **Tetris** - Block-stacking puzzle with rotation mechanics
- **Snake** - Growing snake with collision detection

Each game has comprehensive documentation in `frontend/docs/` explaining the implementation, algorithms, and game mechanics.

### Game Module Structure

Each game is a self-contained module with metadata:

```
backend/dist/
├── modules/               # Game data files
├── game.js               # Game engine
├── index.html            # Game player interface
├── jsdos-cloud-sdk.js    # js-dos SDK
└── cover.jpg             # Game cover art
```

**Backend API Endpoints:**
```
GET  /api/games           # List all games
GET  /api/game/{id}       # Get specific game
POST /api/save            # Save game state
GET  /api/load/{id}       # Load game state
```

---

## 🗺️ Development Roadmap

### ✅ Phase 1: Platform Skeleton (Completed)
- [x] React frontend with routing
- [x] Game library UI with 6+ games
- [x] User authentication pages
- [x] Minimal design system with glassmorphism
- [x] Responsive layout
- [x] FastAPI backend server
- [x] Game save/load system
- [x] js-dos integration for DOS games
- [x] Three playable browser games (Pac-Man, Tetris, Snake)

### 📦 Phase 2: Enhanced Features (In Progress)
- [ ] User authentication with JWT
- [ ] Database integration (PostgreSQL)
- [ ] Cloud save synchronization
- [ ] Leaderboards and achievements
- [ ] Game recommendations
- [ ] Social features (friends, chat)

### 🐳 Phase 3: Docker Development
- [ ] Dockerize frontend + backend
- [ ] Docker Compose setup
- [ ] Hot reload configuration
- [ ] Shared network
- [ ] Volume management for saves

### 🚀 Phase 4: Production Ready
- [ ] Multi-stage Docker builds
- [ ] Nginx reverse proxy
- [ ] Environment variables
- [ ] Health checks
- [ ] Optimized images
- [ ] SSL/TLS certificates

### 🎯 Phase 5: Scale & Deploy
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] AWS EC2 deployment
- [ ] S3/CloudFront for assets
- [ ] Load balancing
- [ ] Monitoring & logging
- [ ] CDN integration

---

## 🏗️ Architecture

### System Overview

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────┐
│   Frontend (React + Vite)   │
│      Port 5173              │
└──────┬──────────────────────┘
       │
       ↓
┌─────────────────────────────┐
│   Backend (FastAPI)         │
│      Port 8000              │
└──────┬──────────────────────┘
       │
       ├─→ /api/games     → Game catalog
       ├─→ /api/save      → Save game state
       ├─→ /api/load      → Load game state
       └─→ /dist/*        → Static game files
```

### Data Flow

1. **User visits site** → Vite serves React app
2. **React loads** → Fetches game catalog from FastAPI
3. **User clicks "Play"** → Loads game via js-dos or Canvas
4. **Game runs** → WebAssembly/Canvas executes in browser
5. **Progress saved** → FastAPI stores save files

### Backend Architecture

```python
# FastAPI server structure
server.py
├── CORS middleware
├── Static file serving (/dist)
├── API routes
│   ├── GET  /api/games
│   ├── POST /api/save
│   └── GET  /api/load/{id}
└── Game management
    ├── additions/auth.py
    ├── additions/cache.py
    ├── additions/saves.py
    └── utils/packer_brotli.py
```

---

## 🎨 Design System

### Color Palette
- **Primary:** White (#ffffff) with varying opacity
- **Background:** Dark gradients (#000000, #0a0a15, #1a1a2e)
- **Borders:** rgba(255, 255, 255, 0.1-0.4)
- **Accents:** Subtle white glows

### Typography
- **Headings:** Orbitron (futuristic, bold)
- **Body:** Rajdhani (modern, readable)
- **Monospace:** For code/technical content

### Animations
- **Scanlines:** Subtle moving lines for retro feel
- **Particles:** Floating diamond shapes (◆◇◈)
- **Cubes:** 3D rotating elements
- **Hover:** Scale, glow, and transform effects

---

## 🔧 Development

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git
- Modern browser (Chrome, Firefox, Edge)

### Environment Setup

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python server.py
# Runs on http://localhost:8000
```

### Available Scripts

**Frontend:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

**Backend:**
```bash
python server.py              # Start FastAPI server
uvicorn server:app --reload   # Start with auto-reload
```

### Project Documentation

Comprehensive game documentation available in `frontend/docs/`:

- **GAMES_OVERVIEW.md** - Common concepts, React hooks, Canvas API, game loops
- **PACMAN_DOCUMENTATION.md** - Ghost AI, collision detection, maze generation
- **TETRIS_DOCUMENTATION.md** - Piece rotation, line clearing, scoring system
- **SNAKE_DOCUMENTATION.md** - Growth mechanics, collision handling, food spawning

### Adding a New Game

**For DOS/WASM games:**
1. Place game files in `backend/dist/modules/`
2. Update game catalog in backend
3. Configure js-dos loader

**For Canvas games:**
1. Create component in `frontend/src/Components/`
2. Implement game loop with Canvas
3. Add routing in `App.jsx`
4. Document in `frontend/docs/`

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style
- Write meaningful commit messages
- Test on multiple browsers
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **FastAPI** - For the modern Python web framework
- **js-dos** - For DOS games in browser
- **WebAssembly Community** - For making browser gaming possible
- **Emscripten** - For C/C++ to WASM compilation
- **Docker** - For containerization made easy
- **Vite** - For lightning-fast development experience

---

## 📞 Contact & Support

- **Issues:** [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email:** support@gamehub.dev

---

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

<div align="center">

**Built with ❤️ by the GameHub Team**

[Website](https://gamehub.dev) • [Documentation](https://docs.gamehub.dev) • [Blog](https://blog.gamehub.dev)

</div>


