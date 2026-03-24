import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { openDB } from './src/config/db.js';
import { initDB } from './src/config/initDB.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Initialize database first
    await initDB();

    const db = await openDB();

    // Check if users already exist
    const userCount = await db.get('SELECT COUNT(*) as count FROM users');
    if (userCount.count > 0) {
      console.log('✓ Database already has users, skipping seed');
      await db.close();
      return;
    }

    // Hash test password
    const hashedPassword = await bcrypt.hash('test123', 10);

    // Insert test user
    await db.run(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      ['test@example.com', hashedPassword, 'Test User']
    );

    // Insert test restaurants
    await db.run(
      'INSERT INTO restaurants (name, description) VALUES (?, ?)',
      ['Pizza Palace', 'Authentic Italian pizzas']
    );

    await db.run(
      'INSERT INTO restaurants (name, description) VALUES (?, ?)',
      ['Burger Barn', 'Classic American burgers']
    );

    // Insert test menu items for Pizza Palace (restaurant_id = 1)
    await db.run(
      'INSERT INTO menu_items (restaurant_id, name, description, price) VALUES (?, ?, ?, ?)',
      [1, 'Margherita Pizza', 'Fresh mozzarella and basil', 12.99]
    );

    await db.run(
      'INSERT INTO menu_items (restaurant_id, name, description, price) VALUES (?, ?, ?, ?)',
      [1, 'Pepperoni Pizza', 'Classic pepperoni', 14.99]
    );

    // Insert test menu items for Burger Barn (restaurant_id = 2)
    await db.run(
      'INSERT INTO menu_items (restaurant_id, name, description, price) VALUES (?, ?, ?, ?)',
      [2, 'Classic Burger', 'Beef patty with lettuce and tomato', 9.99]
    );

    await db.close();
    console.log('✓ Database seeded successfully');
  } catch (error) {
    console.error('Seed error:', error);
  }
};

seedDatabase();
