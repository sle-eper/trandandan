import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = path.join(__dirname, 'mydatabase.db');

if (!fs.existsSync(__dirname)) {
  fs.mkdirSync(__dirname, { recursive: true });
  console.log('📁 Created DB folder at:', __dirname);
}

const db = new Database(dbFile);
console.log('✅ Database connected at:', dbFile);

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_token TEXT UNIQUE,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT UNIQUE,
    u_created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  ) 
`).run();

export default db;
