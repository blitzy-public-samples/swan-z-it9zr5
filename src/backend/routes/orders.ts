import { Router } from 'express';
import { createOrder, getOrderById, getUserOrders, updateOrderStatus } from '../controllers/orderController';
import { authenticateUser } from '../middleware/auth';
import { validateOrderCreation, validateOrderUpdate } from '../middleware/validation';

const router = Router();

// Create a new order
router.post('/', authenticateUser, validateOrderCreation, createOrder);

// Get order by ID
router.get('/:orderId', authenticateUser, getOrderById);

// Get user's order history
router.get('/history', authenticateUser, getUserOrders);

// Update order status
router.put('/:orderId/status', authenticateUser, validateOrderUpdate, updateOrderStatus);

export default router;