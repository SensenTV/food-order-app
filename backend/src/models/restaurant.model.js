import { openDB } from '../config/db.js';

export const getAllRestaurants = async () => {
  try {
    const db = await openDB();
    const restaurants = await db.all('SELECT * FROM restaurants');
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
      'SELECT * FROM menu_items WHERE restaurant_id = ?',
      [restaurantId]
    );
    await db.close();
    return menu;
  } catch (error) {
    console.error('Error fetching restaurant menu:', error);
    throw error;
  }
};
