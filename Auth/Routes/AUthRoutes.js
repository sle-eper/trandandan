import fp from 'fastify-plugin';
import * as authController from '../controllers/authController.js';

export default fp(async function (fastify) {
  fastify.post('/signup', authController.signup_post);
  fastify.post('/login', authController.login_post);
  fastify.get('/signup', authController.signup_get);
  fastify.get('/login', authController.login_get);
});
