import Friendship from '../modules/Friendship.js';

class FriendsController {
    constructor(database) {
      this.friendshipModel = new Friendship(database);
    }
    


    // GET /friends - Get friends list
    async getFriends(request, reply) {
      try {
        
        const userId = request.params.id;
        const friends = await this.friendshipModel.getFriends(userId);
        return { success: true, friends };
      } catch (error) {
        return reply.code(500).send({ error: error.message });
      }
    }

    // Send friend request
    async sendRequest(request, reply) {
      try {
        const userId = request.headers['x-user-id'];
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
    // Accept friend request
    async acceptRequest(request, reply) {
      try {
       
        const userId = request.headers['x-user-id'];
        const friendId = request.body;
        const result = await this.friendshipModel.acceptRequest( userId,friendId);
        
        return result;
      } catch (error) {
        return reply.code(500).send({ error: error.message });
      }
    }
    // Reject friend request
    async rejectRequest(request, reply) {
      try {
       
        const userId = request.headers['x-user-id'];
        const friendId = request.body;        
        const result = await this.friendshipModel.rejectRequest( userId,friendId);
        
        return result;
      } catch (error) {
        return reply.code(500).send({ error: error.message });
      }
    }
    // Remove friend
    async removeFriend(request, reply) {
      try {
       
        const userId = request.headers['x-user-id'];
        const { id } = request.params;
        
        const result = await this.friendshipModel.removeFriendship(userId, id);
        
        return result;
      } catch (error) {
        return reply.code(500).send({ error: error.message });
      }
    }
    // Change friend status
    async changeFriendStatus(request, reply) {
      try {
        const userId = request.params.userId;
        const { friendId, status } = request.body;
        const result = await this.friendshipModel.changeFriendStatus(userId, friendId, status);
        return result;
      } catch (error) {
        return reply.code(500).send({ error: error.message });
      }
    }
    //  Get status of two friends
    async getStatusOfFriends(request, reply) {
      try {
        const { userId, friendId } = request.params;
        const result = await this.friendshipModel.getStatusOfTwoFriends(userId, friendId);
        return result;
      } catch (error) {
        return reply.code(500).send({ error: error.message });
      }
    }
    async checkFriendshipStatus(request, reply) {
    try {
      const userId = request.headers['x-user-id'];
      const friendId = request.query.friendId;
      
      
      const result = await this.friendshipModel.getStatusOfTwoFriends(userId, friendId);
      
      
      if (!result || !result.status1 || !result.status2) {
        return reply.code(200).send({ areFriends: false });
      }
      
      const areFriends = result.status1.status === 'accepted' && result.status2.status === 'accepted';
      
      return reply.code(200).send({ areFriends });
      
    } catch (error) {
      console.error("Error checking friendship status:", error);
      return reply.code(500).send({ error: error.message });
    }
    }
    async checkPendingRequest(request, reply) {
      try {
        const userId = request.headers['x-user-id'];
        const friendId = request.query.friendId;
        
        const result = await this.friendshipModel.checkpendingRequest(userId, friendId);
        if (!result) {
          return { isPending: false };
        }
        const isPending = result && result.status === 'pending';
        return { isPending };
      } catch (error) {
        return reply.code(500).send({ error: error.message });
      }
    }
    async cancelFriendRequest(request, reply) {
      try {
        const userId = request.headers['x-user-id'];
        const friendId = request.query.friendId;
        
        const result = await this.friendshipModel.cancelFriendRequest(userId, friendId);
        
        return result;
      } catch (error) {
        return reply.code(500).send({ error: error.message });
      }
    }
  }

  export default FriendsController;


 