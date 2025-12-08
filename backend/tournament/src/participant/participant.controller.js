import * as participantService from './participant.service.js';

export async function addParticipant_post(request, reply) {
}

export async function removeParticipant_post(request, reply) {
}
export async function listParticipants_get(request, reply) {
}
export async function countParticipants_get(request, reply) {
}

export default async function (fastify) {
    fastify.post('/add', addParticipant_post);
    fastify.post('/remove', removeParticipant_post);
    fastify.get('/list', listParticipants_get);
    fastify.get('/count', countParticipants_get);
}
