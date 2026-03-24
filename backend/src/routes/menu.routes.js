import express from 'express';
import {
  getMenuItemById,
  getMenuByRestaurant,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menu.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/restaurant/:restaurantId', getMenuByRestaurant);
router.get('/:id', getMenuItemById);

// Protected routes (for admins)
router.post('/', authenticateToken, createMenuItem);
router.put('/:id', authenticateToken, updateMenuItem);
router.delete('/:id', authenticateToken, deleteMenuItem);

export default router;
