import * as service from './tournament.service.js';

export async function createTournament_post(request, reply) {
    console.log("Creating tournament with data:", request.body);
    const tournament = await service.createTournament(request.body);
    return reply.send(tournament);
}

export async function joinTournament_post(request, reply) {
    const { userId, tournamentId, password } = request.body;
    const result = await service.joinTournament(userId, tournamentId, password);
    return reply.send(result);
}

export async function leaveTournament_get(request, reply) {
    const { userId, tournamentId } = request.query;
    await service.leaveTournament(userId, tournamentId);
    return reply.send({ message: 'Left tournament' });
}

export async function checkTournament_get(request, reply) {
    const { tournamentId } = request.query;
    const tournament = await service.checkTournament(tournamentId);
    return reply.send(tournament);
}

export async function changeTournament_get(request, reply) {
    const { tournamentId, updates } = request.query;
    const tournament = await service.changeTournament(tournamentId, updates);
    return reply.send(tournament);
}

export default async function (fastify) {
    fastify.post('/create', createTournament_post);
    fastify.post('/join', joinTournament_post);
    fastify.get('/leave', leaveTournament_get);
    fastify.get('/check', checkTournament_get);
    fastify.get('/change', changeTournament_get);
}
