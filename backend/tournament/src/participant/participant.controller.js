import * as service from './participant.service.js';

export async function addParticipant_post(request, reply) {

    const result = await service.addParticipant(request.query);
    reply.send(result)
}

export async function removeParticipant_post(request, reply) {
}
export async function listParticipants_get(request, reply) {
}
export async function countParticipants_get(request, reply) {
}

export default async function (fastify) {
    console.log("============================================\n");
    fastify.post('/add', addParticipant_post);//userowner
    fastify.post('/remove', removeParticipant_post);//userowner
    fastify.get('/list', listParticipants_get);
    fastify.get('/count', countParticipants_get);
}
