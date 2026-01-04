import Database from 'better-sqlite3';
import { fetchUserData } from '../fetchingData';
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

// db.prepare(`DROP TABLE IF EXISTS notification`).run();


db.prepare(`
    CREATE TABLE IF NOT EXISTS notification (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    send INTEGER NOT NULL,
    recv INTEGER NOT NULL,
    type TEXT NOT NULL,
    content TEXT
    )
    `).run();

export function saveNotif(send:string,recv:string,type:string,content:string)
{
    try{
        if(!send||!recv||!type)
            throw new Error("Invalid data in getNotif");
        db.prepare(`INSERT INTO notification(send,recv,type,content) VALUES(?,?,?,?)`).run(send,recv,type,content);
    }catch(err)
    {
        console.error("DB saveNotif error:", err);
        throw new Error("Failed to save notification");
    }
}
export async function getNotif(id: string) {
    try{
        if(!id)
            throw new Error("Invalid data in getNotif");
        const notifs = db
            .prepare(`SELECT * FROM notification WHERE recv = ?`)
            .all(id);
    
        const result = [];
    
        for (const notif of notifs) {
            try{
                const users = await fetchUserData(String(notif.send));
                result.push({...notif,sender_name: users.user.username });
            }catch{
                result.push({...notif,sender_name: "Unknown user" });
            }
        }
        // console.log(result);
        return result;
    }catch(err)
    {
        console.error("getNotif error:", err);
        return [];
    }
}

export function saveMsg(send:string,recv:string,msg:string,room:string,status:string):string
{
    try{
        if(!send || !recv || !msg || !room || !status)
            throw new Error("Invalid data in saveMsg");
        const msgData = db.prepare(`INSERT INTO msg(send,recv,msg,room,status) VALUES (?,?,?,?,?)`).run(send,recv,msg,room,status)
        const msgId = String(msgData.lastInsertRowid)
        // console.log(msgId)
        return msgId
    }catch(err)
    {
        console.error("saveMsg error:", err);
        throw new Error("Failed to saveMsg");
    }
}
export function getTimeOfMsg(msgId:string):string
{
    try{
        if(!msgId)
            throw new Error("Invalid data in getTimeOfMsg");
        const time:any = db.prepare(`SELECT strftime('%H:%M', send_at) AS time FROM msg WHERE id = ?`).get(msgId)
        return String(time.time)
    }catch(err)
    {
        console.error("getTimeOfMsg error:", err);
        throw new Error("Failed to getTimeOfMsg");
    }
}
export function getWaitingMsg(recv:string)
{
    try{
         if(!recv)
            throw new Error("Invalid data in getWaitingMsg");
        return db.prepare(`SELECT id,msg,room,strftime('%H:%M', send_at) FROM msg WHERE recv = ? AND status = ?`).all(recv,'waiting');
    }catch(err)
    {
        console.error("getWaitingMsg error:", err);
        throw new Error("Failed to getWaitingMsg");
    }
}

export function getAllMsg(roomName:string,limit: number = 20, offset: number = 0)
{
    try{
        if(!roomName || limit < 1 || offset < 0)
            throw new Error("Invalid data in getAllMsg");
        return db.prepare(`SELECT id,send,recv,msg,status,strftime('%H:%M', send_at) AS time FROM msg WHERE room = ? ORDER BY send_at DESC LIMIT ? OFFSET ?`).all(roomName,limit,offset);
    }catch(err){
        console.error("getAllMsg error:", err);
        throw new Error("Failed to getAllMsg");
    }
}

export function changeAllToRecv(id:string,roomName:string)
{
    try{
        if(!id || !roomName)
            throw new Error("Invalid data in changeAllToRecv");
        db.prepare(`UPDATE msg SET status = 'send' WHERE room = ? AND recv = ? AND status = 'waiting' `).run(roomName,id)
    }catch(err)
    {
        console.error("changeAllToRecv error:", err);
        throw new Error("Failed to changeAllToRecv");
    }
}
export function changeToRecv(id:string)
{
    try{
        if(!id)
            throw new Error("Invalid data in changeToRecv");
        db.prepare(`UPDATE msg SET status = ? WHERE id = ?`).run('send',id)
    }catch(err)
    {
        console.error("changeToRecv error:", err);
        throw new Error("Failed to changeToRecv");
    }
}

export function dataOfUser(id:string):any
{
    try{
        if(!id)
            throw new Error("Invalid data in dataOfUser");
        return db.prepare(`SELECT * FROM users WHERE id = ? `).get(id)
    }catch(err)
    {
        console.error("dataOfUser error:", err);
        throw new Error("Failed to dataOfUser");
    }
}


export  function checkExistingNotification(senderId: string, receiverId: string, type: string,status: string): boolean {
  try {
     const result =  db.prepare(
    `SELECT id FROM notifications 
     WHERE send = $1 
     AND recv = $2 
     AND type = $3 
     AND content = $4`,
    [senderId, receiverId, type, status]
  ).all();
  return result.length > 0;
  }
    catch (error) {
    console.error("checkExistingNotification error:", error);
    throw new Error("Failed to check existing notification");
  }

}

export function updateNotificationStatus(notifId: string, status: string): void {
  db.prepare(
    `UPDATE notifications SET status = ? WHERE id = ?`
  ).run(status, notifId);
}

export function deleteNotification(notifId: string): void {
  db.prepare(
    `DELETE FROM notifications WHERE id = ?`
  ).run(notifId);
}




export { db };