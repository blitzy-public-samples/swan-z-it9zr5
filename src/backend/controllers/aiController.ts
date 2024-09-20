import { Request, Response, NextFunction } from 'express';
import { AIService } from 'src/backend/services/aiService';
import { StylePreference, DesignParameters } from 'src/shared/types';
import { logger } from 'src/backend/utils/logger';
import { catchAsync } from 'src/backend/middleware/errorHandler';

const aiService = new AIService();

export const getStyleRecommendations = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.id; // Assuming user ID is attached to req.user by authentication middleware
  const stylePreferences: StylePreference = req.body.stylePreferences;

  const recommendations = await aiService.getStyleRecommendations(userId, stylePreferences);

  logger.info(`Style recommendations retrieved for user ${userId}`);

  res.status(200).json({
    success: true,
    data: recommendations
  });
});

export const generateCustomDesign = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.id; // Assuming user ID is attached to req.user by authentication middleware
  const designParameters: DesignParameters = req.body.designParameters;

  const generatedDesign = await aiService.generateCustomDesign(userId, designParameters);

  logger.info(`Custom design generated for user ${userId}`);

  res.status(200).json({
    success: true,
    data: generatedDesign
  });
});

export const getAIModelStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const modelStatus = await aiService.getModelStatus();

  logger.info('AI model status retrieved');

  res.status(200).json({
    success: true,
    data: modelStatus
  });
});