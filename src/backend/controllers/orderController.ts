import { Request, Response, NextFunction } from 'express';
import * as orderService from 'src/backend/services/orderService';
import { ApiError } from 'src/backend/utils/ApiError';
import { catchAsync } from 'src/backend/utils/catchAsync';
import { validateSchema } from 'src/backend/middleware/validateSchema';
import { createOrderSchema, updateOrderStatusSchema } from 'src/backend/schemas/orderSchemas';
import { PaginationOptions } from 'src/shared/types/index';

export const createOrder = catchAsync(
  validateSchema(createOrderSchema),
  async (req: Request, res: Response) => {
    const orderData = req.body;
    const userId = req.user.id; // Assuming user ID is attached to req.user by auth middleware
    const newOrder = await orderService.createOrder(userId, orderData);
    res.status(201).json({ success: true, data: newOrder });
  }
);

export const getOrder = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const userId = req.user.id;
  const order = await orderService.getOrderById(orderId);
  
  if (order.userId !== userId) {
    throw new ApiError(403, 'You are not authorized to view this order');
  }
  
  res.status(200).json({ success: true, data: order });
});

export const updateOrderStatus = catchAsync(
  validateSchema(updateOrderStatusSchema),
  async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    const { status } = req.body;
    const updatedOrder = await orderService.updateOrderStatus(orderId, status);
    res.status(200).json({ success: true, data: updatedOrder });
  }
);

export const getUserOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const paginationOptions: PaginationOptions = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
  };
  const { orders, totalCount } = await orderService.getUserOrders(userId, paginationOptions);
  res.status(200).json({ success: true, data: { orders, totalCount } });
});

export const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const userId = req.user.id;
  const cancelledOrder = await orderService.cancelOrder(orderId, userId);
  res.status(200).json({ success: true, data: cancelledOrder });
});

export const processPayment = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const paymentDetails = req.body;
  const paymentResult = await orderService.processPayment(orderId, paymentDetails);
  res.status(200).json({ success: true, data: paymentResult });
});