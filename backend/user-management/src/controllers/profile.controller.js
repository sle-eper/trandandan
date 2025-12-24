import UserModule from '../modules/userModule.js';
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

    async getById(request, reply) { 
      try {
        const { id } = request.params;
        const user = await this.userModel.findById(id);
        
        if (!user) {
          return reply.code(404).send({ error: 'User not found' });
        }
        
        return { success: true, user };
      } catch (error) {
        return reply.code(500).send({ error: error.message });
      }
    }


 async setUser(request, reply) {
  try {
    let { username, email, displayName, password, id_token } = request.body;

    // Required fields for all users
    if (!email || !displayName) {
      return reply.code(400).send({
        error: 'email and displayName are required',
      });
    }

    // If no username provided (OAuth), generate a safe one
    if (!username) {
      username = displayName.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
    } else {
      // Sanitize username to match pattern
      username = username.replace(/[^a-zA-Z0-9_]/g, '_');
    }

    // Must be classic signup OR OAuth
    if (!password && !id_token) {
      return reply.code(400).send({
        error: 'password or id_token is required',
      });
    }

    // Hash password if provided
    let password_hash = null;
    if (password) {
      password_hash = await bcrypt.hash(password, 10);
    }

    // Build user data
    const userData = {
    username,
    email,
    display_name: displayName,
    id_token: id_token || null,
    password_hash: password ? await bcrypt.hash(password, 10) : null
  };

    // Create user in DB
    const userId = await this.userModel.create(userData);
    const profile = await this.userModel.findById(userId);

    console.log('Created user profile:', profile);

    return reply.code(201).send({
      success: true,
      message: 'User created successfully',
      profile,
    });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({
      error: error.message || 'Internal server error',
    });
  }
}



  async getUserBYemailorUsername(request, reply) {

    try {
      const { email, username } = request.query; // can be email or username


      let user = await this.userModel.findByEmail(email);
      if(user){
        return reply.code(200).send(user);
      }
      user = await this.userModel.findByUsername( username);
      if(user){
        return reply.code(200).send(user);
      }
      return reply.code(200).send(null);
    }
    catch (error) {
      console.error(error);
      return reply.code(500).send({ error: error.message });
    }
  }
  
    // GET /profile - Get current user profile(user information and stats) will be used in dashboard
    async getMyProfile(request, reply) {
      try {
        const userId = request.headers['x-user-id'];
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
        const id = request.headers['x-user-id'];
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
  

  // PUT /profile/update - Update profile
  async updateProfile(request, reply) {
    try {
    
      // const userId = request.headers['x-user-id'];
      const { id: userId } = request.params;
      const updates = request.body;
      console.log('Update request received for user ID:', updates);
      console.log('User is updating:', Object.keys(updates));
      
      if (updates.email) {
        const existingUser = await this.userModel.findByEmail(updates.email);
        
        if (existingUser && existingUser.id !== userId) {
          console.log('Email already taken:', updates.email);
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
          console.log('Display name already taken:', updates.displayName);
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
        
        const userId = request.headers['x-user-id'];
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