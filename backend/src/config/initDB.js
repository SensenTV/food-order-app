import fs from 'fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const DB_PATH = './src/database/database.sqlite';
const SQL_INIT_PATH = './src/database/init.sql';

export const initDB = async () => {
  try {
    const dbExists = fs.existsSync(DB_PATH);
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });

    // Always execute CREATE TABLE IF NOT EXISTS statements
    // so schema changes are applied for existing DB files too.
    const sql = fs.readFileSync(SQL_INIT_PATH, 'utf8');
    await db.exec(sql);
    await db.close();

    if (dbExists) {
      console.log('✓ Database schema checked/updated');
    } else {
      console.log('✓ Database initialized successfully');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};
