<div align="center">

# 🏓 Trandandan

**A full-stack multiplayer Ping Pong game with real-time chat, user authentication, and OAuth support.**

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)

---

## 🎮 About

**ft_transcendance** is a full-stack web-based Ping Pong game built with a microservices architecture. Players can register, log in via credentials or OAuth (Google & GitHub), chat with other players, and compete in real-time matches — all served securely through an SSL-terminating API gateway.

---

## ✨ Features

### 🏓 Game Modes
- **1v1 Local** — two players compete on the same machine using the same keyboard
- **1v1 Online** — real-time multiplayer matches over the network
- **Tournament Mode** — bracket-based competition between multiple players
- **AI Opponent** — play solo against a bot

### 💬 Chat
- **Real-time messaging** between players via WebSocket
- **In-game chat** during active matches
- **Direct messages** between registered users

### 🔐 Auth & Users
- **JWT Authentication** — stateless, secure session management
- **OAuth 2.0** — sign in with Google or GitHub
- **User Management** — registration, login, and player profiles

### 🏗 Infrastructure
- **SSL/TLS** — HTTPS enforced at the gateway level; Nginx handles termination
- **Microservices** — each concern is a separate, independently deployable service
- **Docker Compose** — one command spins up the entire stack

---

    
## 🛠 Tech Stack

| Layer            | Technology                              |
|------------------|-----------------------------------------|
| Frontend         | HTML, CSS, JavaScript                   |
| Game Engine      | JavaScript (Canvas API)                 |
| Backend          | Node.js, TypeScript                     |
| Auth             | JWT, OAuth 2.0 (Google & GitHub)        |
| Real-time        | WebSocket                               |
| Database         | SQLite / JSON flat file                 |
| API Gateway      | Nginx (SSL termination, reverse proxy)  |
| Security         | TLS/SSL — HTTPS enforced at gateway     |
| Containerization | Docker, Docker Compose                  |

---

## 📁 Project Structure

```
trandandan/
├── api-gateway/                  # Nginx config — SSL termination & routing
│   ├── nginx.conf                # Reverse proxy rules per service
│   └── certs/                    # SSL certificate & key
├── backend/
│   ├── Auth/                     # Authentication service — JWT + OAuth
│   │   └── .env                  # OAuth credentials & secrets (not committed)
│   └── user-management/          # User CRUD, profiles, SQLite/JSON storage
│       └── data/                 # Persistent player data
├── chat/                         # Real-time chat + game matchmaking service
│                                 #   WebSocket server, DMs, in-game chat,
│                                 #   tournament logic, AI opponent
├── frontend/
│   └── login_page/               # Login & signup UI (HTML/CSS/JS)
├── docker-compose.yml            # Orchestrates all services on app-network
└── TODO.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/) (v20+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2+)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sle-eper/trandandan.git
cd trandandan

# 2. Set up environment variables (see section below)
cp backend/Auth/.env.example backend/Auth/.env
# Edit the file with your OAuth credentials and secrets

# 3. Build and start all services
docker-compose up --build
```

The app is served at **https://localhost** once all containers are healthy.

---

## 🔑 Environment Variables

Create `backend/Auth/.env` and fill in the variables below. Never commit this file — it is already listed in `.gitignore`.

**JWT**

| Variable | Description |
|---|---|
| `JWT_SECRET` | Secret key used to sign and verify tokens |

**Google OAuth**

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | Client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Client secret from Google Cloud Console |
| `GOOGLE_CALLBACK_URL` | Must be `https://localhost/auth/google/callback` |

To obtain Google credentials: go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → Create OAuth 2.0 Client ID (Web Application), and add the callback URL above as an authorized redirect URI.

**GitHub OAuth**

| Variable | Description |
|---|---|
| `GITHUB_CLIENT_ID` | Client ID from GitHub Developer Settings |
| `GITHUB_CLIENT_SECRET` | Client secret from GitHub Developer Settings |
| `GITHUB_CALLBACK_URL` | Must be `https://localhost/auth/github/callback` |

To obtain GitHub credentials: go to GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App, and set the callback URL above.

**App**

| Variable | Description |
|---|---|
| `PORT` | Port the Auth service listens on (default: `5000`) |
| `NODE_ENV` | Runtime environment (`development` or `production`) |

---

<div align="center">
 ❤️ 
</div>
