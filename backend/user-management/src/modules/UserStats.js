class UserStats {
  constructor(database) {
    this.db = database;
  }

  // Update stats after game
  async updateAfterGame(userId, won, gameType = 'casual') {
    const stats = await this.db.get(
      'SELECT * FROM user_stats WHERE user_id = ?',
      [userId]
    );

    const totalGames = stats.total_games + 1;
    const wins = won ? stats.wins + 1 : stats.wins;
    const losses = won ? stats.losses : stats.losses + 1;
    // add best score later 
    const winRate = (wins / totalGames) * 100;

    await this.db.run(
      `UPDATE user_stats 
         SET total_games = ?, wins = ?, losses = ?, win_rate = ?,
            updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?`,
      [totalGames, wins, losses, winRate, userId]
    );
  }

  // Get leaderboard
  async getLeaderboard(limit = 10) {
    return await this.db.all(
      `SELECT 
          u.id, u.display_name, u.avatar_url,
          s.wins, s.losses, s.win_rate, s.ranking
         FROM user_stats s
         JOIN users u ON u.id = s.user_id
         ORDER BY s.total_points DESC, s.win_rate DESC
         LIMIT ?`,
      [limit]
    );
  }

  async getByUserId(userId) {
    return await this.db.get(
      'SELECT * FROM user_stats WHERE user_id = ?',
      [userId]
    );
  }
}

export default UserStats;
