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

    // Check if restaurants already exist
    const restaurantCount = await db.get('SELECT COUNT(*) as count FROM restaurants');
    if (restaurantCount.count > 0) {
      console.log('✓ Database already has restaurants, skipping seed');
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

    // Insert restaurants with descriptions
    const restaurants = [
      { name: 'Pizza Palace', description: 'Authentic Italian pizzas and pasta dishes' },
      { name: 'Burger Barn', description: 'Classic American burgers and fries' },
      { name: 'Sakura Sushi', description: 'Fresh Japanese sushi and ramen' },
      { name: 'Taco Fiesta', description: 'Mexican street food and traditional tacos' },
      { name: 'Golden Dragon', description: 'Asian fusion cuisine and dim sum' }
    ];

    for (const restaurant of restaurants) {
      await db.run(
        'INSERT INTO restaurants (name, description) VALUES (?, ?)',
        [restaurant.name, restaurant.description]
      );
    }

    // Menu items for each restaurant
    const menuItems = [
      // Pizza Palace (restaurant_id = 1)
      { restaurantId: 1, name: 'Margherita Pizza', description: 'Fresh mozzarella and basil', price: 12.99 },
      { restaurantId: 1, name: 'Pepperoni Pizza', description: 'Classic pepperoni on tomato sauce', price: 14.99 },
      { restaurantId: 1, name: 'Quattro Formaggi', description: 'Four cheese blend', price: 15.99 },
      { restaurantId: 1, name: 'Spaghetti Carbonara', description: 'Creamy sauce with pancetta', price: 13.99 },
      { restaurantId: 1, name: 'Penne Arrabbiata', description: 'Spicy tomato and garlic', price: 12.99 },

      // Burger Barn (restaurant_id = 2)
      { restaurantId: 2, name: 'Classic Burger', description: 'Beef patty with lettuce and tomato', price: 9.99 },
      { restaurantId: 2, name: 'Double Bacon Burger', description: 'Double patty with crispy bacon', price: 12.99 },
      { restaurantId: 2, name: 'Mushroom Swiss', description: 'Grilled mushroom and melted Swiss cheese', price: 11.99 },
      { restaurantId: 2, name: 'Crispy Fries', description: 'Golden and crispy fresh fries', price: 4.99 },
      { restaurantId: 2, name: 'Onion Rings', description: 'Battered and fried onion rings', price: 5.99 },

      // Sakura Sushi (restaurant_id = 3)
      { restaurantId: 3, name: 'Spicy Tuna Roll', description: 'Tuna, mayo, and spicy sauce', price: 8.99 },
      { restaurantId: 3, name: 'California Roll', description: 'Crab, avocado, and cucumber', price: 9.99 },
      { restaurantId: 3, name: 'Salmon Sashimi', description: 'Fresh salmon slices (6 pieces)', price: 12.99 },
      { restaurantId: 3, name: 'Miso Ramen', description: 'Rich miso broth with noodles', price: 11.99 },
      { restaurantId: 3, name: 'Tonkotsu Ramen', description: 'Creamy pork bone broth', price: 12.99 },

      // Taco Fiesta (restaurant_id = 4)
      { restaurantId: 4, name: 'Carnitas Tacos', description: 'Slow-cooked pork, 3 tacos', price: 10.99 },
      { restaurantId: 4, name: 'Al Pastor Tacos', description: 'Seasoned marinated pork, 3 tacos', price: 10.99 },
      { restaurantId: 4, name: 'Fish Tacos', description: 'Crispy battered fish, 3 tacos', price: 11.99 },
      { restaurantId: 4, name: 'Enchiladas Verdes', description: 'Chicken enchiladas in green sauce', price: 12.99 },
      { restaurantId: 4, name: 'Guacamole & Chips', description: 'Freshly made guac with tortilla chips', price: 7.99 },

      // Golden Dragon (restaurant_id = 5)
      { restaurantId: 5, name: 'Kung Pao Chicken', description: 'Chicken with peanuts and chili', price: 11.99 },
      { restaurantId: 5, name: 'Beef and Broccoli', description: 'Tender beef with fresh broccoli', price: 12.99 },
      { restaurantId: 5, name: 'Sweet and Sour Pork', description: 'Crispy pork in sweet and sour sauce', price: 11.99 },
      { restaurantId: 5, name: 'Vegetable Fried Rice', description: 'Mixed vegetables with jasmine rice', price: 9.99 },
      { restaurantId: 5, name: 'Dim Sum Basket', description: 'Assorted dumplings (6 pieces)', price: 10.99 }
    ];

    for (const item of menuItems) {
      await db.run(
        'INSERT INTO menu_items (restaurant_id, name, description, price) VALUES (?, ?, ?, ?)',
        [item.restaurantId, item.name, item.description, item.price]
      );
    }

    await db.close();
    console.log('✓ Database seeded successfully');
  } catch (error) {
    console.error('Seed error:', error);
  }
};

seedDatabase();
