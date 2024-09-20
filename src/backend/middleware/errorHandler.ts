import { Request, Response, NextFunction } from 'express';
import { ApiError } from 'src/backend/utils/ApiError';
import { logger } from 'src/backend/utils/logger';
import { NODE_ENV } from 'src/backend/config/env';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  logger.error('Error:', err);

  // Determine if the error is an instance of ApiError
  let apiError: ApiError;
  if (err instanceof ApiError) {
    apiError = err;
  } else {
    apiError = new ApiError(500, 'Internal Server Error');
  }

  // Set the response status code
  res.status(apiError.statusCode);

  // Prepare the error response object
  const errorResponse = {
    success: false,
    message: apiError.message,
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  };

  // Send the JSON error response to the client
  res.json(errorResponse);
};