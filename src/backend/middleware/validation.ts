import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { StatusCodes } from 'http-status-codes';
import logger from '../utils/logger';

export const validateRequest = (schema: ObjectSchema, property: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate = req[property as keyof Request];
    const { error } = schema.validate(dataToValidate);

    if (error) {
      logger.error(`Validation error: ${error.details[0].message}`);
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Validation Error',
        details: error.details[0].message
      });
    }

    next();
  };
};

// TODO: Implement specific Joi schemas for different API endpoints
// TODO: Add unit tests for the validation middleware
// TODO: Consider adding custom error messages for common validation errors