import * as tournament from './tournament.service.js';
import * as participant from './participant.service.js';
export default async function (fastify) {
    fastify.post('/create', tournament.createTournament_post);
    fastify.get('/list', tournament.listTournaments_get);
    fastify.post('/join', tournament.joinTournament_post);
    fastify.get('/leave', tournament.leaveTournament_get);
    fastify.get('/check', tournament.checkTournament_get);
    fastify.post('/start', tournament.startTournament_post)
    fastify.post('/participant/add', participant.addParticipant_post);//userowner
    fastify.post('/participant/remove', participant.removeParticipant_post);//userowner
    fastify.get('/participant/list', participant.listParticipants_get);
    fastify.get('/My/status', participant.getMyStatus_get);
}
