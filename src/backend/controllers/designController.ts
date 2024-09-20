import { Request, Response, NextFunction } from 'express';
import * as designService from 'src/backend/services/designService';
import { ApiError } from 'src/backend/utils/ApiError';
import { catchAsync } from 'src/backend/utils/catchAsync';
import { validateSchema } from 'src/backend/middleware/validateSchema';
import { createDesignSchema, updateDesignSchema } from 'src/backend/schemas/designSchemas';
import { PaginationOptions } from 'src/shared/types/index';

export const createDesign = catchAsync(
  validateSchema(createDesignSchema),
  async (req: Request, res: Response) => {
    const designData = req.body;
    const userId = req.user.id; // Assuming user ID is attached to req.user by auth middleware
    const newDesign = await designService.createDesign(userId, designData);
    res.status(201).json({ success: true, data: newDesign });
  }
);

export const getDesign = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const designId = req.params.designId;
  const userId = req.user.id;
  const design = await designService.getDesignById(designId);

  if (!design) {
    return next(new ApiError(404, 'Design not found'));
  }

  if (design.userId !== userId && !design.isPublic) {
    return next(new ApiError(403, 'Unauthorized access to design'));
  }

  res.status(200).json({ success: true, data: design });
});

export const updateDesign = catchAsync(
  validateSchema(updateDesignSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const designId = req.params.designId;
    const updateData = req.body;
    const userId = req.user.id;

    const updatedDesign = await designService.updateDesign(designId, userId, updateData);

    if (!updatedDesign) {
      return next(new ApiError(404, 'Design not found or unauthorized'));
    }

    res.status(200).json({ success: true, data: updatedDesign });
  }
);

export const deleteDesign = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const designId = req.params.designId;
  const userId = req.user.id;

  const result = await designService.deleteDesign(designId, userId);

  if (!result) {
    return next(new ApiError(404, 'Design not found or unauthorized'));
  }

  res.status(200).json({ success: true, message: 'Design deleted successfully' });
});

export const getUserDesigns = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const paginationOptions: PaginationOptions = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
  };

  const { designs, totalCount } = await designService.getUserDesigns(userId, paginationOptions);

  res.status(200).json({
    success: true,
    data: designs,
    pagination: {
      currentPage: paginationOptions.page,
      totalPages: Math.ceil(totalCount / paginationOptions.limit),
      totalCount,
    },
  });
});

export const generatePreviewImage = catchAsync(async (req: Request, res: Response) => {
  const designData = req.body;
  const previewImageUrl = await designService.generatePreviewImage(designData);
  res.status(200).json({ success: true, data: { previewImageUrl } });
});