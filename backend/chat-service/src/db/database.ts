import Database from 'better-sqlite3';
import path from 'path';

// const dbPath = path.join(process.cwd(), 'src', 'db', 'database.db');
const db = new Database('./src/db/database.db');

// db.prepare(`DROP TABLE friendships `).run();
// db.prepare(`DROP TABLE users `).run();
// db.prepare(`DROP TABLE msg `).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    img TEXT)`).run();


db.prepare(`CREATE TABLE IF NOT EXISTS friendships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    friend_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'accepted',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (friend_id) REFERENCES users(id))`).run();


db.prepare(`CREATE TABLE IF NOT EXISTS msg (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    send INTEGER NOT NULL,
    recv INTEGER NOT NULL,
    msg TEXT NOT NULL,
    room TEXT NOT NULL,
    status TEXT NOT NULL,
    send_at DATETIME DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (send) REFERENCES users(id),
    FOREIGN KEY (recv) REFERENCES users(id))`).run();
const insertUsers = db.prepare(`INSERT INTO users (name,img) VALUES (?,?)`)

const users = [
    { name: 'Ayoub', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Sara', img: 'https://randomuser.me/api/portraits/women/45.jpg' },
    { name: 'Omar', img: 'https://randomuser.me/api/portraits/men/67.jpg' },
    { name: 'jamila', img: 'https://randomuser.me/api/portraits/women/88.jpg' },
    { name: 'Youssef', img: 'https://randomuser.me/api/portraits/men/12.jpg' },
];

// users.forEach((user)=>{
//         insertUsers.run(user.name,user.img);
//     })
    
const user:any =  db.prepare(`SELECT id FROM users WHERE id = ?`).get('1');
const friends:any = db.prepare(`SELECT id FROM users WHERE id != ?`).all('1')
const insertFriend = db.prepare(`INSERT INTO friendships (user_id,friend_id) VALUES (?,?)`);
// const update = db.prepare(`UPDATE friendships SET status = ? WHERE user_id = ? AND friend_id = ?`);
// const matchFriends = db.prepare(`SELECT users.id,users.name,users.img FROM users INNER JOIN friendships ON users.id = friendships.friend_id WHERE friendships.user_id = ? `).all(user.id);
    
// for(const f of friends){
//     insertFriend.run(user.id,f.id);
// }
// // for (const u of matchFriends)
// //    console.table(matchFriends);
// // insertFriend.run(user,friends);

// console.log('Table "users" is ready.');


// // const rows = db.prepare('SELECT * FROM users ORDER BY id').all();
// // console.log(rows);
// // process.on('exit', () => db.close());

// update.run('block','1','3')
export function getFriendsOfUser(user_id:string):any{
    // return db.prepare(`SELECT users.id,users.name,users.img,friendships.status FROM users INNER JOIN friendships ON users.id = friendships.friend_id WHERE friendships.user_id = ? `).all(user_id);
    return db.prepare(`SELECT f.id,f.name ,f.img ,fs.status, m.msg , m.send , m.recv , m.status AS msg_status ,m.send_at
                        FROM users AS u
                        JOIN friendships AS fs
                        ON u.id = fs.user_id
                        JOIN users AS f
                        ON f.id = fs.friend_id
                        LEFT JOIN msg AS m 
                        ON m.id = (SELECT id 
                                    FROM msg 
                                    WHERE 
                                    (send = f.id AND recv = u.id)
                                    OR 
                                    (send = u.id AND recv = f.id)
                                    ORDER BY send_at DESC
                                    LIMIT 1
                                    )
                        WHERE u.id = ?
                        ORDER BY m.send_at DESC 
                        `).all(user_id)
}

export function changeStatusOfFriends({status,user_id,friend_id}):object
{
    db.prepare(`UPDATE friendships SET status = ? WHERE user_id = ? AND friend_id = ?`).run(status,user_id,friend_id);
    const status1 = db.prepare(`SELECT status FROM friendships WHERE user_id = ? AND friend_id = ? `).get(user_id,friend_id)
    const status2 = db.prepare(`SELECT status FROM friendships WHERE user_id = ? AND friend_id = ? `).get(friend_id,user_id)
    return {status1,status2}
}
export function getStatusOfTowFriends(myId:string,friend_id:string):object
{
    const status1 = db.prepare(`SELECT status FROM friendships WHERE user_id = ? AND friend_id = ? `).get(myId,friend_id)
    const status2 = db.prepare(`SELECT status FROM friendships WHERE user_id = ? AND friend_id = ? `).get(friend_id,myId)
    return {status1,status2}
    // return db.prepare(`SELECT status FROM friendships WHERE user_id = ? AND friend_id = ? `).get(myId,friend_id)
}

export function saveMsg(send:string,recv:string,msg:string,room:string,status:string):string
{
    const msgData = db.prepare(`INSERT INTO msg(send,recv,msg,room,status) VALUES (?,?,?,?,?)`).run(send,recv,msg,room,status)
    const msgId = String(msgData.lastInsertRowid)
    return msgId
}
export function getTimeOfMsg(msgId:string):string
{
    const time:any = db.prepare(`SELECT strftime('%H:%M', send_at) AS time FROM msg WHERE id = ?`).get(msgId)
    const msgTime = String(time.time)
    return msgTime
}
export function getWaitingMsg(recv:string)
{
    return db.prepare(`SELECT id,msg,room FROM msg WHERE recv = ? AND status = ?`).all(recv,'waiting');
}

export function getAllMsg(roomName:string,limit: number = 20, offset: number = 0)
{
    return db.prepare(`SELECT id,send,recv,msg,status,strftime('%H:%M', send_at) AS time FROM msg WHERE room = ? ORDER BY send_at DESC LIMIT ? OFFSET ?`).all(roomName,limit,offset);
}
// export function getAllMsg(roomName:string)
// {
//     return db.prepare(`SELECT id,send,recv,msg,status FROM msg WHERE room = ? ORDER BY send_at ASC`).all(roomName);
// }
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