import ProfileController from '../controllers/profile.controller.js';
import FriendsController from '../controllers/friendship.controller.js';


async function profileRoutes(fastify, options) {
  const profileController = new ProfileController(fastify.db);
  const friendsController = new FriendsController(fastify.db);
  
  // Profile routes
  fastify.post('/profile/create', {
    schema: {
      body: {
        type: 'object',
        required: ['username', 'email', 'displayName', 'password'],
        properties: {
          username: { type: 'string' },
          email: { type: 'string' },
          displayName: { type: 'string' },
          password: { type: 'string' }
        }
      }
    }
  }, profileController.setUser.bind(profileController));

  fastify.get('/profile', profileController.getMyProfile.bind(profileController));

  fastify.get('/profile/:id', profileController.getUserProfile.bind(profileController));

  fastify.put('/profile', {
    schema: {
      body: {
        type: 'object',
        properties: {
          displayName: { type: 'string', minLength: 3, maxLength: 50 },
          bio: { type: 'string', maxLength: 500 },
          avatarUrl: { type: 'string' }
        }
      }
    }
  }, profileController.updateProfile.bind(profileController));

  fastify.post('/profile/avatar',  profileController.uploadAvatar.bind(profileController));

  fastify.get('/profile/search',  profileController.searchUsers.bind(profileController));

  // Friends routes
  fastify.get('/friends', friendsController.getFriends.bind(friendsController));

  fastify.post('/friends/request', {
    schema: {
      body: {
        type: 'object',
        required: ['friendId'],
        properties: {
          friendId: { type: 'integer' }
        }
      }
    }
  }, friendsController.sendRequest.bind(friendsController));

  fastify.post('/friends/accept', {
    schema: {
      body: {
        type: 'object',
        required: ['friendId'],
        properties: {
          friendId: { type: 'integer' }
        }
      }
    }
}, friendsController.acceptRequest.bind(friendsController));

  fastify.delete('/friends/:id', friendsController.removeFriend.bind(friendsController));

  fastify.get('/friends/requests', friendsController.getPendingRequests.bind(friendsController));
}

export default profileRoutes;