import Friendship from '../modules/Friendship.js';

class FriendsController {
    constructor(database) {
      this.friendshipModel = new Friendship(database);
    }
  
    // GET /friends - Get friends list
    async getFriends(request, reply) {
      try {
  
        const userId = request.user.userId;
        const friends = await this.friendshipModel.getFriends(userId);
        
        return { success: true, friends };
      } catch (error) {
        return reply.code(500).send({ error: error.message });
      }
    }
  
    // POST /friends/request - Send friend request
    async sendRequest(request, reply) {
      try {
      
        const userId = request.user.userId;
        const { friendId } = request.body;
        
        if (userId === friendId) {
          return reply.code(400).send({ 
            error: 'Cannot send friend request to yourself' 
          });
        }
        
        const result = await this.friendshipModel.sendRequest(userId, friendId);
        
        return reply.code(201).send(result);
      } catch (error) {
        return reply.code(500).send({ error: error.message });
      }
    }
  
    // POST /friends/accept - Accept friend request
    async acceptRequest(request, reply) {
      try {
       
        const userId = request.user.userId;
        const { friendId } = request.body;
        
        const result = await this.friendshipModel.acceptRequest(friendId, userId);
        
        return result;
      } catch (error) {
        return reply.code(500).send({ error: error.message });
      }
    }
  
    // DELETE /friends/:id - Remove friend
    async removeFriend(request, reply) {
      try {
       
        const userId = request.user.userId;
        const { id } = request.params;
        
        const result = await this.friendshipModel.removeFriendship(userId, id);
        
        return result;
      } catch (error) {
        return reply.code(500).send({ error: error.message });
      }
    }
  
    // GET /friends/requests - Get pending requests
    async getPendingRequests(request, reply) {
      try {
        
        const userId = request.user.userId;
        const requests = await this.friendshipModel.getPendingRequests(userId);
        
        return { success: true, requests };
      } catch (error) {
        return reply.code(500).send({ error: error.message });
      }
    }
  }
  
  export default FriendsController;