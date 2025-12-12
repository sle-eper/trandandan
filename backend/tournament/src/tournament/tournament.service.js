import { getDatabase } from "../../config/database.js";

export async function createTournament_post(request, reply) {
    const userid = request.headers['x-user-id'];
    const { nickname, tournamentname, maxPlayers } = request.body;
    const db = getDatabase();
    console.log(nickname, userid, tournamentname, maxPlayers);
    const tournament = await db.get('SELECT * FROM tournament WHERE name  = ?', [tournamentname]);
    if (tournament) {
        console.log("Tournament Exist");
        return reply.code(400)
            .send("Tournament Already Existe")
    }
    try {
        const result = await db.run(
            `INSERT INTO tournament (name, ownerId, maxPlayers)
                VALUES (?, ?, ?)`,
            [tournamentname, userid, maxPlayers]
        );
        const res = await db.run(
            `INSERT INTO participant (nickname, tournamentid, userid)
                VALUES(?, ?,?)`,
            [nickname, result.lastID, userid]
        );
    }
    catch (error) {
        console.log(error);
        return reply.code(404)
            .send(error)
    }
    return reply.code(200)
        .send("Tournament Created")
}
export async function joinTournament_post(request, reply) {
    const userid = request.headers['x-user-id'];
    const { nickname, tournamentname } = request.body;
    console.log("===============", tournamentname, nickname)
    const db = await getDatabase();
    const tournament = await db.get('SELECT * FROM tournament WHERE name  = ?', [tournamentname]);
    if (!tournament) {
        console.log("Tournament Not Found");
        reply.code(400)
            .send("Tournament Not Found")
    }
    if (Number(tournament.currentPlayers) >= Number(tournament.maxPlayers)) {
        reply.code(400)
            .send("Tournament is full");
    }
    const participants = await db.all(
        "SELECT * FROM participant WHERE tournamentId = ?",
        [tournament.id]
    );
    for (let i = 0; i < tournament.currentPlayers; i++) {
        if (String(participants[i].userid) === String(userid)) {
            reply.code(400)
                .send("User already In Tournament ")
        }
    }
    try {
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
    catch (error) {
        reply.code(400)
            .send(error)
    }
    reply.code(200)
        .send("User Added")
}

export async function leaveTournament_get(request, reply) {
    const userid = request.headers['x-user-id'];
    const { tournamentid } = request.query;
    const db = await getDatabase();
    const tournament = await db.get('SELECT * FROM tournament WHERE id  = ?', [tournamentid]);
    if (!tournament) {
        console.log("Tournament Not Found");
        return reply.code(400)
            .send("Tournament Not Found")
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
            await db.run(
                "UPDATE tournament SET currentPlayers = currentPlayers - 1 WHERE id = ?",
                [tournament.id]
            );
            const result = await db.get('SELECT * FROM tournament WHERE id  = ?', [tournamentid]);
            if (Number(result.currentPlayers) === Number(0))
            {
                await db.run(
                "DELETE FROM tournament WHERE id = ?",
                [result.id]
            );
            }
            return reply.code(200)
                .send("User Deleted")

        }
    }

    return reply.code(400)
        .send("User Not Found")
}
export async function checkTournament_get(request, reply) {
    const tournamentid = request.query.tournamentid;
    const db = await getDatabase();
    const tournament = await db.get('SELECT * FROM tournament WHERE id  = ?', [tournamentid]);
    if (!tournament) {
        console.log("Tournament Not Found");
        reply.code(404)
            .send("Tournament Not Found")
    }
    reply.code(200)
        .send(tournament)
}
