import Database from 'better-sqlite3';
const db = new Database('database.db');

db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    img TEXT)`).run();

const insert = db.prepare(`INSERT INTO users (name,img) VALUES (?,?)`)
// insert.run('ayoub','haljsfhlkadhfladf')
// insert.run('sekefek','haljsfhlkadhfladf')

console.log('Table "users" is ready.');

const stmt = db.prepare('SELECT * FROM users ORDER BY id');
const rows = stmt.all();
console.log(rows);
db.close();
