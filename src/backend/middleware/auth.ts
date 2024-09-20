import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from 'src/backend/models/User';
import { ApiError } from 'src/backend/utils/ApiError';
import { JWT_SECRET } from 'src/backend/config/env';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Authentication token is required');
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(401, 'Invalid token'));
    } else {
      next(error);
    }
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'User not authenticated'));
    }

    if (!roles.some(role => req.user.roles.includes(role))) {
      return next(new ApiError(403, 'User not authorized for this action'));
    }

    next();
  };
};