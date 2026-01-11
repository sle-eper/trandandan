
export const saveGameResult = async (request, reply) => {
    const { user1_id, user2_id, user1_score, user2_score, winner_id, game_mode } = request.body;
    const db = request.server.db;

    try {
        await db.run(
            `INSERT INTO match_history (user1_id, user2_id, user1_score, user2_score, winner_id, game_mode) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [user1_id, user2_id, user1_score, user2_score, winner_id, game_mode]
        );

        // Update user stats
        if (winner_id) {
            await db.run(
                `UPDATE user_stats SET 
                    wins = wins + 1, 
                    total_games = total_games + 1,
                    win_rate = CAST((wins + 1) AS REAL) / (total_games + 1)
                 WHERE user_id = ?`,
                [winner_id]
            );

            const loser_id = (winner_id === user1_id) ? user2_id : user1_id;
            await db.run(
                `UPDATE user_stats SET 
                    losses = losses + 1, 
                    total_games = total_games + 1,
                    win_rate = CAST(wins AS REAL) / (total_games + 1)
                 WHERE user_id = ?`,
                [loser_id]
            );
        }

        return { success: true, message: "Game result saved" };
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
    }
};

export const getMatchHistory = async (request, reply) => {
    const { userId } = request.params;
    const db = request.server.db;

    try {
        const history = await db.all(
            `SELECT * FROM match_history WHERE user1_id = ? OR user2_id = ? ORDER BY played_at DESC`,
            [userId, userId]
        );
        return history;
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
    }
};
