import express from 'express';
import { getRestaurants, getMenuByRestaurant } from '../controllers/restaurant.controller.js';

const router = express.Router();

router.get('/', getRestaurants);
router.get('/:id/menu', getMenuByRestaurant);

export default router;
