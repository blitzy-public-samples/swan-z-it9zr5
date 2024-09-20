import mongoose from 'mongoose';
import { User } from './User';
import { Product } from './Product';
import { CustomDesign } from './CustomDesign';

// Interfaces
interface IOrder extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: string;
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: Date;
  updatedAt: Date;
  calculateTotalAmount: () => number;
  updateOrderStatus: (newStatus: string) => Promise<IOrder>;
}

interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  customDesign?: mongoose.Types.ObjectId;
}

interface IShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Schema
const orderSchema = new mongoose.Schema<IOrder>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      customDesign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CustomDesign'
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending"
  },
  shippingAddress: {
    fullName: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  }
}, { timestamps: true });

// Methods
orderSchema.methods.calculateTotalAmount = function(): number {
  return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

orderSchema.methods.updateOrderStatus = async function(newStatus: string): Promise<IOrder> {
  if (!["pending", "processing", "shipped", "delivered", "cancelled"].includes(newStatus)) {
    throw new Error('Invalid order status');
  }
  this.status = newStatus;
  return await this.save();
};

// Export the model
export const Order = mongoose.model<IOrder>('Order', orderSchema);