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

    // Hash test password
    const hashedPassword = await bcrypt.hash('test123', 10);

    // Ensure test user exists (email is unique)
    await db.run(
      'INSERT OR IGNORE INTO users (email, password, name) VALUES (?, ?, ?)',
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

    // Ensure restaurants exist and build a name -> id map
    const restaurantIds = new Map();
    for (const restaurant of restaurants) {
      const existingRestaurant = await db.get(
        'SELECT id FROM restaurants WHERE name = ? LIMIT 1',
        [restaurant.name]
      );

      if (existingRestaurant) {
        restaurantIds.set(restaurant.name, existingRestaurant.id);
        continue;
      }

      const result = await db.run(
        'INSERT INTO restaurants (name, description) VALUES (?, ?)',
        [restaurant.name, restaurant.description]
      );
      restaurantIds.set(restaurant.name, result.lastID);
    }

    // Menu items for each restaurant
    const menuItems = [
      // Pizza Palace
      { restaurantName: 'Pizza Palace', name: 'Margherita Pizza', description: 'Fresh mozzarella and basil', price: 12.99 },
      { restaurantName: 'Pizza Palace', name: 'Pepperoni Pizza', description: 'Classic pepperoni on tomato sauce', price: 14.99 },
      { restaurantName: 'Pizza Palace', name: 'Quattro Formaggi', description: 'Four cheese blend', price: 15.99 },
      { restaurantName: 'Pizza Palace', name: 'Spaghetti Carbonara', description: 'Creamy sauce with pancetta', price: 13.99 },
      { restaurantName: 'Pizza Palace', name: 'Penne Arrabbiata', description: 'Spicy tomato and garlic', price: 12.99 },

      // Burger Barn
      { restaurantName: 'Burger Barn', name: 'Classic Burger', description: 'Beef patty with lettuce and tomato', price: 9.99 },
      { restaurantName: 'Burger Barn', name: 'Double Bacon Burger', description: 'Double patty with crispy bacon', price: 12.99 },
      { restaurantName: 'Burger Barn', name: 'Mushroom Swiss', description: 'Grilled mushroom and melted Swiss cheese', price: 11.99 },
      { restaurantName: 'Burger Barn', name: 'Crispy Fries', description: 'Golden and crispy fresh fries', price: 4.99 },
      { restaurantName: 'Burger Barn', name: 'Onion Rings', description: 'Battered and fried onion rings', price: 5.99 },

      // Sakura Sushi
      { restaurantName: 'Sakura Sushi', name: 'Spicy Tuna Roll', description: 'Tuna, mayo, and spicy sauce', price: 8.99 },
      { restaurantName: 'Sakura Sushi', name: 'California Roll', description: 'Crab, avocado, and cucumber', price: 9.99 },
      { restaurantName: 'Sakura Sushi', name: 'Salmon Sashimi', description: 'Fresh salmon slices (6 pieces)', price: 12.99 },
      { restaurantName: 'Sakura Sushi', name: 'Miso Ramen', description: 'Rich miso broth with noodles', price: 11.99 },
      { restaurantName: 'Sakura Sushi', name: 'Tonkotsu Ramen', description: 'Creamy pork bone broth', price: 12.99 },

      // Taco Fiesta
      { restaurantName: 'Taco Fiesta', name: 'Carnitas Tacos', description: 'Slow-cooked pork, 3 tacos', price: 10.99 },
      { restaurantName: 'Taco Fiesta', name: 'Al Pastor Tacos', description: 'Seasoned marinated pork, 3 tacos', price: 10.99 },
      { restaurantName: 'Taco Fiesta', name: 'Fish Tacos', description: 'Crispy battered fish, 3 tacos', price: 11.99 },
      { restaurantName: 'Taco Fiesta', name: 'Enchiladas Verdes', description: 'Chicken enchiladas in green sauce', price: 12.99 },
      { restaurantName: 'Taco Fiesta', name: 'Guacamole & Chips', description: 'Freshly made guac with tortilla chips', price: 7.99 },
      { restaurantName: 'Taco Fiesta', name: 'Churros', description: 'Fried dough with cinnamon sugar', price: 5.99 },

      // Golden Dragon
      { restaurantName: 'Golden Dragon', name: 'Kung Pao Chicken', description: 'Chicken with peanuts and chili', price: 11.99 },
      { restaurantName: 'Golden Dragon', name: 'Beef and Broccoli', description: 'Tender beef with fresh broccoli', price: 12.99 },
      { restaurantName: 'Golden Dragon', name: 'Sweet and Sour Pork', description: 'Crispy pork in sweet and sour sauce', price: 11.99 },
      { restaurantName: 'Golden Dragon', name: 'Vegetable Fried Rice', description: 'Mixed vegetables with jasmine rice', price: 9.99 },
      { restaurantName: 'Golden Dragon', name: 'Dim Sum Basket', description: 'Assorted dumplings (6 pieces)', price: 10.99 },
      { restaurantName: 'Golden Dragon', name: 'General Tso’s Chicken', description: 'Spicy fried chicken in a tangy sauce', price: 12.99 }
    ];

    for (const item of menuItems) {
      const restaurantId = restaurantIds.get(item.restaurantName);
      if (!restaurantId) {
        continue;
      }

      const existingItem = await db.get(
        'SELECT id FROM menu_items WHERE restaurant_id = ? AND name = ? LIMIT 1',
        [restaurantId, item.name]
      );

      if (existingItem) {
        continue;
      }

      await db.run(
        'INSERT INTO menu_items (restaurant_id, name, description, price) VALUES (?, ?, ?, ?)',
        [restaurantId, item.name, item.description, item.price]
      );
    }

    await db.close();
    console.log('✓ Database seeded successfully');
  } catch (error) {
    console.error('Seed error:', error);
  }
};

seedDatabase();
