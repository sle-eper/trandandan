import Database from 'better-sqlite3';

const db = new Database('./src/db/database.db');


db.prepare(`
    CREATE TABLE IF NOT EXISTS msg (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    send INTEGER NOT NULL,
    recv INTEGER NOT NULL,
    msg TEXT NOT NULL,
    room TEXT NOT NULL,
    status TEXT NOT NULL,
    send_at DATETIME DEFAULT (datetime('now', 'localtime'))
    )
    `).run();

export function saveMsg(send:string,recv:string,msg:string,room:string,status:string):string
{
    const msgData = db.prepare(`INSERT INTO msg(send,recv,msg,room,status) VALUES (?,?,?,?,?)`).run(send,recv,msg,room,status)
    const msgId = String(msgData.lastInsertRowid)
    console.log(msgId)
    return msgId
}
export function getTimeOfMsg(msgId:string):string
{
    const time:any = db.prepare(`SELECT strftime('%H:%M', send_at) AS time FROM msg WHERE id = ?`).get(msgId)
    return String(time.time)
}
export function getWaitingMsg(recv:string)
{
    return db.prepare(`SELECT id,msg,room,strftime('%H:%M', send_at) FROM msg WHERE recv = ? AND status = ?`).all(recv,'waiting');
}

export function getAllMsg(roomName:string,limit: number = 20, offset: number = 0)
{
    return db.prepare(`SELECT id,send,recv,msg,status,strftime('%H:%M', send_at) AS time FROM msg WHERE room = ? ORDER BY send_at DESC LIMIT ? OFFSET ?`).all(roomName,limit,offset);
}

export function changeAllToRecv(id:string,roomName:string)
{
    db.prepare(`UPDATE msg SET status = 'send' WHERE room = ? AND recv = ? AND status = 'waiting' `).run(roomName,id)
}
export function changeToRecv(id:string)
{
    db.prepare(`UPDATE msg SET status = ? WHERE id = ?`).run('send',id)
}

export function dataOfUser(id:string):any
{
    return db.prepare(`SELECT * FROM users WHERE id = ? `).get(id)
}
export { db };