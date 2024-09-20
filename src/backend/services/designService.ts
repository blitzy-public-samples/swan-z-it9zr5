import { CustomDesign, ICustomDesign } from '../models/CustomDesign';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { ApiError } from '../utils/ApiError';
import { PaginationOptions } from '../../shared/types/index';
import { imageGenerationService } from './imageGenerationService';

export const createDesign = async (designData: any): Promise<ICustomDesign> => {
  try {
    // Validate design data
    if (!designData.userId || !designData.productId || !designData.designElements) {
      throw new ApiError(400, 'Invalid design data');
    }

    // Check if user exists
    const user = await User.findById(designData.userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Check if product exists and is customizable
    const product = await Product.findById(designData.productId);
    if (!product || !product.isCustomizable) {
      throw new ApiError(400, 'Invalid product or product is not customizable');
    }

    // Generate preview image
    const previewImageUrl = await generatePreviewImage(designData);

    // Create new CustomDesign document
    const newDesign = new CustomDesign({
      ...designData,
      previewImage: previewImageUrl
    });

    // Save the new design
    await newDesign.save();

    return newDesign;
  } catch (error) {
    throw new ApiError(500, 'Error creating custom design', error);
  }
};

export const getDesignById = async (designId: string): Promise<ICustomDesign> => {
  try {
    const design = await CustomDesign.findById(designId);
    if (!design) {
      throw new ApiError(404, 'Design not found');
    }
    return design;
  } catch (error) {
    throw new ApiError(500, 'Error retrieving custom design', error);
  }
};

export const updateDesign = async (designId: string, updateData: any): Promise<ICustomDesign> => {
  try {
    const design = await CustomDesign.findById(designId);
    if (!design) {
      throw new ApiError(404, 'Design not found');
    }

    // Validate update data
    if (updateData.userId || updateData.productId) {
      throw new ApiError(400, 'Cannot update user or product for existing design');
    }

    // If design elements are updated, generate new preview image
    if (updateData.designElements) {
      updateData.previewImage = await generatePreviewImage(updateData);
    }

    // Update custom design document
    Object.assign(design, updateData);
    await design.save();

    return design;
  } catch (error) {
    throw new ApiError(500, 'Error updating custom design', error);
  }
};

export const deleteDesign = async (designId: string): Promise<void> => {
  try {
    const design = await CustomDesign.findById(designId);
    if (!design) {
      throw new ApiError(404, 'Design not found');
    }

    // Delete custom design document
    await design.remove();

    // Remove associated preview image from storage
    // TODO: Implement removal of preview image from cloud storage

    // Handle any related data cleanup (e.g., remove from orders)
    // TODO: Implement cleanup of related data

  } catch (error) {
    throw new ApiError(500, 'Error deleting custom design', error);
  }
};

export const getUserDesigns = async (userId: string, options: PaginationOptions): Promise<{ designs: ICustomDesign[]; total: number }> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [designs, total] = await Promise.all([
      CustomDesign.find({ userId }).skip(skip).limit(limit),
      CustomDesign.countDocuments({ userId })
    ]);

    return { designs, total };
  } catch (error) {
    throw new ApiError(500, 'Error retrieving user designs', error);
  }
};

export const generatePreviewImage = async (designData: any): Promise<string> => {
  try {
    // Validate design data
    if (!designData.designElements) {
      throw new ApiError(400, 'Invalid design data for preview generation');
    }

    // Call imageGenerationService to create preview image
    const previewImage = await imageGenerationService.generatePreview(designData.designElements);

    // Upload generated image to cloud storage
    // TODO: Implement upload to cloud storage
    const imageUrl = 'https://example.com/preview-image.jpg'; // Placeholder URL

    return imageUrl;
  } catch (error) {
    throw new ApiError(500, 'Error generating preview image', error);
  }
};