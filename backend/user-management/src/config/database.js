import sqlite3 from "sqlite3";
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';



let db = null;

export async function initializeDatabase() {
    try {
        const dbPath = path.join(process.cwd(), 'data', 'PINGPONG.db');
        db = await open({
            filename:  dbPath,
            driver: sqlite3.Database
        });
        console.log('✅ Connected to SQLite database');
        await db.exec('PRAGMA foreign_keys = ON;');
        await createTables();
        
        return db;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }

  
}

export function getDatabase() {
    if (!db) {
        throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return db;
}

export async function closeDatabase() {
    if (db) {
      await db.close();
      console.log('✅ Database connection closed');
    }
}


export async  function createTables(){


    try{
        await db.run(`
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              username VARCHAR(50) UNIQUE NOT NULL,
              email VARCHAR(100) UNIQUE NOT NULL,
              password_hash VARCHAR(255),
              display_name VARCHAR(100) UNIQUE NOT NULL,
              avatar_url VARCHAR(500) DEFAULT 'default.png',
              bio TEXT,
              two_factor_enabled BOOLEAN DEFAULT 0,
              two_factor_secret VARCHAR(255),
              online_status VARCHAR(20) DEFAULT 'offline',
              last_seen DATETIME,
              id_token TEXT UNIQUE,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `);
          
          await db.run(`
            CREATE TABLE IF NOT EXISTS user_stats (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER UNIQUE NOT NULL,
              total_games INTEGER DEFAULT 0,
              wins INTEGER DEFAULT 0,
              losses INTEGER DEFAULT 0,
              tournaments_played INTEGER DEFAULT 0,
              tournaments_won INTEGER DEFAULT 0,
              best_score INTEGER DEFAULT 0,
              win_rate REAL DEFAULT 0,
              ranking INTEGER DEFAULT 0,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
          `);
          await db.run(`
            CREATE TABLE IF NOT EXISTS friendships (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER NOT NULL,
              friend_id INTEGER NOT NULL,
              status VARCHAR(20) DEFAULT 'pending',
              requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              accepted_at DATETIME,
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
              FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,
              UNIQUE(user_id, friend_id)
            )
          `);
    }catch(error){
        console.error('❌ Error creating tables:', error);
        throw error;
    }

}
