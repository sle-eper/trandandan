import UserModule from '../modules/user.module.js';
import Friendship from '../modules/Friendship.js';
import UserStats from '../modules/UserStats.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
class ProfileController {

    constructor(database) {
      this.userModel = new UserModule(database);
      this.friendshipModel = new Friendship(database);
      this.statsModel = new UserStats(database);
    }




  async setUser(request, reply) {
    try {
      const { username, email, displayName, password } = request.body;

      if (!username || !email || !displayName || !password) {
        return reply.code(400).send({ error: 'All fields are required' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
     
      const userId = await this.userModel.create({
        username,
        email,
        passwordHash,
        display_name: displayName
      });

      const profile = await this.userModel.getProfile(userId);

      return reply.code(201).send({
        success: true,
        message: 'User created successfully',
        profile
      });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: error.message });
    }
  }

  
    // GET /profile - Get current user profile(user information and stats) will be used in dashboard
    async getMyProfile(request, reply) {
      try {
        const userId = request.user.userId;
        const profile = await this.userModel.getProfile(userId);
        
        if (!profile) {
          return reply.code(404).send({ error: 'Profile not found' });
        }
        
        return { success: true, profile };
      } catch (error) {
        return reply.code(500).send({ error: error.message });
      }
    }
  
    // GET /profile/:id - Get another user's profile (view another user's profile /dashboard)
    async getUserProfile(request, reply) {
      try {
        const { id } = request.params;
        const profile = await this.userModel.getProfile(id);
        
        if (!profile) {
          return reply.code(404).send({ error: 'User not found' });
        }
        
        //Check if they're friends
        // const areFriends = await this.friendshipModel.areFriends(
        //   request.user.userId, 
        //   id
        // );
        
        return { success: true, profile };
      } catch (error) {
        return reply.code(500).send({ error: error.message });
      }
    }
  

  // PUT /profile - Update profile
  async updateProfile(request, reply) {
    try {
    
      const userId = request.user.userId;
      const updates = request.body;
      
      console.log('User is updating:', Object.keys(updates));
      
      if (updates.email) {
        const existingUser = await this.userModel.findByEmail(updates.email);
        
        if (existingUser && existingUser.id !== userId) {
          return reply.code(409).send({ 
            error: 'Email already taken' 
          });
        }
      }

      if (updates.displayName) {
        const availableName = await this.userModel.findByDisplayName(
          updates.displayName, 
        );
        
        if (availableName && availableName.id !== userId) {
          return reply.code(409).send({ 
            error: 'Display name already taken' 
          });
        }
      }
      
      const updatedProfile = await this.userModel.updateProfile(userId, updates);
      
      return { 
        success: true, 
        message: 'Profile updated successfully',
        profile: updatedProfile 
      };
    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  }
  
    // POST /profile/avatar - Upload avatar
    async uploadAvatar(request, reply) {
      try {
        
        const userId = request.user.userId;
        const data = await request.file();
        
        if (!data) {
          return reply.code(400).send({ error: 'No file uploaded' });
        }
        
        // Validate file type add size limit later !!!
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(data.mimetype)) {
          return reply.code(400).send({ 
            error: 'Invalid file type. Only JPEG, PNG, and GIF allowed' 
          });
        }
        
        const uploadDir = path.join(process.cwd(), 'public', 'avatars');
        await fs.promises.mkdir(uploadDir, { recursive: true });

        const filename = `${userId}-${Date.now()}.${data.mimetype.split('/')[1]}`;
        const filePath = path.join(uploadDir, filename);

        
        const buffer = await data.toBuffer();
        await fs.promises.writeFile(filePath, buffer);

       
        const avatarUrl = `/avatars/${filename}`;
        await this.userModel.updateProfile(userId, { avatarUrl });
        
        return { 
          success: true, 
          message: 'Avatar uploaded successfully',
          avatarUrl 
        };
      } catch (error) {
        return reply.code(500).send({ error: error.message });
      }
    }
  
    // GET /users/search?q=John - Search users 
    async searchUsers(request, reply) {
      try {
        const { q } = request.query;
        
        if (!q || q.length < 2) {
          return reply.code(400).send({ 
            error: 'Search query must be at least 2 characters' 
          });
        }
        
        const users = await this.userModel.searchByDisplayName(q);
        
        return { success: true, users };
      } catch (error) {
        return reply.code(500).send({ error: error.message });
      }
    }
  }
  
  export default ProfileController;