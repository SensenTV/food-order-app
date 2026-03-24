import express from 'express';
import { 
  getRestaurants,
  getRestaurantById,
  getMenuByRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} from '../controllers/restaurant.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes - more specific routes FIRST, then param routes
router.get('/', getRestaurants);
router.get('/:restaurantId/menu', getMenuByRestaurant);
router.get('/:id', getRestaurantById);

// Protected routes (for admins)
router.post('/', authenticateToken, createRestaurant);
router.put('/:id', authenticateToken, updateRestaurant);
router.delete('/:id', authenticateToken, deleteRestaurant);

export default router;
