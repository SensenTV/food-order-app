import {
  createOrder,
  getOrderByIdForUser,
  getOrdersByUserId,
  updateOrderStatusForUser
} from '../models/order.model.js';

export const createOrderHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { restaurantId, items } = req.body;

    if (!restaurantId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'restaurantId and at least one order item are required'
      });
    }

    const normalizedItems = items.map((item) => ({
      menuItemId: Number(item.menuItemId),
      quantity: Number(item.quantity)
    }));

    const hasInvalidItem = normalizedItems.some(
      (item) => !Number.isInteger(item.menuItemId) || !Number.isInteger(item.quantity) || item.quantity <= 0
    );

    if (hasInvalidItem) {
      return res.status(400).json({
        message: 'Each item must contain valid integer menuItemId and positive integer quantity'
      });
    }

    const order = await createOrder({
      userId,
      restaurantId: Number(restaurantId),
      items: normalizedItems
    });

    return res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getMyOrdersHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await getOrdersByUserId(userId);
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

export const getMyOrderByIdHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    const order = await getOrderByIdForUser(orderId, userId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
};

export const updateMyOrderStatusHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orderId = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isInteger(orderId)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    if (!status) {
      return res.status(400).json({ message: 'status is required' });
    }

    const order = await updateOrderStatusForUser(orderId, userId, status);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
