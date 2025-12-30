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
      // console.log('Getting user by ID from headers:', request.headers);
      const id = request.headers['x-user-id'];

      const user = await this.userModel.findById(id);
      console.log('Fetched user by ID:', user, 'for ID:', id);
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }

      return { success: true, user };
    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }

    return { success: true, user };
  } catch(error) {
    return reply.code(500).send({ error: error.message });
  }



 async setUser(request, reply) {
  try {
    let { username, email, displayName, password, id_token } = request.body;

    if (!email || !displayName) {
      return reply.code(400).send({ error: 'email and displayName are required' });
    }

    // Generate username if not provided
    if (!username) {
      username = displayName.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
    } else {
      username = username.replace(/[^a-zA-Z0-9_]/g, '_');
    }

    if (!password && !id_token) {
      return reply.code(400).send({ error: 'password or id_token is required' });
    }

    // // Hash password if provided
    // let password_hash = null;
    console.log(password);
    const userData = {
      username,
      email,
      display_name: displayName,
      id_token: id_token || null,
      password
    };

    const userId = await this.userModel.create(userData);
    const profile = await this.userModel.findById(userId);

    console.log('Created user profile:', profile);

    return reply.code(201).send({
      success: true,
      message: 'User created successfully',
      profile
    });

  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: error.message || 'Internal server error' });
  }
}


  async getUserBYemailorUsername(request, reply) {

  try {
    const { email, username } = request.query; // can be email or username


    let user = await this.userModel.findByEmail(email);
    if (user) {
      return reply.code(200).send(user);
    }
    user = await this.userModel.findByUsername(username);
    if (user) {
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

    const userId = request.headers['x-user-id'];
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


    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    console.log('Uploading avatar for user ID:', userId);


    const data = await request.file();

    if (!data) {
      return reply.code(400).send({
        success: false,
        error: 'No file uploaded'
      });
    }


    if (!ALLOWED_TYPES.includes(data.mimetype)) {
      return reply.code(400).send({
        success: false,
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed'
      });
    }


    const buffer = await data.toBuffer();

    if (buffer.length > MAX_FILE_SIZE) {
      return reply.code(413).send({
        success: false,
        error: `File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        maxSize: MAX_FILE_SIZE
      });
    }

    // Prepare upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'avatars');
    await fs.promises.mkdir(uploadDir, { recursive: true });


    try {
      const oldAvatars = await fs.promises.readdir(uploadDir);
      const userAvatars = oldAvatars.filter(file => file.startsWith(`${userId}-`));

      for (const oldAvatar of userAvatars) {
        await fs.promises.unlink(path.join(uploadDir, oldAvatar));
        console.log('Deleted old avatar:', oldAvatar);
      }
    } catch (cleanupError) {
      console.warn('Could not clean up old avatars:', cleanupError.message);
    }

    // Generate filename and save
    const extension = data.mimetype.split('/')[1];
    const filename = `${userId}-${Date.now()}.${extension}`;
    const filePath = path.join(uploadDir, filename);

    await fs.promises.writeFile(filePath, buffer);
    console.log('Avatar saved successfully:', filePath);

    // Verify file was written
    // const stats = await fs.promises.stat(filePath);
    // console.log('File size on disk:', stats.size, 'bytes');

    return reply.code(200).send({
      success: true,
      message: 'Avatar uploaded successfully',
      avatarUrl: filename,
      fileSize: buffer.length
    });

  } catch (error) {
    console.error('Avatar upload error:', error);


    if (error.code === 'ENOSPC') {
      return reply.code(507).send({
        success: false,
        error: 'Server storage full'
      });
    }

    return reply.code(500).send({
      success: false,
      error: 'Failed to upload avatar',
      // details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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

    async changePassword(request, reply) {
  try {
    const userId = request.headers['x-user-id'];
    const { currentPassword, newPassword } = request.body;
    if (!currentPassword || !newPassword) {
      return reply.code(400).send({
        error: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 8) {
      return reply.code(400).send({
        error: 'New password must be at least 8 characters'
      });
    }
    const passwordHash = await this.userModel.getPasswordHashById(userId);

    if (!passwordHash) {
      return reply.code(404).send({ error: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, passwordHash);

    if (!passwordMatch) {
      return reply.code(401).send({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userModel.updatePassword(userId, hashedPassword);

    return { success: true, message: 'Password changed successfully' };
  } catch (error) {
    console.error('Change password error:', error);
    return reply.code(500).send({ error: error.message });
  }
}
    async getAllUsers(request, reply) {
  try {
    const users = await this.userModel.getAllUsers();

    return reply.code(200).send({ success: true, users });
  } catch (error) {
    console.error('Get all users error:', error);
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


  async getTwoFactorStatus(request, reply) {
  try {
    const { username } = request.query;
    if (!username) {
      return reply.code(400).send({ error: 'Username query parameter is missing' });
    }

    const user = await this.userModel.findByUsername(username);
    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }

    return {
      success: true,
      twoFactorEnabled: user.two_factor_enabled

    };
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
}
  async enableTwoFactor(request, reply) {
  try {
    const { username } = request.query;
    const { secret } = request.body;
    if (!username || !secret) {
      return reply.code(400).send({ error: 'Username and secret are required' });
    }

    const user = await this.userModel.findByUsername(username);
    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }

    await this.userModel.setTwoFactorFlag(user.id);
    return {
      success: true,
      message: 'Two-factor authentication enabled successfully'
    };
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
}
  // i add this for setting secret key for 2FA
  async setsecretkeytwofactor(request, reply) {
  try {
    const { username, two_factor_secret } = request.body;
    console.log("Received username and secret:", username, two_factor_secret);
    if (!username || !two_factor_secret) {
      return reply.code(400).send({ error: 'Username and secret are required' });
    }
    const user = await this.userModel.findByUsername(username);
    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }
    await this.userModel.setTwoFactorSecret(user.id, two_factor_secret);
    return {
      success: true,
      message: 'Two-factor authentication enabled successfully'
    };
  }
  catch (error) {
    return reply.code(500).send({ error: error.message });
  }
}
async getsecretkeytwofactor(request, reply) {
  try {
    const { username } = request.query;
    if (!username) {
      return reply.code(400).send({ error: 'Username is required' });
    }
    const user = await this.userModel.findByUsername(username);
    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }
    const secret = await this.userModel.getTwoFactorSecret(user.id);
    return {
      success: true,
      two_factor_secret: secret
    };
  }
  catch (error) {
    return reply.code(500).send({ error: error.message });
  }
}
}
export default ProfileController;