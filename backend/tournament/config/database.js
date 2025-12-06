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
            CREATE TABLE IF NOT EXISTS tournament (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name VARCHAR(100) NOT NULL,
              ownerId INTEGER NOT NULL,
              maxPlayers INTEGER NOT NULL,
              currentPlayers INTEGER DEFAULT 1,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `);
          await db.run(`
            CREATE TABLE IF NOT EXISTS participant (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              nickname VARCHAR(50) NOT NULL,
              tournament_id INTEGER NOT NULL,
              user_id INTEGER NOT NULL,
              score INTEGER DEFAULT 0,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            )
          `);
    }catch(error){
        console.error('❌ Error creating tables:', error);
        throw error;
    }

}
