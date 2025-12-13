import * as service from './participant.service.js';

export default async function (fastify) {
    fastify.post('/add', service.addParticipant_post);//userowner
    fastify.post('/remove', service.removeParticipant_post);//userowner
    fastify.get('/list', service.listParticipants_get);
}
