import express from 'express';
import * as ordersController from '../controllers/ordersController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', ordersController.createOrder);

router.get('/', verifyToken, verifyAdmin, ordersController.getOrders);
router.get('/:id', verifyToken, verifyAdmin, ordersController.getOrderById);
router.put('/:id/status', verifyToken, verifyAdmin, ordersController.updateOrderStatus);

export default router;
