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
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎮 About

**Trandandan** is a full-stack web-based Ping Pong game built with a microservices architecture. Players can register, log in via credentials or OAuth (Google & GitHub), chat with other players, and compete in real-time matches — all accessible through a single API gateway.

---

## ✨ Features

- 🏓 **Ping Pong Game** — playable in the browser
- 💬 **Real-time Chat** — built-in chat system between players
- 🔐 **JWT Authentication** — secure session management
- 🌐 **OAuth 2.0** — sign in with Google or GitHub
- 👤 **User Management** — registration, login, and user profiles
- 🚀 **Microservices** — each concern is a separate, independently deployable service
- 🐳 **Docker Compose** — one command to run the whole stack

---

## 🏗 Architecture

```
                        ┌──────────────────────────────┐
                        │         Browser / Client      │
                        └──────────────┬───────────────┘
                                       │
                                  HTTP :8080
                                       │
                        ┌──────────────▼───────────────┐
                        │      API Gateway (Nginx)      │
                        │          port 8080            │
                        └────┬──────────────┬──────────┘
                             │              │
                    /auth/*  │              │  /users/*
                             │              │
             ┌───────────────▼──┐     ┌────▼────────────────┐
             │  Auth Service    │     │  User Management     │
             │   port 5000      │     │     port 3001        │
             │  Google OAuth    │     │   SQLite / JSON DB   │
             │  GitHub OAuth    │     │                      │
             │  JWT Tokens      │     └──────────────────────┘
             └──────────────────┘

             ┌──────────────────────────────────────────────┐
             │              Chat Service                     │
             │         (WebSocket / Real-time)               │
             └──────────────────────────────────────────────┘

             ┌──────────────────────────────────────────────┐
             │         Frontend — Login Page                 │
             │         HTML / CSS / JavaScript              │
             └──────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Frontend       | HTML, CSS, TypeScript             |
| Backend        | Node.js, TypeScript, JavaScript   |
| Auth           | JWT, OAuth 2.0 (Google & GitHub)  |
| Database       | SQLite / JSON flat file           |
| API Gateway    | Nginx                             |
| Chat           | JavaScript (WebSocket)            |
| Containerization | Docker, Docker Compose          |

---

## 📁 Project Structure

```
trandandan/
├── api-gateway/          # Nginx reverse proxy config
├── backend/
│   ├── Auth/             # Authentication service (JWT + OAuth)
│   └── user-management/  # User CRUD and profile management
├── chat/                 # Real-time chat module
├── frontend/
│   └── login_page/       # Login & signup UI
├── docker-compose.yml    # Orchestrates all services
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

# 2. Switch to the final version branch
git checkout gogo

# 3. Set up environment variables (see section below)
cp backend/Auth/.env.example backend/Auth/.env
# Edit the .env file with your credentials

# 4. Build and start all services
docker-compose up --build
```

### Access the App

Once all containers are running, open your browser:

| Service        | URL                        |
|----------------|----------------------------|
| App (Gateway)  | http://localhost:8080       |
| Auth Service   | http://localhost:5000       |
| User Service   | http://localhost:3001       |

---

## 🔑 Environment Variables

The Auth service requires a `.env` file at `backend/Auth/.env`.

Create the file and fill in the following variables:

```env
# ── JWT ──────────────────────────────────────────
JWT_SECRET=your_super_secret_key_here

# ── Google OAuth ─────────────────────────────────
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8080/auth/google/callback

# ── GitHub OAuth ─────────────────────────────────
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:8080/auth/github/callback

# ── App ──────────────────────────────────────────
PORT=5000
NODE_ENV=development
```

### How to get OAuth credentials

**Google:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web Application)
4. Add `http://localhost:8080/auth/google/callback` as an authorized redirect URI

**GitHub:**
1. Go to GitHub → Settings → Developer Settings → OAuth Apps
2. Create a new OAuth App
3. Set the callback URL to `http://localhost:8080/auth/github/callback`

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "feat: add your feature description"

# 4. Push to your branch
git push origin feature/your-feature-name

# 5. Open a Pull Request against the gogo branch
```

### Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix     | Use for                        |
|------------|--------------------------------|
| `feat:`    | New features                   |
| `fix:`     | Bug fixes                      |
| `docs:`    | Documentation changes          |
| `refactor:`| Code refactoring               |
| `chore:`   | Build tasks, config changes    |

### Reporting Issues

Found a bug or have a suggestion? [Open an issue](https://github.com/sle-eper/trandandan/issues) with a clear description and steps to reproduce.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
Made with ❤️ by <a href="https://github.com/sle-eper">sle-eper</a>
</div>