import Friendship from '../modules/Friendship.js';

class FriendsController {
    constructor(database) {
      this.friendshipModel = new Friendship(database);
    }
  
    // GET /friends - Get friends list
    async getFriends(request, reply) {
      try {
        // console.log("---------------", request);
        // const userId = request.headers['x-user-id'];
        const userId = request.params.id;
        const friends = await this.friendshipModel.getFriends(userId);
        return { success: true, friends };
      } catch (error) {
        return reply.code(500).send({ error: error.message });
      }
    }
  
    // POST /friends/request - Send friend request
    async sendRequest(request, reply) {
      try {
      
        const userId = request.headers['x-user-id'];
        const { friendId } = request.body;
        console.log("sendRequest called with userId:", userId, "friendId:", friendId);
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
       
        // const userId = request.user.userId;
        const userId = request.headers['x-user-id'];
        
        const { friendId } = request.body;
        
        const result = await this.friendshipModel.acceptRequest( userId,friendId);
        
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

    // PUT /friends/status - Change friend status
    async changeFriendStatus(request, reply) {
      try {
        const userId = request.params.userId;
        const { friendId, status } = request.body;
        const result = await this.friendshipModel.changeFriendStatus(userId, friendId, status);
        console.log("changeFriendStatus result:", result);
        return result;
      } catch (error) {
        return reply.code(500).send({ error: error.message });
      }
    }

    // GET /friendships/status - Get status of two friends
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
    
    console.log("Checking friendship status between userId:", userId, "and friendId:", friendId);
    
    const result = await this.friendshipModel.getStatusOfTwoFriends(userId, friendId);
    
    
    if (!result || !result.status1 || !result.status2) {
      console.log("No friendship record found");
      return reply.code(200).send({ areFriends: false });
    }
    
    console.log("Friendship statuses:", result);
    const areFriends = result.status1.status === 'accepted' && result.status2.status === 'accepted';
    
    console.log("areFriends:", areFriends);
    
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
        console.log("checkPendingRequest result:", result);
        const isPending = result && result.status === 'pending';
         console.log("isPending:", isPending);
        return { isPending };
      } catch (error) {
        return reply.code(500).send({ error: error.message });
      }
    }
  }

  export default FriendsController;