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
            return reply.code(404).send({
                success: false,
                message: "User does not exist!",
            });
        }
        const nickname = existingUser.data.display_name;
        const { tournamentname, maxPlayers } = request.body;
        const db = getDatabase();
        console.log(nickname, userid, tournamentname, maxPlayers);
        const tournament = await db.get('SELECT * FROM tournament WHERE name  = ?', [tournamentname]);
        if (tournament) {
            console.log("Tournament Exist");
            return reply.code(409)
                .send({
                    success: false,
                    message: "Tournament Already Exists"
                });
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
    }
    catch (error) {
        console.log(error);
        return reply.code(500)
            .send({ success: false, message: error.message });
    }
    return reply.code(200)
        .send({ success: true, message: "Tournament Created" });
}
export async function joinTournament_post(request, reply) {
    const userid = request.headers['x-user-id'];
    const username = request.headers['x-user'];
    const { tournamentName } = request.body;
    const existingUser = await axios.get(
        "http://user-management:3000/profile/User",
        {
            params: {
                username,
            },
        }
    );
    const db = await getDatabase();
    const nickname = existingUser.data.display_name;
    const tournament = await db.get('SELECT * FROM tournament WHERE name  = ?', [tournamentName]);
    if (!tournament) {
        console.log("Tournament Not Found");
        return reply.code(400)
            .send({ message: "Tournament Not Found" });
    }
    if (Number(tournament.currentPlayers) >= Number(tournament.maxPlayers)) {
        return reply.code(409)
            .send({ message: "Tournament is full" });
    }
    const participants = await db.all(
        "SELECT * FROM participant WHERE tournamentId = ?",
        [tournament.id]
    );
    for (let i = 0; i < tournament.currentPlayers; i++) {
        if (String(participants[i].userid) === String(userid)) {
            return reply.code(400)
                .send({ message: "User already In Tournament " })
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
        const tournamentUpdated = await db.get('SELECT * FROM tournament WHERE name  = ?', [tournamentName]);
        if (Number(tournamentUpdated.currentPlayers) === Number(tournamentUpdated.maxPlayers)) {
            await db.run(
                "UPDATE tournament SET status = 'full' WHERE id = ?",
                [tournament.id]
            );
            console.log("==== Tournament Full ====", tournamentUpdated);
            return reply.code(200).send({ message: "Tournament Full", tournament: tournamentUpdated });

        }
    }
    catch (error) {
        return reply.code(400)
            .send({ message: error.message })
    }
    return reply.code(200)
        .send({ message: "User Added" })
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
    const tournamentName = request.query.tournamentName;
    const db = await getDatabase();
    const tournament = await db.get('SELECT * FROM tournament WHERE name  = ?', [tournamentName]);
    if (!tournament) {
        console.log("Tournament Not Found");
        return reply.code(404)
            .send("Tournament Not Found")
    }
    return reply.code(200)
        .send(tournament)
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


export async function listTournaments_get(request, reply) {
    const db = await getDatabase();
    try {
        const tournaments = await db.all('SELECT * FROM tournament');
        return reply.code(200).send({ success: true, tournaments });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ success: false, message: error.message });
    }
}



export async function matchmaking_get(request, reply) {
    const { tournamentName } = request.query;
    try {

        console.log("we have to matchmaking the participants of tournament:", tournamentName);
        const db = await getDatabase();
        const tournament = await db.get('SELECT * FROM tournament WHERE name = ?', [tournamentName]);

        if (!tournament) {
            console.log("Tournament Not Found");
            return reply.code(400).send({ message: "Tournament Not Found" });
        }

        const participants = await db.all(
            "SELECT * FROM participant WHERE tournamentId = ?",
            [tournament.id]
        );

        if (participants.length < 2) {
            return reply.code(400).send({ message: "Not enough participants for matchmaking" });
        }

        // Get statistics for each participant
        const participantStats = [
            {
                participant: participants[0],
                stats: { wins: 10, losses: 2 }
            },
            {
                participant: participants[1],
                stats: { wins: 3, losses: 7 }
            },
            {
                participant: participants[2],
                stats: { wins: 6, losses: 4 }
            },
            {
                participant: participants[3],
                stats: { wins: 8, losses: 1 }
            }
        ];

        participantStats.sort((a, b) => {
            const aWinRate = a.stats.wins / (a.stats.wins + a.stats.losses || 1);
            const bWinRate = b.stats.wins / (b.stats.wins + b.stats.losses || 1);
            return bWinRate - aWinRate;
        });
        const matches = [];
        for (let i = 0; i < participantStats.length - 1; i += 2) {
            matches.push({
                player1: participantStats[i].participant,
                player1Stats: participantStats[i].stats,
                player2: participantStats[i + 1].participant,
                player2Stats: participantStats[i + 1].stats,
                tournamentId: tournament.id
            });
        }
        if (participantStats.length % 2 !== 0) {
            matches.push({
                player1: participantStats[participantStats.length - 1].participant,
                player1Stats: participantStats[participantStats.length - 1].stats,
                player2Stats: null,
                tournamentId: tournament.id
            });
        }
        console.log("Matchmaking result:", matches);
        return reply.send({
            tournament: tournament.name,
            matches
        });
    }
    catch (error) {
        console.log("Error during matchmaking:", error);
        return reply.code(500).send({ message: "Internal Server Error" });
    }
}