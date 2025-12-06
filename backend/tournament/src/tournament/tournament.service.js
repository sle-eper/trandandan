import { getDatabase } from "../../config/database.js";

export async function createTournament(data) {
    const { nickname, userid, name, maxPlayers } = data;
    const db = getDatabase();
    try {

        const result = await db.run(
            `INSERT INTO tournament (name, ownerId, maxPlayers)
            VALUES (?, ?, ?)`,
            [name, userid, maxPlayers]
        );
        const res = await db.run(
            `INSERT INTO participant (nickname, tournamentid, userid)
            VALUES(?, ?,?)`,
            [nickname, result.lastID, userid]
        );
        return {
            id: result.lastID,
            name,
            userid,
            maxPlayers: maxPlayers,
            currentPlayers: 1,
        };
    }
    catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
}

export async function joinTournament(data) {
    const { nickname, userid, name} = data;

    const db = await getDatabase();
    const tournament = await db.get('SELECT * FROM tournament WHERE name  = ?', [name]);
    const res = await db.run(
            `INSERT INTO participant (nickname, tournamentid, userid)
            VALUES(?, ?,?)`,
            [nickname, tournament.id, userid]
        );
    console.log("userid ", userid);
    console.log("tournament====", tournament);
}

export async function leaveTournament(userId, tournamentId) {
}

export async function checkTournament(tournamentId) {
}

export async function changeTournament(tournamentId, updates) {
}
