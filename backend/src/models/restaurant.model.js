import { openDB } from '../config/db.js';

export const getAllRestaurants = async () => {
  try {
    const db = await openDB();
    const restaurants = await db.all('SELECT * FROM restaurants ORDER BY id DESC');
    await db.close();
    return restaurants;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
};

export const getRestaurantById = async (id) => {
  try {
    const db = await openDB();
    const restaurant = await db.get('SELECT * FROM restaurants WHERE id = ?', [id]);
    await db.close();
    return restaurant;
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    throw error;
  }
};

export const getRestaurantMenu = async (restaurantId) => {
  try {
    const db = await openDB();
    const menu = await db.all(
      'SELECT * FROM menu_items WHERE restaurant_id = ? ORDER BY id DESC',
      [restaurantId]
    );
    await db.close();
    return menu;
  } catch (error) {
    console.error('Error fetching restaurant menu:', error);
    throw error;
  }
};

export const createRestaurant = async (restaurantData) => {
  try {
    const db = await openDB();
    const result = await db.run(
      'INSERT INTO restaurants (name, description) VALUES (?, ?)',
      [restaurantData.name, restaurantData.description || null]
    );
    await db.close();
    return { id: result.lastID, ...restaurantData };
  } catch (error) {
    console.error('Error creating restaurant:', error);
    throw error;
  }
};

export const updateRestaurant = async (id, restaurantData) => {
  try {
    const db = await openDB();

    // Check if restaurant exists
    const restaurant = await db.get('SELECT * FROM restaurants WHERE id = ?', [id]);
    if (!restaurant) {
      await db.close();
      return null;
    }

    // Update only provided fields
    const updateData = {
      name: restaurantData.name !== undefined ? restaurantData.name : restaurant.name,
      description: restaurantData.description !== undefined ? restaurantData.description : restaurant.description
    };

    await db.run(
      'UPDATE restaurants SET name = ?, description = ? WHERE id = ?',
      [updateData.name, updateData.description, id]
    );

    await db.close();
    return { id, ...updateData };
  } catch (error) {
    console.error('Error updating restaurant:', error);
    throw error;
  }
};

export const deleteRestaurant = async (id) => {
  try {
    const db = await openDB();

    // Check if restaurant exists
    const restaurant = await db.get('SELECT * FROM restaurants WHERE id = ?', [id]);
    if (!restaurant) {
      await db.close();
      return false;
    }

    // Delete menu items first (cascade)
    await db.run('DELETE FROM menu_items WHERE restaurant_id = ?', [id]);

    // Delete restaurant
    await db.run('DELETE FROM restaurants WHERE id = ?', [id]);

    await db.close();
    return true;
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    throw error;
  }
};
