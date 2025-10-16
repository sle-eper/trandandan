import Database from 'better-sqlite3';
import fs from 'fs';

if (!fs.existsSync('./data')) fs.mkdirSync('./data');

const db = new Database('./data/mydatabase.db');

// This line actually forces the database file to be created
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT UNIQUE,
    u_created_at DATETIME DEFAULT CURRENT_TIMESTAMP

  )
`).run();

console.log('✅ Database connected at ./data/mydatabase.db');

export default db;
