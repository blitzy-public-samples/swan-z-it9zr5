import { Order, IOrder } from '../models/Order';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { CustomDesign } from '../models/CustomDesign';
import { ApiError } from '../utils/ApiError';
import { PaginationOptions } from '../../shared/types/index';
import * as productService from './productService';

export async function createOrder(orderData: any): Promise<IOrder> {
  // Validate order data
  if (!orderData.userId || !orderData.items || orderData.items.length === 0) {
    throw new ApiError(400, 'Invalid order data');
  }

  // Check if user exists
  const user = await User.findById(orderData.userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Verify product availability and prices
  let totalAmount = 0;
  for (const item of orderData.items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new ApiError(404, `Product not found: ${item.productId}`);
    }
    if (product.stockQuantity < item.quantity) {
      throw new ApiError(400, `Insufficient stock for product: ${product.name}`);
    }
    totalAmount += product.basePrice * item.quantity;
  }

  // Create new Order document
  const order = new Order({
    user: orderData.userId,
    items: orderData.items,
    totalAmount,
    status: 'pending',
    shippingAddress: orderData.shippingAddress,
    paymentMethod: orderData.paymentMethod,
  });

  // Update product stock quantities
  for (const item of orderData.items) {
    await productService.updateProductStock(item.productId, -item.quantity);
  }

  // Save the new order
  await order.save();

  return order;
}

export async function getOrderById(orderId: string): Promise<IOrder> {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  return order;
}

export async function updateOrderStatus(orderId: string, newStatus: string): Promise<IOrder> {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Validate new status
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(newStatus)) {
    throw new ApiError(400, 'Invalid order status');
  }

  order.status = newStatus;
  await order.save();

  return order;
}

export async function getUserOrders(userId: string, options: PaginationOptions): Promise<{ orders: IOrder[]; total: number }> {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments({ user: userId });

  return { orders, total };
}

export async function cancelOrder(orderId: string): Promise<IOrder> {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.status !== 'pending' && order.status !== 'processing') {
    throw new ApiError(400, 'Order cannot be cancelled');
  }

  order.status = 'cancelled';

  // Restore product stock quantities
  for (const item of order.items) {
    await productService.updateProductStock(item.product.toString(), item.quantity);
  }

  await order.save();

  return order;
}

export async function processPayment(orderId: string, paymentDetails: any): Promise<{ success: boolean; transactionId?: string }> {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Validate payment details
  if (!paymentDetails.paymentMethod || !paymentDetails.amount) {
    throw new ApiError(400, 'Invalid payment details');
  }

  // TODO: Integrate with payment gateway to process payment
  // This is a placeholder for the actual payment processing logic
  const paymentResult = {
    success: true,
    transactionId: `TRANS-${Date.now()}`
  };

  if (paymentResult.success) {
    order.paymentStatus = 'paid';
    order.status = 'processing';
    await order.save();
  }

  return paymentResult;
}