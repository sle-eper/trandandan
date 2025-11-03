import FriendsController from '../controllers/friendship.controller.js';


async function friendshipRoutes(fastify, options) {
  const friendsController = new FriendsController(fastify.db);

  // All friendship routes require authentication
  fastify.get('/friends', {
    
  }, friendsController.getFriends.bind(friendsController));

  fastify.post('/friends/request', {
    schema: {
      body: {
        type: 'object',
        required: ['friendId'],
        properties: {
          friendId: { type: 'integer', minimum: 1 }
        },
        additionalProperties: false
      }
    },
    
  }, friendsController.sendRequest.bind(friendsController));

  fastify.post('/friends/accept', {
    schema: {
      body: {
        type: 'object',
        required: ['friendId'],
        properties: {
          friendId: { type: 'integer', minimum: 1 }
        },
        additionalProperties: false
      }
    },
    
  }, friendsController.acceptRequest.bind(friendsController));

  fastify.delete('/friends/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'integer', minimum: 1 }
        }
      }
    },
    
  }, friendsController.removeFriend.bind(friendsController));

  fastify.get('/friends/requests', {
    
  }, friendsController.getPendingRequests.bind(friendsController));
}

export default friendshipRoutes;