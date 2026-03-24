import { openDB } from '../config/db.js';

export const getMenuItemById = async (id) => {
  try {
    const db = await openDB();
    const item = await db.get('SELECT * FROM menu_items WHERE id = ?', [id]);
    await db.close();
    return item;
  } catch (error) {
    console.error('Error fetching menu item:', error);
    throw error;
  }
};

export const getMenuItemsByRestaurant = async (restaurantId) => {
  try {
    const db = await openDB();
    const items = await db.all(
      'SELECT * FROM menu_items WHERE restaurant_id = ?',
      [restaurantId]
    );
    await db.close();
    return items;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};
