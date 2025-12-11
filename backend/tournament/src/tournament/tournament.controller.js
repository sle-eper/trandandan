import * as service from './tournament.service.js';

export async function createTournament_post(request, reply) {
   
    const tournament = await service.createTournament(request.query);
    return reply.send(tournament);
}

export async function joinTournament_post(request, reply) {
    const result = await service.joinTournament(request.query);
    return reply.send(result);
}

export async function leaveTournament_get(request, reply) {
    await service.leaveTournament(request.query);
    return reply.send({ message: 'Left tournament' });
}

export async function checkTournament_get(request, reply) {
    const tournament = await service.checkTournament(request.query);
    return reply.send(tournament);
}

export default async function (fastify) {
    fastify.post('/create', createTournament_post);
    fastify.post('/join', joinTournament_post);
    fastify.get('/leave', leaveTournament_get);
    fastify.get('/check', checkTournament_get);
}
