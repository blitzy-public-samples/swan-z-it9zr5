import { Request, Response, NextFunction } from 'express';
import * as userService from 'src/backend/services/userService';
import { ApiError } from 'src/backend/utils/ApiError';
import { catchAsync } from 'src/backend/utils/catchAsync';
import { validateSchema } from 'src/backend/middleware/validateSchema';
import { updateUserSchema, updateStyleProfileSchema } from 'src/backend/schemas/userSchemas';

export const getUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.id; // Assuming the user ID is attached to the request by authentication middleware
  const user = await userService.getUserById(userId);
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

export const updateUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.id;
  const updateData = req.body;

  const updatedUser = await userService.updateUserProfile(userId, updateData);

  res.status(200).json({
    success: true,
    data: updatedUser
  });
});

export const updateUserStyleProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.id;
  const styleProfileData = req.body;

  const updatedStyleProfile = await userService.updateUserStyleProfile(userId, styleProfileData);

  res.status(200).json({
    success: true,
    data: updatedStyleProfile
  });
});

export const deleteUserAccount = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.id;

  await userService.deleteUser(userId);

  res.status(200).json({
    success: true,
    message: 'User account has been successfully deleted'
  });
});

// Apply schema validation middleware
updateUserProfile.use(validateSchema(updateUserSchema));
updateUserStyleProfile.use(validateSchema(updateStyleProfileSchema));