import { getDatabase } from "../../config/database.js";
export async function addParticipant_post(request, reply) {
    const userid = request.headers['x-user-id'];
    console.log("userid = ", userid);
    const { ownerid, tournamentname, nickname } = request.body;
    const db = await getDatabase();
    const tournament = await db.get('SELECT * FROM tournament WHERE name  = ?', [tournamentname]);
    if (!(Number(tournament.ownerid) === Number(ownerid))) {
        console.log("Forbidden");
        reply.code(403)
            .send("Forbidden")
    }
    if (Number(tournament.maxPlayers) === Number(tournament.currentPlayers)) {
        console.log("Tournament Full");
        reply.code(400)
            .send("Tournament Full")

    }
    const participants = await db.all(
        "SELECT * FROM participant WHERE tournamentId = ? AND userid = ?",
        [tournament.id, userid]
    );
    if (participants) {
        console.log("the user already in tournament ")
        reply.code(400)
            .send("the user already in tournament ")
    }
    try {
        const res = await db.run(
            `INSERT INTO participant (nickname, tournamentid, userid)
                VALUES(?, ?,?)`,
            [nickname, tournament.id, userid]
        );
        reply.code(200)
            .send(res)
    }
    catch (error) {
        console.log(error);
        reply.code(500)
            .send(error)
    }
}

export async function removeParticipant_post(request, reply) {
}
export async function listParticipants_get(request, reply) {
}
export async function countParticipants_get(request, reply) {
}