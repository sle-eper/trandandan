import Fastify from 'fastify';
import fastifySocketIO from 'fastify-socket.io';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
    origin: true, // Reflect the request origin, required for credentials: true
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
});

await fastify.register(formbody);

await fastify.register(fastifySocketIO, {
    cors: {
        origin: true,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// In-memory state
const games = new Map(); // gameId -> gameState
const userSockets = new Map(); // userId/username -> socketId
const gameIntervals = new Map(); // gameId -> intervalId
let gameNamespace;

// Constants matching frontend
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const BALL_SPEED = 4;
const BALL_RADIUS = 10;
const TICK_RATE = 16; // ~60fps
const START_DELAY = 6500; // 6.5s to safe-guard frontend countdown (approx 6s duration)
const SERVE_DELAY = 500; // 1.5s for serving after a goal

// Helper: Verify Token or trust Nginx headers
const getUserFromRequest = (request) => {
    // 1. Check for Nginx pre-verified headers
    const nginxUserId = request.headers['x-user-id'];
    const nginxUsername = request.headers['x-user'];

    if (nginxUserId && nginxUsername) {
        return { id: parseInt(nginxUserId), username: nginxUsername };
    }

    // 2. Fallback: Manual JWT verification
    // Support standard headers OR Socket.IO handshake auth object
    const authHeader = request.headers['authorization'];
    let token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : request.auth?.token;

    if (!token && request.headers.cookie) {
        const matches = request.headers.cookie.match(/token=([^;]+)/);
        if (matches) token = matches[1];
    }

    if (!token) {
        console.log('No token found in request headers or auth object');
        return null;
    }

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        console.log('Token verification failed:', err.message);
        return null;
    }
};

// REST Routes
fastify.post('/api/game/create', async (request, reply) => {
    const user = getUserFromRequest(request);
    if (!user) return reply.code(401).send({ error: "Unauthorized" });

    const gameId = Math.random().toString(36).substring(2, 8); // 6 characters
    const game = {
        id: gameId,
        players: [],
        status: 'waiting',
        score: { left: 0, right: 0 },
        ball: { x: 400, y: 200, dx: 0, dy: 0 },
        paddles: { left: 150, right: 150 }
    };
    games.set(gameId, game);
    console.log(`[GAME] Created: ${gameId} by ${user.username}. Total games: ${games.size}`);
    return { gameId };
});

fastify.post('/api/game/invite', async (request, reply) => {
    const { targetUsername, gameId } = request.body;
    const user = getUserFromRequest(request);
    if (!user) return reply.code(401).send({ error: "Unauthorized" });

    const targetSocketId = userSockets.get(targetUsername);
    if (targetSocketId) {
        gameNamespace.to(targetSocketId).emit('game_invite', {
            from: user.username,
            gameId: gameId
        });
        return { success: true, message: "Invite sent" };
    } else {
        return reply.code(404).send({ success: false, message: "User not online" });
    }
});

fastify.get('/api/game/status/:gameId', async (request, reply) => {
    const { gameId } = request.params;
    const game = games.get(gameId);
    if (!game) return reply.code(404).send({ error: "Game not found" });
    return game;
});

// Socket Logic
const start = async () => {
    try {
        const PORT = process.env.PORT || 4000;

        fastify.ready(err => {
            if (err) throw err;

            gameNamespace = fastify.io.of('/game');

            // Auth Middleware for Sockets
            gameNamespace.use((socket, next) => {
                const user = getUserFromRequest(socket.handshake);
                if (!user) return next(new Error('Authentication error'));

                socket.user = user;
                next();
            });

            gameNamespace.on('connection', (socket) => {
                fastify.log.info(`User connected to /game: ${socket.user.username} (${socket.id})`);

                socket.emit('user_info', socket.user);

                userSockets.set(socket.user.username, socket.id);
                userSockets.set(socket.user.id, socket.id);

                socket.on('join_game', (data) => {
                    // Support both old string format and new object format { gameId, side }
                    let gameId, requestedSide;
                    if (typeof data === 'string') {
                        gameId = data;
                    } else {
                        gameId = data.gameId;
                        requestedSide = data.side;
                    }

                    console.log(`[SOCKET] User ${socket.user.username} attempting to join game: ${gameId} (Requested side: ${requestedSide || 'any'})`);

                    let game = games.get(gameId);

                    // Reset if game was finished
                    if (game && game.status === 'finished') {
                        console.log(`[SOCKET] Resetting finished game ${gameId} for new session`);
                        game.status = 'waiting';
                        game.score = { left: 0, right: 0 };
                        game.players = [];
                        game.ball = { x: 400, y: 200, dx: 0, dy: 0 };
                        game.paddles = { left: 150, right: 150 };
                        if (game.rematchTimeout) {
                            clearTimeout(game.rematchTimeout);
                            delete game.rematchTimeout;
                        }
                        if (game.rematchRequests) delete game.rematchRequests;
                    }

                    // Check if game exists - don't create it automatically
                    if (!game) {
                        console.log(`[SOCKET] Game ${gameId} not found. User ${socket.user.username} cannot join.`);
                        socket.emit('error', { message: 'Game not found. Please check the Game ID.' });
                        return;
                    }

                    if (game) {
                        socket.join(gameId);
                        console.log(`[SOCKET] User ${socket.user.username} successfully joined room: ${gameId}`);

                        // Check if player already in game
                        let player = game.players.find(p => p.id === socket.user.id);

                        if (player) {
                            player.socketId = socket.id;
                            console.log(`[SOCKET] User ${socket.user.username} re-joined with new socket`);

                            if (game.status === 'playing') {
                                socket.emit('game_start', game);
                            } else {
                                socket.emit('waiting_for_opponent', game);
                            }
                            return;
                        }

                        // New player joining
                        if (game.players.length < 2) {
                            // Determine side: use requested if available and free, otherwise take whatever is left
                            let side;
                            const occupiedSides = game.players.map(p => p.side);

                            if (requestedSide && !occupiedSides.includes(requestedSide)) {
                                side = requestedSide;
                            } else {
                                side = occupiedSides.includes('left') ? 'right' : 'left';
                            }

                            console.log(`[SOCKET] Assigning ${socket.user.username} to side: ${side}`);

                            game.players.push({
                                id: socket.user.id,
                                username: socket.user.username,
                                side,
                                socketId: socket.id
                            });

                            if (game.players.length === 2) {
                                game.status = 'playing';
                                gameNamespace.to(gameId).emit('game_start', game);
                                startGameLoop(gameId);
                            } else {
                                socket.emit('waiting_for_opponent', game);
                            }
                        } else {
                            socket.emit('game_full');
                        }
                    } else {
                        socket.emit('error', 'Game not found');
                    }
                });

                socket.on('disconnect', () => {
                    userSockets.delete(socket.user.username);
                    userSockets.delete(socket.user.id);
                    console.log(`[SOCKET] User ${socket.user.username} disconnected`);
                    // Find any game where this player was waiting and remove them
                    games.forEach((game, gameId) => {
                        if (game.status === 'waiting') {
                            const index = game.players.findIndex(p => p.id === socket.user.id);
                            if (index !== -1) {
                                game.players.splice(index, 1);
                                console.log(`[SOCKET] Removed ${socket.user.username} from waiting game ${gameId}`);
                                if (game.players.length === 0) {
                                    games.delete(gameId);
                                    console.log(`[SOCKET] Deleted empty waiting game ${gameId}`);
                                }
                            }
                        } else if (game.status === 'playing') {
                            const disconnectingPlayer = game.players.find(p => p.id === socket.user.id);
                            if (disconnectingPlayer) {
                                console.log(`[SOCKET] Player ${socket.user.username} left active game ${gameId}. Stopping loop.`);
                                stopGameLoop(gameId);

                                const winner = game.players.find(p => p.id !== socket.user.id);
                                if (winner) {
                                    game.status = 'finished';

                                    // Set score to 3-0 for the winner
                                    if (winner.side === 'left') {
                                        game.score.left = 3;
                                        game.score.right = 0;
                                    } else {
                                        game.score.left = 0;
                                        game.score.right = 3;
                                    }

                                    console.log(`[GAME] Awarding 3-0 victory to ${winner.username} in game ${gameId}`);

                                    gameNamespace.to(gameId).emit('game_over', {
                                        winner,
                                        score: game.score,
                                        players: game.players,
                                        reason: 'opponent_disconnected'
                                    });

                                    saveMatchResult(game, winner, disconnectingPlayer);

                                    game.rematchTimeout = setTimeout(() => {
                                        if (games.has(gameId) && games.get(gameId).status === 'finished') {
                                            games.delete(gameId);
                                            console.log(`[GAME] Cleaned up finished game after disconnect: ${gameId}`);
                                        }
                                    }, 60000);
                                }
                            }
                        }
                    });
                });

                socket.on('paddle_move', (data) => {
                    const { gameId, y } = data;
                    const game = games.get(gameId);
                    if (game) {
                        const player = game.players.find(p => p.id === socket.user.id);
                        if (player) {
                            game.paddles[player.side] = y;
                            socket.to(gameId).emit('opponent_move', { side: player.side, y });
                        }
                    }
                });

                socket.on('request_rematch', (data) => {
                    const { gameId } = data;
                    let game = games.get(gameId);

                    if (game && (game.status === 'finished' || game.status === 'playing')) {
                        if (!game.rematchRequests) game.rematchRequests = new Set();
                        game.rematchRequests.add(socket.user.id);

                        console.log(`[REMATCH] Request from ${socket.user.username} for game ${gameId}. Total: ${game.rematchRequests.size}`);

                        // Notify the other player
                        socket.to(gameId).emit('rematch_requested', { from: socket.user.username });

                        if (game.rematchRequests.size === 2) {
                            console.log(`[REMATCH] Both players agreed for game ${gameId}. Restarting!`);

                            if (game.rematchTimeout) clearTimeout(game.rematchTimeout);

                            // Reset state
                            game.status = 'playing';
                            game.score = { left: 0, right: 0 };
                            game.ball = { x: 400, y: 200, dx: 0, dy: 0 };
                            game.paddles = { left: 150, right: 150 };
                            game.rematchRequests = new Set();

                            // Broadcast reset state to all clients
                            gameNamespace.to(gameId).emit('game_start', game);

                            stopGameLoop(gameId);
                            startGameLoop(gameId);
                        }
                    } else {
                        console.log(`[REMATCH] Game ${gameId} not found or invalid status`);
                    }
                });

                // ball_sync is now deprecated as server is authoritative
                // socket.on('ball_sync', ...)
            });
        });

        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Game Service running on port ${PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

async function saveMatchResult(game, winner, loser) {
    if (!winner || !loser) return;
    try {
        await axios.post(`${process.env.USER_MANAGEMENT_URL}/api/game/result`, {
            user1_id: game.players.find(p => p.side === 'left')?.id,
            user2_id: game.players.find(p => p.side === 'right')?.id,
            user1_score: game.score.left,
            user2_score: game.score.right,
            winner_id: winner.id,
            game_mode: 'classic'
        });
        console.log('Match result saved to user-management');
    } catch (err) {
        console.error('Failed to save match result:', err.message);
    }
}

// --- Server-Authoritative Logic ---

function startGameLoop(gameId, delay = START_DELAY) {
    if (gameIntervals.has(gameId)) return;

    const game = games.get(gameId);
    if (!game) return;

    // Wait for delay/countdown
    setTimeout(() => {
        if (!games.has(gameId)) return;

        // Initial ball velocity
        game.ball.dx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
        game.ball.dy = (Math.random() * 2 - 1) * BALL_SPEED;

        const intervalId = setInterval(() => {
            updateGamePhysics(gameId);
        }, TICK_RATE);

        gameIntervals.set(gameId, intervalId);
        console.log(`[GAME] Started loop for: ${gameId}`);
    }, delay);
}

function stopGameLoop(gameId) {
    const intervalId = gameIntervals.get(gameId);
    if (intervalId) {
        clearInterval(intervalId);
        gameIntervals.delete(gameId);
        console.log(`[GAME] Stopped loop for: ${gameId}`);
    }
}

function updateGamePhysics(gameId) {
    const game = games.get(gameId);
    if (!game || game.status !== 'playing') {
        stopGameLoop(gameId);
        return;
    }

    const ball = game.ball;
    const paddles = game.paddles;

    // Move Ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall Rebound (Top/Bottom)
    if (ball.y - BALL_RADIUS <= 0) {
        ball.y = BALL_RADIUS;
        ball.dy *= -1;
    } else if (ball.y + BALL_RADIUS >= CANVAS_HEIGHT) {
        ball.y = CANVAS_HEIGHT - BALL_RADIUS;
        ball.dy *= -1;
    }

    // Paddle Collisions
    const paddleWidth = PADDLE_WIDTH;
    const paddleHeight = PADDLE_HEIGHT;

    // Left Paddle Hit
    if (ball.dx < 0 && ball.x - BALL_RADIUS <= paddleWidth) {
        // Double check vertical range
        if (ball.y >= paddles.left && ball.y <= paddles.left + paddleHeight) {
            ball.dx = Math.abs(ball.dx) * 1.05; // Bounce back & speed up
            ball.x = paddleWidth + BALL_RADIUS;

            // Add spin (vertical influence)
            const relativeIntersectY = (paddles.left + (paddleHeight / 2)) - ball.y;
            const normalizedIntersectY = relativeIntersectY / (paddleHeight / 2);
            ball.dy = -normalizedIntersectY * Math.abs(ball.dx);
        }
    }

    // Right Paddle Hit
    if (ball.dx > 0 && ball.x + BALL_RADIUS >= CANVAS_WIDTH - paddleWidth) {
        if (ball.y >= paddles.right && ball.y <= paddles.right + paddleHeight) {
            ball.dx = -Math.abs(ball.dx) * 1.05; // Bounce back & speed up
            ball.x = CANVAS_WIDTH - paddleWidth - BALL_RADIUS;

            // Add spin (vertical influence)
            const relativeIntersectY = (paddles.right + (paddleHeight / 2)) - ball.y;
            const normalizedIntersectY = relativeIntersectY / (paddleHeight / 2);
            ball.dy = -normalizedIntersectY * Math.abs(ball.dx);
        }
    }

    // Scoring
    let scored = false;
    if (ball.x <= 0) {
        game.score.right++;
        scored = true;
    } else if (ball.x >= CANVAS_WIDTH) {
        game.score.left++;
        scored = true;
    }

    if (scored) {
        ball.x = CANVAS_WIDTH / 2;
        ball.y = CANVAS_HEIGHT / 2;
        ball.dx = 0;
        ball.dy = 0;

        // Broadcast reset state immediately so clients see the ball at center
        gameNamespace.to(gameId).emit('goal_scored', { ball: game.ball, score: game.score });

        // Check for Game Over
        if (game.score.left >= 5 || game.score.right >= 5) {
            game.status = 'finished';
            const winner = game.score.left >= 5 ? game.players.find(p => p.side === 'left') : game.players.find(p => p.side === 'right');
            const loser = game.score.left >= 5 ? game.players.find(p => p.side === 'right') : game.players.find(p => p.side === 'left');

            gameNamespace.to(gameId).emit('game_over', { winner, score: game.score, players: game.players });
            //
            saveMatchResult(game, winner, loser);
            stopGameLoop(gameId);

            // Wait some time before deleting the game to allow for rematch requests
            // If they don't rematch within 60 seconds, delete it.
            game.rematchTimeout = setTimeout(() => {
                if (games.has(gameId) && games.get(gameId).status === 'finished') {
                    games.delete(gameId);
                    console.log(`[GAME] Cleaned up finished game: ${gameId}`);
                }
            }, 60000);

            return;
        }

        // Delay briefly before serving (shorter delay than initial start)
        stopGameLoop(gameId);
        setTimeout(() => startGameLoop(gameId, SERVE_DELAY), 100);
    }

    // Broadcast current state to all players in the room
    gameNamespace.to(gameId).emit('ball_update', { ball: game.ball, score: game.score });
}

start();
