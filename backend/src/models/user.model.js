import { openDB } from '../config/db.js';

export const getUserByEmail = async (email) => {
  try {
    const db = await openDB();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    await db.close();
    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const db = await openDB();
    const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
    await db.close();
    return user;
  } catch (error) {
    console.error('Error fetching user by id:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const db = await openDB();
    const result = await db.run(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [userData.email, userData.password, userData.name]
    );
    await db.close();
    return { id: result.lastID, ...userData };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
