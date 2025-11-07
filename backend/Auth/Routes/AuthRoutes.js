import fp from 'fastify-plugin';
import * as authController from '../controllers/authController.js';

export default fp(async function (fastify) {
  console.log('Registering Auth Routes emoji 🚀');
  // console.log('-----------------------------------', fastify.request.path);
  fastify.post('/signup', authController.signup_post);
  fastify.post('/login', authController.login_post);
  fastify.get('/signup', authController.signup_get);
  fastify.get('/login', authController.login_get);
  fastify.get('/google', authController.googleAuth_get);
  fastify.get('/github', authController.githubAuth_get);
  fastify.get('/google/callback', authController.googleAuthCallback_get);
  fastify.get('/github/callback', authController.githubAuthCallback_get);
});
