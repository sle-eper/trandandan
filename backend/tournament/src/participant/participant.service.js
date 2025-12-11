import { getDatabase } from "../../config/database.js";
export async function addParticipant(data) {
    const { userid, ownerid, tournamentid, nickname } = data;
    const db = await getDatabase();
    const tournament = await db.get('SELECT * FROM tournament WHERE id  = ?', [tournamentid]);
    if (!(Number(tournament.ownerid) === Number(ownerid))) {
        console.log("Forbidden");
        return "403";
    }
    if (Number(tournament.maxPlayers) === Number(tournament.currentPlayers)) {
        console.log("Tournament Full");
        return ("400");

    }
    const participants = await db.all(
        "SELECT * FROM participant WHERE tournamentId = ? AND userid = ?",
        [tournament.id, userid]
    );
    if (participants)
    {
        console.log("the user already in tournament ")
        return ("400")
    }
    try {
        const res = await db.run(
            `INSERT INTO participant (nickname, tournamentid, userid)
                VALUES(?, ?,?)`,
            [nickname, tournament.id, userid]
        );
        return res
    }
    catch (error) {
        console.log(error);
        return (error);
    }
}
export async function removeParticipant(userId, tournamentId) {
}

export async function listParticipants(tournamentId) {
}

export async function countParticipants(tournamentId) {
}
