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
      'SELECT * FROM menu_items WHERE restaurant_id = ? ORDER BY id DESC',
      [restaurantId]
    );
    await db.close();
    return items;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

export const createMenuItem = async (itemData) => {
  try {
    const db = await openDB();

    // Validate restaurant exists
    const restaurant = await db.get('SELECT id FROM restaurants WHERE id = ?', [itemData.restaurant_id]);
    if (!restaurant) {
      await db.close();
      throw new Error('Restaurant not found');
    }

    const result = await db.run(
      'INSERT INTO menu_items (restaurant_id, name, description, price) VALUES (?, ?, ?, ?)',
      [itemData.restaurant_id, itemData.name, itemData.description || null, itemData.price]
    );
    await db.close();
    return { id: result.lastID, ...itemData };
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
};

export const updateMenuItem = async (id, itemData) => {
  try {
    const db = await openDB();

    // Check if menu item exists
    const item = await db.get('SELECT * FROM menu_items WHERE id = ?', [id]);
    if (!item) {
      await db.close();
      return null;
    }

    // Update only provided fields
    const updateData = {
      name: itemData.name !== undefined ? itemData.name : item.name,
      description: itemData.description !== undefined ? itemData.description : item.description,
      price: itemData.price !== undefined ? itemData.price : item.price
    };

    await db.run(
      'UPDATE menu_items SET name = ?, description = ?, price = ? WHERE id = ?',
      [updateData.name, updateData.description, updateData.price, id]
    );

    await db.close();
    return { id, restaurant_id: item.restaurant_id, ...updateData };
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

export const deleteMenuItem = async (id) => {
  try {
    const db = await openDB();

    // Check if menu item exists
    const item = await db.get('SELECT * FROM menu_items WHERE id = ?', [id]);
    if (!item) {
      await db.close();
      return false;
    }

    await db.run('DELETE FROM menu_items WHERE id = ?', [id]);

    await db.close();
    return true;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};
