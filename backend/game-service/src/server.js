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
        fastify.io.to(targetSocketId).emit('game_invite', {
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

            // Auth Middleware for Sockets
            fastify.io.use((socket, next) => {
                const user = getUserFromRequest(socket.handshake);
                if (!user) return next(new Error('Authentication error'));

                socket.user = user;
                next();
            });

            fastify.io.on('connection', (socket) => {
                fastify.log.info(`User connected: ${socket.user.username} (${socket.id})`);

                socket.emit('user_info', socket.user);

                userSockets.set(socket.user.username, socket.id);
                userSockets.set(socket.user.id, socket.id);

                socket.on('join_game', (gameId) => {
                    console.log(`[SOCKET] User ${socket.user.username} (ID: ${socket.user.id}) attempting to join game: ${gameId}`);

                    let game = games.get(gameId);

                    // Lazy Creation: If game doesn't exist (e.g. from chat challenge), create it
                    if (!game) {
                        console.log(`[SOCKET] Game ${gameId} not found, creating it...`);
                        game = {
                            id: gameId,
                            players: [],
                            status: 'waiting',
                            score: { left: 0, right: 0 },
                            ball: { x: 400, y: 200, dx: 0, dy: 0 },
                            paddles: { left: 150, right: 150 }
                        };
                        games.set(gameId, game);
                    }

                    if (game) {
                        socket.join(gameId);
                        console.log(`[SOCKET] User ${socket.user.username} successfully joined room: ${gameId}`);

                        // Check if player already in game
                        let player = game.players.find(p => p.id === socket.user.id);

                        // If player is already in but with a different socket, update the socketId
                        if (player) {
                            player.socketId = socket.id;
                            console.log(`[SOCKET] User ${socket.user.username} re-joined with new socket`);

                            if (game.status === 'playing') {
                                // Resume game for this player
                                socket.emit('game_start', game);
                            } else {
                                socket.emit('waiting_for_opponent', game);
                            }
                            return;
                        }

                        // New player joining
                        if (game.players.length < 2) {
                            const side = game.players.length === 0 ? 'left' : 'right';
                            game.players.push({
                                id: socket.user.id,
                                username: socket.user.username,
                                side,
                                socketId: socket.id
                            });

                            if (game.players.length === 2) {
                                game.status = 'playing';
                                fastify.io.to(gameId).emit('game_start', game);
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

                // Simple ball sync for now - ideally server does logic
                socket.on('ball_sync', (data) => {
                    const { gameId, ball, score } = data;
                    const game = games.get(gameId);
                    if (game) {
                        game.ball = ball;
                        game.score = score;
                        socket.to(gameId).emit('ball_update', { ball, score });

                        // Check for game over (Updated winning score to 5 to match frontend)
                        if (score.left >= 5 || score.right >= 5) {
                            game.status = 'finished';
                            const winner = score.left >= 5 ? game.players.find(p => p.side === 'left') : game.players.find(p => p.side === 'right');
                            const loser = score.left >= 5 ? game.players.find(p => p.side === 'right') : game.players.find(p => p.side === 'left');

                            fastify.io.to(gameId).emit('game_over', { winner, score });

                            // Persist result
                            if (game.players.length === 2) {
                                saveMatchResult(game, winner, loser);
                            }
                            games.delete(gameId);
                        }
                    }
                });
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
    try {
        const user1 = game.players.find(p => p.side === 'left');
        const user2 = game.players.find(p => p.side === 'right');

        await axios.post(`${process.env.USER_MANAGEMENT_URL}/api/game/result`, {
            user1_id: user1.id,
            user2_id: user2.id,
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

start();
