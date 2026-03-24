import express from 'express';
import {
  createOrderHandler,
  getMyOrderByIdHandler,
  getMyOrdersHandler,
  updateMyOrderStatusHandler
} from '../controllers/order.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);
router.get('/', getMyOrdersHandler);
router.get('/:id', getMyOrderByIdHandler);
router.post('/', createOrderHandler);
router.patch('/:id/status', updateMyOrderStatusHandler);

export default router;
