// import fp from 'fastify-plugin';
import * as authController from '../controllers/authController.js';
import * as oauthController from '../controllers/OauthController.js';
export default async function (fastify){
  fastify.post('/signup', authController.signup_post);
  fastify.post('/verify_mail', authController.mail_post)
  fastify.post('/login', authController.login_post);
  fastify.get('/google', oauthController.googleAuth_get);
  fastify.get('/github', oauthController.githubAuth_get);
  fastify.get('/google/callback', oauthController.googleAuthCallback_get);
  fastify.get('/github/callback', oauthController.githubAuthCallback_get);
}
