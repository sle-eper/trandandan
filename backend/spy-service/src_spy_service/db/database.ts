import Database from 'better-sqlite3';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);//full path ......./.ts
const __dirname = path.dirname(__filename);//dr of file 

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);


db.prepare(`
    CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        role TEXT NOT NULL,          
        result TEXT NOT NULL,  
        match_date DATETIME DEFAULT (datetime('now', 'localtime'))
    );
    `).run();



export function addHistory(user_id:number,role:string,result:string){
    db.prepare('INSERT INTO history(user_id,role,result) VALUES(?,?,?)').run(user_id,role,result)
}

export function getHistory(user_id:number){
    const stats = db.prepare(`
        SELECT
            COUNT(*) AS totalMatches,
            SUM(CASE WHEN role = 'spy' THEN 1 ELSE 0 END) AS spyCount,
            SUM(CASE WHEN role = 'investigator' THEN 1 ELSE 0 END) AS investigatorCount,
            SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) AS winCount,
            SUM(CASE WHEN result = 'lose' THEN 1 ELSE 0 END) AS loseCount
        FROM history
        WHERE user_id = ?
        `).get(user_id);
    return stats;
    // console.log(stats);
}