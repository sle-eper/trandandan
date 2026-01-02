import { getDatabase } from "../../config/database.js";
export async function addParticipant_post(request, reply) {
    const ownerid = request.headers['x-user-id'];
    const {tournamentname, nickname , userid} = request.body;
    const db = await getDatabase();
    const tournament = await db.get('SELECT * FROM tournament WHERE name  = ?', [tournamentname]);
    if (!(Number(tournament.ownerid) === Number(ownerid))) {
        console.log("Forbidden");
        return reply.code(403)
        .send("Forbidden")
    }
    if (Number(tournament.maxPlayers) === Number(tournament.currentPlayers)) 
    {
        console.log("Tournament Full");
        return reply.code(400)
        .send("Tournament Full")
        
    }
    const participants = await db.all(
        "SELECT * FROM participant WHERE tournamentId = ? AND userid = ?",
        [tournament.id, userid]
    );
    if (participants.length > 0) {
        console.log("the user already in tournament ")
        return  reply.code(400)
            .send("the user already in tournament ")
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
        return reply.code(200)
            .send(res)
    }
    catch (error) {
        console.log(error);
        return reply.code(500)
            .send(error)
    }
}

export async function removeParticipant_post(request, reply) {
    const ownerid = request.headers['x-user-id'];
    const {tournamentname, userid} = request.body;
    const db = await getDatabase();
    const tournament = await db.get('SELECT * FROM tournament WHERE name  = ?', [tournamentname]);
    if (!(Number(tournament.ownerid) === Number(ownerid))) {
        console.log("Forbidden");
        return reply.code(403)
        .send("Forbidden")
    }
    const participants = await db.all(
        "SELECT * FROM participant WHERE tournamentId = ? AND userid = ?",
        [tournament.id, userid]
    );
    if (participants.length > 0) {
        try {
            await db.run(
                    "DELETE FROM participant WHERE userid = ?",
                    [userid]
                );
            await db.run(
                "UPDATE tournament SET currentPlayers = currentPlayers - 1 WHERE id = ?",
                [tournament.id]
            );
            return reply.code(200)
                .send("the user is deleted")
        }
        catch (error) {
            console.log(error);
            return reply.code(500)
                .send(error)
        }
           
    }
    return reply .code(400)
    .send("the user not in the tournament ")
}
export async function listParticipants_get(request, reply) {
     const ownerid = request.headers['x-user-id'];
    const {tournamentname} = request.query;
    const db = await getDatabase();
    const tournament = await db.get('SELECT * FROM tournament WHERE name  = ?', [tournamentname]);
    if (!(Number(tournament.ownerid) === Number(ownerid))) {
        console.log("Forbidden");
        return reply.code(403)
        .send("Forbidden")
    }
    const participants = await db.all(
        "SELECT * FROM participant WHERE tournamentId = ?",
        [tournament.id]
    );
    return reply.code(200)
    .send(participants)
}