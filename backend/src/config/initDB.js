import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const DB_PATH = './src/database/database.sqlite';
const SQL_INIT_PATH = './src/database/init.sql';

export const initDB = async () => {
  try {
    // Check if database exists
    const dbExists = fs.existsSync(DB_PATH);

    if (!dbExists) {
      console.log('Initializing database...');
      
      // Create database and execute init script
      let db = await open({
        filename: DB_PATH,
        driver: sqlite3.Database
      });

      const sql = fs.readFileSync(SQL_INIT_PATH, 'utf8');
      await db.exec(sql);
      await db.close();

      console.log('✓ Database initialized successfully');
    } else {
      console.log('✓ Database already exists');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};
