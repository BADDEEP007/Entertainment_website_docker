# Browser-Based Game Hub

## Project Overview

You're building a **browser-based Game Hub**.

- **Frontend (React):** the launcher UI (library, "Play", settings).
- **Backend (Express):** serves game catalog data + later user stuff (profiles, saves, stats).
- **Games (WASM builds):** each game is a "module" with a `manifest.json` and a `build/` folder that the browser loads.
- **Reverse proxy (Nginx/Caddy):** one domain, routes traffic cleanly:
  - `/api/*` → backend
  - `/` → frontend
  - `/games/*` → game files (static)

**Vice City is Game #1**, but the platform is made to add more games later without rewriting everything.

---

## What a non-dev should understand

Think of it like **a Netflix-style homepage**, but instead of movies, it launches **games that run directly in the browser**.

- The site shows the game list.
- You click "Play".
- The game loads like a web page (because WebAssembly lets browser run game-like code).
- Later, you can add accounts, saved settings, and more games.

---

## Core Components (Dev view)

### 1) React Frontend
- Shows game library UI
- Calls backend: `GET /api/games`
- Opens the selected game's `entry` from manifest (URL)

### 2) Express Backend
- Provides APIs:
  - `/api/games` (catalog)
  - later `/api/users`, `/api/saves`, `/api/settings`
- Can also serve static `/games` in early dev (simple)

### 3) Game Modules

Folder example:
```
games/
  vice-city/
    manifest.json
    build/  (wasm/js/data/assets)
  doom/
    manifest.json
    build/
```

Manifest is the "plugin contract". React reads it, no hardcoding.

----
## Roadmap (build order that won't ruin your life)

### Phase 0: Repo + hygiene (Day 1)
- GitHub repo
- `.gitignore`, `.env.example`
- Basic folder structure:
  - `frontend/`, `backend/`, `games/`, `infra/` (later)

**Deliverable:** repo boots, no chaos.

---

### Phase 1: Platform skeleton (Week 1)
- Backend: `GET /api/games` returns a list (start hardcoded)
- Frontend: renders library from API
- "Play" button opens the game entry URL

**Deliverable:** launcher loads, game list appears.

---

### Phase 2: Static game hosting (Week 1–2)
- Serve `/games/*` from backend or from Nginx
- Add `games/vice-city/manifest.json`
- Put some placeholder build or a test WASM game first (even a tiny demo) to verify delivery pipeline

**Deliverable:** game loads from your server, not from local file system.

---

### Phase 3: Docker dev environment (Week 2)
- Dockerize frontend + backend
- Compose for dev:
  - hot reload for React
  - nodemon for Express
  - shared network

**Deliverable:** `docker compose up` starts everything.

---

### Phase 4: Production containerization (Week 3)
- Multi-stage builds (small images)
- Nginx reverse proxy
- No dev dependencies in final images
- Proper env vars, health checks

**Deliverable:** production-like run locally.

---

### Phase 5: Expansion features (Week 4+)

Pick one at a time:
- User accounts (auth)
- Save metadata storage (DB)
- Game settings per user
- Upload/mount assets privately (important for legality)
- Logging/metrics
- CI/CD deploy to EC2

**Deliverable:** real "platform", not just a launcher page.

---

## Tools you'll use (and why)

| Tool                             | Why                                     |
| -------------------------------- | --------------------------------------- |
| Git + GitHub                     | version control + collaboration + CI/CD |
| Node + npm                       | React + Express runtime & deps          |
| Docker                           | consistent environments, easy deploy    |
| Docker Compose                   | run multiple services locally           |
| Nginx (or Caddy)                 | reverse proxy + static serving + HTTPS  |
| Postgres (later)                 | users/saves/settings data               |
| GitHub Actions (later)           | build/test/deploy automatically         |
| AWS EC2 (later)                  | host production version                 |
| S3 + CloudFront (optional later) | best for heavy static game assets       |

---

## Docker "Layer" explanation (what it means in your project)

A Docker image is built in **layers**. Each instruction in Dockerfile is basically a new layer.

- Layers get cached.
- If you change code too early in the Dockerfile, cache breaks and rebuilds become slow.
- So you structure Dockerfiles to **cache dependencies** and rebuild only what changed.

### Your project will have 3 main images (production)

1. **frontend-build image (temporary stage):**
   - installs deps
   - builds React into static files

2. **backend image (runtime):**
   - installs only production deps
   - runs `node server.js`

3. **nginx image (final gateway):**
   - serves React build
   - serves `/games/*`
   - proxies `/api/*` to backend

In dev, you'll have 2 containers mostly:
- React dev server container
- Express dev server container
- (and maybe a DB container later)

---

## "Dev vs Prod" mental model

### Dev
- Hot reload
- Source code mounted into containers
- Bigger images are okay
- Debug-friendly

### Prod
- Prebuilt static frontend
- Minimal backend image (no nodemon, no build tools)
- Nginx handles routing + caching
- Small, secure images

---

## The actual plan in one line

**Build a game launcher platform that reads game modules via manifests, serves WASM game builds as static content, and runs everything reproducibly using Docker for dev and production.**

That's your roadmap. Now go implement Phase 1 properly before you get distracted by "future expansion" fantasies like an RPG character hoarding potions forever.
