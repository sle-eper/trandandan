
import { saveGameResult, getMatchHistory } from '../controllers/gameController.js';

export default async function gameRoutes(fastify, options) {
    fastify.post('/api/game/result', saveGameResult);
    fastify.get('/api/game/history/:userId', getMatchHistory);
}
