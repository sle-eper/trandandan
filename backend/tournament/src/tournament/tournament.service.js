import { getDatabase } from "../../config/database.js";
import axios from "axios";

export async function createTournament_post(request, reply) {
    const userid = request.headers['x-user-id'];
    const username = request.headers['x-user'];
    try {
    const existingUser = await axios.get(
          "http://user-management:3000/profile/User",
          {
            params: {
              username,
            },
          }
        );
    if (!existingUser.data) {
        return reply.code(400).send({
          success: false,
          message: "User does not exist!",
        });
    }
    const nickname = existingUser.data.display_name;
    const {tournamentname, maxPlayers} = request.body;
    const db = getDatabase();
    console.log(nickname, userid, tournamentname, maxPlayers);
    const tournament = await db.get('SELECT * FROM tournament WHERE name  = ?', [tournamentname]);
    if (tournament) {
        console.log("Tournament Exist");
        return reply.code(400)
            .send("Tournament Already Existe")
    }
    
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
        // await axios.post("http://chat-service:3000/notify", {
        //     userids : [userid],
        //     type: "tournamentcreat",
        //     data: { tournamentId: result.lastID, room: tournamentname }
        // });
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
        reply.code(409)
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
            if (Number(result.currentPlayers) === Number(0)) {
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
    if (Number(tournament.currentPlayers) === Number(tournament.maxPlayers)) {
        await db.run(
            "UPDATE tournament SET status = ? WHERE id = ?",
            ["started", tournament.id]
        );
        console.log("the tournament will start now")
    }
    const res = await db.get('SELECT * FROM tournament WHERE id  = ?', [tournamentid]);
    reply.code(200)
        .send(res)
}


export async function startTournament_post(request, reply) {
    const ownerid = request.headers['x-user-id'];
    const { tournamentname } = request.body;
    const db = await getDatabase();

    const tournament = await db.get('SELECT * FROM tournament WHERE name = ?', [tournamentname]);
    if (!tournament) {
        console.log("Tournament Not Found");
        return reply.code(400).send("Tournament Not Found");
    }
    const participants = await db.all(
        "SELECT * FROM participant WHERE tournamentId = ?",
        [tournament.id]
    );

    const userIds = participants.map(p => p.userid);

    try {
        const res = await fetch("http://chat-service:3000/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userIds,
                type: "TOURNAMENT_START",
                data: { tournamentId: tournament.id, tournamentName: tournament.name }
            })
        });

        // Important: consume response to avoid hanging
        const data = await res.text();
        console.log("Notify response:", data);
    } catch (err) {
        console.error("Error notifying chat service:", err);
    }
    return reply.code(200).send({ message: "Tournament started" });
}