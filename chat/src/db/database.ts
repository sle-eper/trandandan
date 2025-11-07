import Database from 'better-sqlite3';
const db = new Database('/home/aabdenou/Desktop/trandandan/chat/src/db/database.db');


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
    room TXT NOT NULL,
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
//     { name: 'x', img: 'https://randomuser.me/api/portraits/men/12.jpg' },
//     { name: 'Y', img: 'https://randomuser.me/api/portraits/women/12.jpg' ,},
//     { name: 'z', img: 'https://randomuser.me/api/portraits/men/99.jpg' },
//     { name: 'l', img: 'https://randomuser.me/api/portraits/men/1.jpg' },
//     { name: 'm', img: 'https://randomuser.me/api/portraits/women/1.jpg' },
//     { name: 'n', img: 'https://randomuser.me/api/portraits/women/3.jpg' },
//     { name: 'f', img: 'https://randomuser.me/api/portraits/men/2.jpg' },
//     { name: 'l', img: 'https://randomuser.me/api/portraits/men/77.jpg' },
//     { name: 'r', img: 'https://randomuser.me/api/portraits/men/88.jpg' },
//     { name: 'q', img: 'https://randomuser.me/api/portraits/women/65.jpg' },
];

// users.forEach((user)=>{
//         insertUsers.run(user.name,user.img);
//     })
    
const user =  db.prepare(`SELECT id FROM users WHERE id = ?`).get('3');
const friends = db.prepare(`SELECT id FROM users WHERE id != ?`).all('3')
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
    return db.prepare(`SELECT f.id,f.name ,f.img ,fs.status, m.msg , m.send , m.recv , m.send_at
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
export function getMyId(name:string):string
{
    const user = db.prepare(`SELECT id FROM users WHERE name = ?`).get(name);
    return user.id
}
export function changeStatusOfFriends({status,user_id,friend_id})
{
    db.prepare(`UPDATE friendships SET status = ? WHERE user_id = ? AND friend_id = ?`).run(status,user_id,friend_id);
}
export function getStatusOfTowFriends(myId:string,friend_id:number):object
{
    const status1 = db.prepare(`SELECT status FROM friendships WHERE user_id = ? AND friend_id = ? `).get(myId,friend_id)
    const status2 = db.prepare(`SELECT status FROM friendships WHERE user_id = ? AND friend_id = ? `).get(friend_id,myId)
    return {status1,status2}
    // return db.prepare(`SELECT status FROM friendships WHERE user_id = ? AND friend_id = ? `).get(myId,friend_id)
}
export function insertNewUSer({userName,img}):string{
    const user  = db.prepare(`INSERT INTO users(name,img) VALUES (?,?)`).run(userName,img)
    console.log(user.lastInsertRowid);
    return user.lastInsertRowid
}

export function getLastUser():string {
    const stmt = db.prepare(`SELECT * FROM users ORDER BY id DESC LIMIT 1`);
    const user = stmt.get();
  return user.id; // { id, name, img }
}
export function saveMsg(send:string,recv:number,msg:string,room:string,status:string)
{
    db.prepare(`INSERT INTO msg(send,recv,msg,room,status) VALUES (?,?,?,?,?)`).run(send,recv,msg,room,status)
}
export function getWaitingMsg(recv:string)
{
    return db.prepare(`SELECT id,msg,room FROM msg WHERE recv = ? AND status = ?`).all(recv,'waiting');
}
export function getAllMsg(roomName:string)
{
    return db.prepare(`SELECT id,send,recv,msg,status FROM msg WHERE room = ?`).all(roomName);
}
export function changeToRecv(id:string)
{
    db.prepare(`UPDATE msg SET status = ? WHERE id = ?`).run('send',id)
}
// // console.table(getFriendsOfUser(getMyId('Ayoub')))
// // db.close();


// const mag = db.prepare(`SELECT f.id,f.name AS friend_name ,f.img ,fs.status, m.msg , m.send , m.recv , m.send_at
//                         FROM users AS u
//                         JOIN friendships AS fs
//                         ON u.id = fs.user_id
//                         JOIN users AS f
//                         ON f.id = fs.friend_id
//                         LEFT JOIN msg AS m 
//                         ON m.id = (SELECT id 
//                                     FROM msg 
//                                     WHERE 
//                                     (send = f.id AND recv = u.id)
//                                     OR 
//                                     (send = u.id AND recv = f.id)
//                                     ORDER BY send_at DESC
//                                     LIMIT 1
//                                     )
//                         WHERE u.id = ?
//                         ORDER BY m.send_at DESC 
//                         `).all(1)
// console.table(mag);







// ,msg.msg,msg.send_at


        //   LEFT JOIN msg
        //                 ON users.id = msg.recv
        