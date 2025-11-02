import AuthController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

async function authRoutes(fastify, options) {
  const authController = new AuthController(fastify.db);

  // POST /auth/login - User login (no auth required)
  fastify.post('/auth/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { 
            type: 'string', 
            format: 'email',
            maxLength: 100
          },
          password: { 
            type: 'string', 
            minLength: 1,
            maxLength: 128
          }
        }
      }
    }
  }, authController.login.bind(authController));

  // POST /auth/verify - Verify JWT token (auth required)
  fastify.post('/auth/verify', {
    preHandler: authenticate
  }, authController.verifyToken.bind(authController));
}

export default authRoutes;