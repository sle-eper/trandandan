// import fp from 'fastify-plugin';
import * as authController from '../controllers/authController.js';
import * as oauthController from '../controllers/OauthController.js';
import  * as twofactor from '../controllers/2FactorAuth.js';
export default async function (fastify){

  //auth routes
  fastify.post('/signup', authController.signup_post);
  fastify.post('/login', authController.login_post);
  fastify.post('/logout', authController.logout_post);
  // 2factor routes
  fastify.get('/2f/setup', twofactor.twofactor_get);
  fastify.post('/2f/verify-2fa', twofactor.verify2fa_post);
  fastify.post('/verify-2factor', twofactor.twofactorlogin_post);
  //  oauth routes
  fastify.get('/google', oauthController.googleAuth_get);
  fastify.get('/github', oauthController.githubAuth_get);
  fastify.get('/google/callback', oauthController.googleAuthCallback_get);
  fastify.get('/github/callback', oauthController.githubAuthCallback_get);

  //reset password routes
  fastify.post('/forget-password', authController.forgetPassword_post);
  fastify.post('/reset-password', authController.resetPassword_post);
}
