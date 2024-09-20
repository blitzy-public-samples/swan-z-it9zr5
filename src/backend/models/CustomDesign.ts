import mongoose, { Document, Schema } from 'mongoose';
import { User } from './User';
import { Product } from './Product';
import { imageGenerationService } from '../services/imageGenerationService';

export interface IDesignElement {
  type: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  fontFamily?: string;
}

export interface ICustomDesign extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  name: string;
  designElements: IDesignElement[];
  previewImage: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  generatePreviewImage(): Promise<string>;
}

const customDesignSchema = new Schema<ICustomDesign>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    designElements: {
      type: [Object],
      required: true,
      validate: [
        {
          validator: (elements: IDesignElement[]) => elements.length > 0,
          message: 'At least one design element is required',
        },
      ],
    },
    previewImage: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes
customDesignSchema.index({ user: 1, product: 1 });
customDesignSchema.index({ isPublic: 1 });

customDesignSchema.methods.generatePreviewImage = async function(): Promise<string> {
  try {
    const product = await Product.findById(this.product);
    if (!product) {
      throw new Error('Associated product not found');
    }

    const previewImageUrl = await imageGenerationService.generatePreviewImage(
      product.images[0],
      this.designElements
    );

    this.previewImage = previewImageUrl;
    await this.save();

    return previewImageUrl;
  } catch (error) {
    console.error('Error generating preview image:', error);
    throw error;
  }
};

// Middleware to generate preview image on save
customDesignSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('designElements')) {
    try {
      await this.generatePreviewImage();
    } catch (error) {
      return next(error);
    }
  }
  next();
});

export const CustomDesign = mongoose.model<ICustomDesign>('CustomDesign', customDesignSchema);