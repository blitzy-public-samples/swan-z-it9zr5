import { Router } from 'express';
import * as orderController from 'src/backend/controllers/orderController';
import { validateSchema } from 'src/backend/middleware/validateSchema';
import { createOrderSchema, updateOrderStatusSchema } from 'src/backend/schemas/orderSchemas';
import { authenticate } from 'src/backend/middleware/authenticate';
import { authorize } from 'src/backend/middleware/authorize';

const router = Router();

// Create a new order
router.post('/', authenticate, validateSchema(createOrderSchema), orderController.createOrder);

// Get a specific order
router.get('/:orderId', authenticate, orderController.getOrder);

// Update order status (admin only)
router.put('/:orderId/status', authenticate, authorize('admin'), validateSchema(updateOrderStatusSchema), orderController.updateOrderStatus);

// Get user's orders
router.get('/user', authenticate, orderController.getUserOrders);

// Cancel an order
router.post('/:orderId/cancel', authenticate, orderController.cancelOrder);

// Process payment for an order
router.post('/:orderId/payment', authenticate, orderController.processPayment);

export default router;