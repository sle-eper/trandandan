import Database from 'better-sqlite3';
const db = new Database('/home/aabdenou/Desktop/trandandan/chat/src/db/database.db');


// db.prepare(`DROP TABLE friendships `).run();
// db.prepare(`DROP TABLE users `).run();

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

const insertUsers = db.prepare(`INSERT INTO users (name,img) VALUES (?,?)`)

const users = [
    { name: 'Ayoub', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Sara', img: 'https://randomuser.me/api/portraits/women/45.jpg' },
    { name: 'Omar', img: 'https://randomuser.me/api/portraits/men/67.jpg' },
    { name: 'jamila', img: 'https://randomuser.me/api/portraits/women/88.jpg' },
    { name: 'Youssef', img: 'https://randomuser.me/api/portraits/men/12.jpg' },
    { name: 'x', img: 'https://randomuser.me/api/portraits/men/12.jpg' },
    { name: 'Y', img: 'https://randomuser.me/api/portraits/women/12.jpg' ,},
    { name: 'z', img: 'https://randomuser.me/api/portraits/men/99.jpg' },
    { name: 'l', img: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { name: 'm', img: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { name: 'n', img: 'https://randomuser.me/api/portraits/women/3.jpg' },
    { name: 'f', img: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { name: 'l', img: 'https://randomuser.me/api/portraits/men/77.jpg' },
    { name: 'r', img: 'https://randomuser.me/api/portraits/men/88.jpg' },
    { name: 'q', img: 'https://randomuser.me/api/portraits/women/65.jpg' },
];

// users.forEach((user)=>{
//         insertUsers.run(user.name,user.img);
//     })
    
const user =  db.prepare(`SELECT id FROM users WHERE name = ?`).get('Ayoub');
const friends = db.prepare(`SELECT id FROM users WHERE name != ?`).all('Ayoub')
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
    return db.prepare(`SELECT users.id,users.name,users.img,friendships.status FROM users INNER JOIN friendships ON users.id = friendships.friend_id WHERE friendships.user_id = ? `).all(user_id);
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
export function getStatusOfTowFriends(myId:string,friend_id:string):string
{
    return db.prepare(`SELECT status FROM friendships WHERE user_id = ? AND friend_id = ? `).get(myId,friend_id)
}
// // console.table(getFriendsOfUser(getMyId('Ayoub')))
// // db.close();

