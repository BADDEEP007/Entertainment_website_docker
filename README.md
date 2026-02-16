# 🎮 GameHub - Browser-Based Game Platform

![GameHub Hero](./frontend/docs//images/Screenshot%202026-02-11%20022826.png)

> A modern WebAssembly-powered game launcher platform. Play games instantly in your browser - no downloads, no installations required.

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-Latest-000000?logo=express)](https://expressjs.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)
[![WebAssembly](https://img.shields.io/badge/WebAssembly-Powered-654FF0?logo=webassembly)](https://webassembly.org/)

---

## 🚀 Quick Start by Shailendra Lodhi 


```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:5173` to see the platform in action.

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
- **CSS3** - Custom animations and effects
- **Vite** - Fast build tool and dev server

### Backend (Planned)
- **Express.js** - RESTful API server
- **PostgreSQL** - User data and game metadata
- **JWT** - Authentication tokens

### Infrastructure
- **Docker** - Containerization
- **Nginx** - Reverse proxy and static file serving
- **AWS EC2** - Production hosting (planned)
- **S3/CloudFront** - Game asset delivery (optional)

### Game Technology
- **WebAssembly** - High-performance game execution
- **Emscripten** - C/C++ to WASM compilation
- **Manifest System** - Modular game loading

---

## 📁 Project Structure

```
frontend/
├── public/
│   ├── fonts/              # Custom fonts
│   └── vite.svg
├── src/
│   ├── assets/             # Images and icons
│   ├── Components/
│   │   ├── About/          # Platform info section
│   │   ├── FAQ/            # FAQ accordion
│   │   ├── Footer/         # Site footer with social links
│   │   ├── Games/          # Featured games showcase
│   │   ├── HomePage/       # Hero section and navbar
│   │   └── React-bits/     # Reusable UI components
│   ├── Pages/
│   │   ├── HomePage.jsx    # Landing page
│   │   ├── GamesPage.jsx   # Full game library
│   │   └── LoginPage.jsx   # Authentication
│   ├── App.jsx             # Root component with routing
│   └── main.jsx            # Entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## 🎮 Games Library

### Available Games

| Game | Genre | Difficulty | Status |
|------|-------|-----------|--------|
| **GTA Vice City** | Action/Open World | Complex | Featured |
| **DOOM (1993)** | FPS/Classic | Medium | Ready |
| **Pac-Man** | Arcade/Classic | Easy | Ready |
| **Tetris** | Puzzle | Easy | Ready |
| **Snake** | Arcade/Casual | Easy | Ready |
| **Space Invaders** | Shooter/Classic | Easy | Ready |

### Game Module Structure

Each game is a self-contained module:

```
games/
└── vice-city/
    ├── manifest.json       # Game metadata
    └── build/
        ├── game.wasm       # Compiled game
        ├── game.js         # JS glue code
        ├── game.data       # Game assets
        └── assets/         # Additional resources
```

**Example manifest.json:**
```json
{
  "id": "vice-city",
  "name": "GTA Vice City",
  "version": "1.0.0",
  "entry": "/games/vice-city/build/index.html",
  "description": "Welcome to the 1980s...",
  "genre": ["Action", "Open World"],
  "rating": "4.8",
  "players": "Single Player"
}
```

---

## 🗺️ Development Roadmap

### ✅ Phase 1: Platform Skeleton (Current)
- [x] React frontend with routing
- [x] Game library UI
- [x] User authentication pages
- [x] Minimal design system
- [x] Responsive layout
- [ ] Backend API setup
- [ ] Manifest-based game loading

### 📦 Phase 2: Static Game Hosting
- [ ] Serve `/games/*` from backend
- [ ] Add game manifests
- [ ] Test WASM game delivery
- [ ] Browser loading pipeline

### 🐳 Phase 3: Docker Development
- [ ] Dockerize frontend + backend
- [ ] Docker Compose setup
- [ ] Hot reload configuration
- [ ] Shared network

### 🚀 Phase 4: Production Ready
- [ ] Multi-stage Docker builds
- [ ] Nginx reverse proxy
- [ ] Environment variables
- [ ] Health checks
- [ ] Optimized images

### 🎯 Phase 5: Feature Expansion
- [ ] User authentication (JWT)
- [ ] Save metadata storage
- [ ] Per-user settings
- [ ] Logging & metrics
- [ ] CI/CD pipeline
- [ ] AWS EC2 deployment
- [ ] S3/CloudFront integration

---

## 🏗️ Architecture

### System Overview

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│    Nginx    │  ← Reverse Proxy
│  (Port 80)  │
└──────┬──────┘
       │
       ├─→ /          → React Frontend (Static)
       ├─→ /api/*     → Express Backend (API)
       └─→ /games/*   → Game Files (Static)
```

### Data Flow

1. **User visits site** → Nginx serves React app
2. **React loads** → Fetches game catalog from `/api/games`
3. **User clicks "Play"** → Loads game from manifest entry point
4. **Game runs** → WebAssembly executes in browser
5. **Progress saved** → API stores user data

### Manifest-Based Loading

Games are dynamically loaded without hardcoding:

```javascript
// Frontend reads manifest
const manifest = await fetch('/games/vice-city/manifest.json')
const game = await manifest.json()

// Launch game
window.location.href = game.entry
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
- Git
- Modern browser (Chrome, Firefox, Edge)

### Environment Setup

```bash
# Clone repository
git clone <repo-url>
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Adding a New Game

1. Create game folder: `games/your-game/`
2. Add `manifest.json` with metadata
3. Place WASM build in `build/` folder
4. Game appears automatically in library

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
- **WebAssembly Community** - For making browser gaming possible
- **Emscripten** - For C/C++ to WASM compilation
- **Docker** - For containerization made easy

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
