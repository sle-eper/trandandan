import { getDatabase } from "../../config/database.js";

export async function createTournament(data) {
    const { nickname, userid, name, maxPlayers } = data;
    const db = getDatabase();
    const tournament = await db.get('SELECT * FROM tournament WHERE name  = ?', [name]);
    if (tournament) {
        console.log("Tournament Exist");
        return { message: "Soumaya" };
    }
    console.log(nickname, userid, name, maxPlayers);
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
        console.log(error);
        return { message: error }
    }
}

export async function joinTournament(data) {
    const { nickname, userid, name } = data;

    const db = await getDatabase();
    const tournament = await db.get('SELECT * FROM tournament WHERE name  = ?', [name]);
    if (!tournament) {
        console.log("Tournament Not Found");
        return { message: "Soumaya" };
    }
    if (Number(tournament.currentPlayers) >= Number(tournament.maxPlayers)) {
        return { message: "Tournament is full" };
    }
    const participants = await db.all(
        "SELECT * FROM participant WHERE tournamentId = ?",
        [tournament.id]
    );
    for (let i = 0; i < tournament.currentPlayers; i++) {
        if (String(participants[i].userid) === String(userid)) {
            return { message: "User Already joined" };
        }
    }
    const res = await db.run(
        `INSERT INTO participant (nickname, tournamentid, userid)
            VALUES(?, ?,?)`,
        [nickname, tournament.id, userid]
    );
    await db.run(
        "UPDATE tournament SET currentPlayers = currentPlayers + 1 WHERE id = ?",
        [tournament.id]
    );
}

export async function leaveTournament(data) {
    console.log(data);
    const { userid, tournamentid } = data;
    const db = await getDatabase();
    const tournament = await db.get('SELECT * FROM tournament WHERE id  = ?', [tournamentid]);
    if (!tournament) {
        console.log("Tournament Not Found");
        return { message: "Tournament Not Found" };
    }
    const participants = await db.all(
        "SELECT * FROM participant WHERE tournamentId = ?",
        [tournament.id]
    );
    for (let i = 0; i < tournament.currentPlayers; i++) {
        if (String(participants[i].userid) === String(userid)) {
            await db.run(
                "DELETE FROM participant WHERE userid = ?",
                [userid]
            );
            return {message:"the User is Deleted"}
        }
    }
    return {message :"Participant Not Found"}
}

export async function checkTournament(tournamentId) {

}

export async function changeTournament(tournamentId, updates) {

}
