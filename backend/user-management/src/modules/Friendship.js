class Friendship {
    constructor(database) {
      this.db = database;
    }
  
    async sendRequest(userId, friendId) {
      // Check if friendship already exists
      const existing = await this.db.get(
        'SELECT * FROM friendships WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)',
        [userId, friendId, friendId, userId]
      );
      
      if (existing) {
        throw new Error('Friendship request already exists');
      }
      
      await this.db.run(
        'INSERT INTO friendships (user_id, friend_id, status) VALUES (?, ?, ?)',
        [userId, friendId, 'pending']
      );
      
      return { success: true, message: 'Friend request sent' };
    }
  
    // Accept friend request
    async acceptRequest(userId, friendId) {
      await this.db.run(
        `UPDATE friendships 
         SET status = 'accepted', accepted_at = CURRENT_TIMESTAMP 
         WHERE user_id = ? AND friend_id = ? AND status = 'pending'`,
        [userId,friendId]
      );
      
      return { success: true, message: 'Friend request accepted' };
    }
  
    // Remove friendship
    async removeFriendship(userId, friendId) {
      await this.db.run(
        `DELETE FROM friendships 
         WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
        [userId, friendId, friendId, userId]
      );
      
      return { success: true, message: 'Friendship removed' };
    }
  
    // Get friends list with online status
    async getFriends(userId) {
      return await this.db.all(
        `SELECT 
          u.id, u.username, u.display_name, u.avatar_url, 
          u.online_status, u.last_seen,
          f.accepted_at
         FROM friendships f
         JOIN users u ON (
           CASE 
             WHEN f.user_id = ? THEN u.id = f.friend_id
             ELSE u.id = f.user_id
           END
         )
         WHERE (f.user_id = ? OR f.friend_id = ?) AND f.status = 'accepted'
         ORDER BY u.online_status DESC, u.display_name ASC`,
        [userId, userId, userId]
      );
    }
  
    // Get pending friend requests
    async getPendingRequests(userId) {
      return await this.db.all(
        `SELECT 
          u.id, u.username, u.display_name, u.avatar_url,
          f.requested_at
         FROM friendships f
         JOIN users u ON u.id = f.user_id
         WHERE f.friend_id = ? AND f.status = 'pending'
         ORDER BY f.requested_at DESC`,
        [userId]
      );
    }




    // Change friend status (e.g., block, unblock)
    async changeFriendStatus(userId, friendId, status) {
      await this.db.run(
        `UPDATE friendships 
         SET status = ? 
         WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
        [status, userId, friendId, friendId, userId]
      );
      return { success: true, message: 'Friend status updated' };
    }
  

    // Get status of two friends
    async getStatusOfTwoFriends(myId, friendId) {
      const status1 = await this.db.get(
        `SELECT status FROM friendships WHERE user_id = ? AND friend_id = ? `,
        [myId, friendId]
      );
      const status2 = await this.db.get(
        `SELECT status FROM friendships WHERE user_id = ? AND friend_id = ? `,
        [friendId, myId]
      );
      return { status1, status2 };
    } 


    // Check if users are friends
    // async areFriends(userId, friendId) {
    //   const friendship = await this.db.get(
    //     `SELECT * FROM friendships 
    //      WHERE ((user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?))
    //      AND status = 'accepted'`,
    //     [userId, friendId, friendId, userId]
    //   );
      
    //   return !!friendship;
    // }
  }

export default Friendship;