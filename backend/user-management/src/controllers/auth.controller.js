import UserModule from '../modules/user.module.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.middleware.js';

class AuthController {
  constructor(database) {
    this.userModel = new UserModule(database);
  }

  // POST /auth/login - User login
  async login(request, reply) {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        return reply.code(400).send({
          success: false,
          error: 'Email and password are required'
        });
      }

      // Find user by email
      const user = await this.userModel.findByEmail(email);
      
      if (!user) {
        return reply.code(401).send({
          success: false,
          error: 'Invalid email or password'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!isValidPassword) {
        return reply.code(401).send({
          success: false,
          error: 'Invalid email or password'
        });
      }

      // Generate JWT token
      const token = generateToken(user);

      // Get full profile
      const profile = await this.userModel.getProfile(user.id);

      return reply.code(200).send({
        success: true,
        message: 'Login successful',
        token,
        profile
      });

    } catch (error) {
      console.error('Login error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // POST /auth/verify - Verify JWT token
  async verifyToken(request, reply) {
    try {
      // If we reach here, the authenticate middleware has already verified the token
      const profile = await this.userModel.getProfile(request.user.userId);
      
      return reply.code(200).send({
        success: true,
        message: 'Token is valid',
        profile
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: 'Failed to verify token'
      });
    }
  }
}

export default AuthController;