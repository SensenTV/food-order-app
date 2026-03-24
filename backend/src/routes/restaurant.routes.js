import express from 'express';
import { getRestaurants, getMenuByRestaurant } from '../controllers/restaurant.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes - no auth required
router.get('/', getRestaurants);
router.get('/:id/menu', getMenuByRestaurant);

// Protected routes could go here if needed
// router.post('/', authenticateToken, createRestaurant);

export default router;
