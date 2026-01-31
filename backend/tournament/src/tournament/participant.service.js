import { getDatabase } from "../../config/database.js";
import axios from "axios";

export async function addParticipant_post(request, reply) {
    const { tournamentName, userId } = request.body;
    const db = await getDatabase();
    const tournament = await db.get('SELECT * FROM tournament WHERE name  = ?', [tournamentName]);
    try {
        const row = await axios.get(
            `http://user-management:3000/user/${userId}`,
            {
            }
        );
        if (Number(tournament.maxPlayers) === Number(tournament.currentPlayers)) {
            return reply.code(400)
                .send({ message: "Tournament Full" })

        }
        const participants = await db.all(
            "SELECT * FROM participant WHERE tournamentId = ? AND userId = ?",
            [tournament.id, userId]
        );
        if (participants.length > 0) {
            return reply.code(400)
                .send("the user already in tournament ")
        }
        const res = await db.run(
            `INSERT INTO participant (nickname, tournamentid, userid)
                VALUES(?, ?,?)`,
            [row.data.user.display_name, tournament.id, userId]
        );
        await db.run(
            "UPDATE tournament SET currentPlayers = currentPlayers + 1 WHERE id = ?",
            [tournament.id]
        );
        const re = await db.get('SELECT * FROM tournament WHERE name  = ?', [tournamentName]);
        if (Number(re.currentPlayers) === Number(re.maxPlayers)) {
            await db.run(
                "UPDATE tournament SET status = 'full' WHERE id = ?",
                [tournament.id]
            );
            return reply.code(200).send({ message: "Tournament Full" })
        }
        return reply.code(200)
            .send(res)
    }
    catch (error) {
        return reply.code(500)
            .send(error)
    }
}

export async function removeParticipant_post(request, reply) {
    const ownerid = request.headers['x-user-id'];
    const { tournamentname, userid } = request.body;
    const db = await getDatabase();
    const tournament = await db.get('SELECT * FROM tournament WHERE name  = ?', [tournamentname]);
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
            return reply.code(500)
                .send(error)
        }

    }
    return reply.code(400)
        .send("the user not in the tournament ")
}
export async function listParticipants_get(request, reply) {
    try {
        const ownerid = request.headers['x-user-id'];
        const { tournamentName } = request.query;
        const db = await getDatabase();
        const tournament = await db.get('SELECT * FROM tournament WHERE name  = ?', [tournamentName]);
        if (!tournament) {
            return reply.code(404)
            .send("Not Found")
        }
        const participants = await db.all(
            "SELECT * FROM participant WHERE tournamentId = ?",
            [tournament.id]
        );
        return reply.code(200)
            .send(participants)
    }
    catch (error) {
        return reply.code(500)
    }
}


export async function getMyStatus_get(request, reply) {
    const userid = request.headers['x-user-id'];
    const { tournamentName } = request.query;
    const db = await getDatabase();
    try {
        const tournament = await db.get('SELECT * FROM tournament WHERE name  = ?', [tournamentName]);
        const participants = await db.all(
            "SELECT * FROM participant WHERE tournamentId = ? AND userid = ?",
            [tournament.id, userid]
        );
        for (const participant of participants) {
            if (Number(participant.userid) === Number(userid)) {
                return reply.code(200)
                    .send({ message: "User Found", status: 'true' });

            }
        }
    }
    catch (error) {
        return reply.code(500)
    }

    return reply.code(404)
        .send({ message: "User Not Found", status: 'false' });
}