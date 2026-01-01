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
      await this.db.run(
         'INSERT INTO friendships (user_id, friend_id, status) VALUES (?, ?, ?)',
        [friendId, userId, 'pending']
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
      await this.db.run(
        `UPDATE friendships 
         SET status = 'accepted', accepted_at = CURRENT_TIMESTAMP 
         WHERE user_id = ? AND friend_id = ? AND status = 'pending'`,
        [friendId,userId]
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
        f.accepted_at, f.status
      FROM friendships f
      JOIN users u ON 
        f.user_id = ? AND u.id = f.friend_id
      WHERE  f.status = 'accepted' OR f.status = 'blocked'
      ORDER BY u.online_status DESC, u.display_name ASC`,
      [userId]
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
     const result = await this.db.run(
        `UPDATE friendships 
         SET status = ? 
         WHERE (user_id = ? AND friend_id = ?)`,
        [status, userId, friendId]
      );
  
      if (result.changes === 0) {
        throw new Error('No friendship found to update');
      }
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
    async checkpendingRequest(userId, friendId) {
      const request = await this.db.get(
        `SELECT status FROM friendships 
         WHERE user_id = ? AND friend_id = ? `,
        [friendId, userId]
      );
      return request;
    }

    async cancelFriendRequest(userId, friendId) {
      const result = await this.db.run(
        `DELETE FROM friendships 
         WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?) AND status = 'pending'`,
        [userId, friendId, friendId, userId]
      );
      
      if (result.changes === 0) {
        throw new Error('No pending friendship request found to cancel');
      }
      return { success: true, message: 'Friend request cancelled' };
    }

  }

export default Friendship;