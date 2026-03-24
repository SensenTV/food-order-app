import { openDB } from '../config/db.js';

const ORDER_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];

const buildOrderDetails = async (db, orderId, userId) => {
  const order = await db.get(
    `SELECT o.id, o.user_id, o.restaurant_id, o.status, o.total_amount, o.created_at,
            r.name AS restaurant_name
     FROM orders o
     JOIN restaurants r ON r.id = o.restaurant_id
     WHERE o.id = ? AND o.user_id = ?`,
    [orderId, userId]
  );

  if (!order) {
    return null;
  }

  const items = await db.all(
    `SELECT oi.id, oi.menu_item_id, oi.quantity, oi.unit_price, oi.line_total,
            mi.name AS menu_item_name
     FROM order_items oi
     JOIN menu_items mi ON mi.id = oi.menu_item_id
     WHERE oi.order_id = ?
     ORDER BY oi.id ASC`,
    [orderId]
  );

  return { ...order, items };
};

export const createOrder = async ({ userId, restaurantId, items }) => {
  const db = await openDB();

  try {
    await db.exec('BEGIN TRANSACTION');

    const itemIds = items.map((item) => item.menuItemId);
    const placeholders = itemIds.map(() => '?').join(',');

    const menuItems = await db.all(
      `SELECT id, restaurant_id, price
       FROM menu_items
       WHERE id IN (${placeholders})`,
      itemIds
    );

    if (menuItems.length !== itemIds.length) {
      throw new Error('One or more menu items were not found');
    }

    const menuItemMap = new Map(menuItems.map((row) => [row.id, row]));
    let totalAmount = 0;

    for (const item of items) {
      const menuItem = menuItemMap.get(item.menuItemId);

      if (!menuItem) {
        throw new Error('Invalid menu item in order');
      }

      if (menuItem.restaurant_id !== restaurantId) {
        throw new Error('All items must belong to the selected restaurant');
      }

      totalAmount += menuItem.price * item.quantity;
    }

    const orderResult = await db.run(
      `INSERT INTO orders (user_id, restaurant_id, status, total_amount)
       VALUES (?, ?, 'pending', ?)`,
      [userId, restaurantId, totalAmount]
    );

    const orderId = orderResult.lastID;

    for (const item of items) {
      const menuItem = menuItemMap.get(item.menuItemId);
      const lineTotal = menuItem.price * item.quantity;

      await db.run(
        `INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, line_total)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.menuItemId, item.quantity, menuItem.price, lineTotal]
      );
    }

    await db.exec('COMMIT');
    const orderDetails = await buildOrderDetails(db, orderId, userId);
    return orderDetails;
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
  } finally {
    await db.close();
  }
};

export const getOrdersByUserId = async (userId) => {
  const db = await openDB();

  try {
    const orders = await db.all(
      `SELECT o.id, o.user_id, o.restaurant_id, o.status, o.total_amount, o.created_at,
              r.name AS restaurant_name
       FROM orders o
       JOIN restaurants r ON r.id = o.restaurant_id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [userId]
    );

    return orders;
  } finally {
    await db.close();
  }
};

export const getOrderByIdForUser = async (orderId, userId) => {
  const db = await openDB();

  try {
    return await buildOrderDetails(db, orderId, userId);
  } finally {
    await db.close();
  }
};

export const updateOrderStatusForUser = async (orderId, userId, status) => {
  if (!ORDER_STATUSES.includes(status)) {
    throw new Error('Invalid order status');
  }

  const db = await openDB();

  try {
    const existing = await db.get(
      'SELECT id FROM orders WHERE id = ? AND user_id = ?',
      [orderId, userId]
    );

    if (!existing) {
      return null;
    }

    await db.run(
      'UPDATE orders SET status = ? WHERE id = ? AND user_id = ?',
      [status, orderId, userId]
    );

    return await buildOrderDetails(db, orderId, userId);
  } finally {
    await db.close();
  }
};
