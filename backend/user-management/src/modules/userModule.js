

class UserModule{

    constructor(db){
        this.db = db;
    }

    async findById(id) {
        return this.db.get(
            'SELECT id, email, username, avatar_url ,display_name ,bio ,online_status FROM users WHERE id = ?',
            id
        );
    }
    async findByUsername(username) {
        return this.db.get(
            'SELECT id, email, username,avatar_url ,display_name ,password_hash,two_factor_enabled,two_factor_secret FROM users WHERE username = ?',
            [username]
        );
    }

    async findByEmail(email) {
        return this.db.get(
            'SELECT id, email, username ,avatar_url ,display_name ,password_hash,two_factor_enabled,two_factor_secret FROM users WHERE email = ?',
            [email]  
        );
    }

    async findByDisplayName(displayName) {
        return await this.db.get(
          'SELECT * FROM users WHERE display_name = ?',
          [displayName]
        );
    }
    async getPasswordHashById(id) {
        const row = await this.db.get(
            'SELECT password_hash FROM users WHERE id = ?',
            [id]
        );
        return row ? row.password_hash : null;
    }

    async updatePassword(userId, newPasswordHash) {
        await this.db.run(
            'UPDATE users SET password_hash = ? WHERE id = ?',
            [newPasswordHash, userId]
        );
    }

    // async isDisplayNameAvailable(displayName){

    // }

    async getProfile(userId) {
        return await this.db.get(
          `SELECT 
            u.id, u.username, u.display_name, u.email, u.avatar_url, u.bio,
            u.online_status, u.created_at,
            s.total_games, s.wins, s.losses, s.win_rate,
            s.tournaments_played, s.tournaments_won, 
            s.best_score, s.ranking
           FROM users u
           LEFT JOIN user_stats s ON u.id = s.user_id
           WHERE u.id = ?`,
          [userId]
        );
    }


    async create(user) {
    const result = await this.db.run(
        'INSERT INTO users (email, username, password_hash, display_name) VALUES (?, ?, ?, ?)',
        [
        user.email,
        user.username,
        user.password,   // ✅ FIX
        user.display_name || user.username
        ]
    );

    await this.db.run(
        'INSERT INTO user_stats (user_id) VALUES (?)',
        [result.lastID]
    );

    return result.lastID;
    }


    async updateProfile(userId, updates) {
        const { displayName, bio, avatarUrl,email,username } = updates;
        
        const fields = [];
        const values = [];
        if (username) {
            fields.push('username = ?');
            values.push(username);
        }
        if (email) {
            fields.push('email = ?');
            values.push(email);
        }

        if (displayName) {
            fields.push('display_name = ?');
            values.push(displayName);
        }

        if (bio !== undefined) {
            fields.push('bio = ?');
            values.push(bio);
        }

        if (avatarUrl) {
            fields.push('avatar_url = ?');
            values.push(avatarUrl);
        }
        
        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(userId);
        
        await this.db.run(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        values
        );
        
        return await this.getProfile(userId);
    }


    async updateOnlineStatus(userId, status) {
        await this.db.run(
          `UPDATE users 
           SET online_status = ?, last_seen = CURRENT_TIMESTAMP 
           WHERE id = ?`,
          [status, userId]
        );
    }

    async findAll() {
        return this.db.all('SELECT * FROM users');
    }

    async delete(id) {
        const result = await this.db.run(
            'DELETE FROM users WHERE id = ?',
            [id]  
        );
        return result.changes;
    }
    async searchByDisplayName(query) {

        if (!query || query.trim() === '') {
          return [];
        }
      
        const searchPattern = `%${query}%`;
      
        return await this.db.all(
          'SELECT id, username, display_name, avatar_url FROM users WHERE display_name LIKE ?',
          [searchPattern]
        );
      }
      // add this methods for 2FA
      async setTwoFactorSecret(userId, secret) {
        console.log("Setting 2FA secret in DB for userId:", userId);
        await this.db.run(
          `UPDATE users 
           SET two_factor_secret = ? WHERE id = ?`,
          [secret, userId]
        );
      }

      async getAllUsers() {
        return await this.db.all(
          'SELECT id, username, display_name, email, online_status FROM users'
        );
    }
}

export default UserModule ;