import * as service from './tournament.service.js';

export default async function (fastify) {
    fastify.post('/create', service.createTournament_post);
    fastify.post('/join', service.joinTournament_post);
    fastify.get('/leave', service.leaveTournament_get);
    fastify.get('/check', service.checkTournament_get);
    // fastify.post('/start', startTournament_post);

}
