// import fp from 'fastify-plugin';
import * as authController from '../controllers/authController.js';
export default async function (fastify){
  fastify.post('/setup', authController.twofactor_post);
  fastify.post('/verify-2fa', authController.verify2fa_post);
}
