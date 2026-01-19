import { saveGameResult, getMatchHistory, getAllMatches } from '../controllers/gameController.js';

export default async function gameRoutes(fastify, options) {
    fastify.post('/api/game/result', saveGameResult);
    fastify.get('/api/game/history/all', getAllMatches);
    fastify.get('/api/game/history/:userId', getMatchHistory);
}
