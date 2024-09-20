import mongoose, { Document, Schema } from 'mongoose';
import { StyleLine } from './StyleLine';

export interface IProduct extends Document {
  name: string;
  basePrice: number;
  description: string;
  images: string[];
  styleLine: mongoose.Types.ObjectId;
  sizes: string[];
  colors: string[];
  isCustomizable: boolean;
  stockQuantity: number;
  createdAt: Date;
  updatedAt: Date;
  calculateDiscountedPrice(discountPercentage: number): number;
}

const productSchema: Schema<IProduct> = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  styleLine: {
    type: Schema.Types.ObjectId,
    ref: 'StyleLine',
    required: true,
  },
  sizes: {
    type: [String],
    required: true,
  },
  colors: {
    type: [String],
    required: true,
  },
  isCustomizable: {
    type: Boolean,
    default: false,
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
}, {
  timestamps: true,
});

productSchema.methods.calculateDiscountedPrice = function(discountPercentage: number): number {
  const discountAmount = this.basePrice * (discountPercentage / 100);
  return this.basePrice - discountAmount;
};

export const Product = mongoose.model<IProduct>('Product', productSchema);