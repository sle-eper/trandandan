import FriendsController from '../controllers/friendshipController.js';


async function friendshipRoutes(fastify, options) {
  const friendsController = new FriendsController(fastify.db);




   fastify.post('/friends/request',{
    schema: {
      body: {
        type: 'object',
        required: ['friendId'],
        properties: {
          friendId: { type: 'integer', minimum: 1 },
        },
        additionalProperties: false
      }
    },
  },friendsController.sendRequest.bind(friendsController));

    fastify.post('/friends/accept', {
      schema: {
        body: {
          type: 'integer',
          minimum: 1
        }
      },
    }, friendsController.acceptRequest.bind(friendsController));

    fastify.delete('/friends/reject', friendsController.rejectRequest.bind(friendsController));
    fastify.get('/friendship/status/:userId/:friendId', friendsController.getStatusOfFriends.bind(friendsController));
    fastify.put('/friends/:userId/status', {
      schema: {
        body: {
          type: 'object',
          required: ['friendId', 'status'],
          properties: {
            friendId: { type: 'integer', minimum: 1 },
            status: { type: 'string', enum: ['pending', 'accepted', 'blocked'] }
          },
          additionalProperties: false
        }
      },
      
    }, friendsController.changeFriendStatus.bind(friendsController));
    fastify.get('/friend/check', friendsController.checkFriendshipStatus.bind(friendsController));
    fastify.get('/friend/requestStatus', friendsController.checkPendingRequest.bind(friendsController));
    fastify.delete('/friends/cancelRequest', friendsController.cancelFriendRequest.bind(friendsController));
    fastify.delete('/friends/removeFriend/:id', friendsController.removeFriend.bind(friendsController));
}
export default friendshipRoutes;

 // fastify.delete('/friends/:id', {
  //   schema: {
  //     params: {
  //       type: 'object',
  //       required: ['id'],
  //       properties: {
  //         id: { type: 'integer', minimum: 1 }
  //       }
  //     }
  //   },
    
  // }, friendsController.removeFriend.bind(friendsController));

  // fastify.get('/friends/requests', {
    
  // }, friendsController.getPendingRequests.bind(friendsController));