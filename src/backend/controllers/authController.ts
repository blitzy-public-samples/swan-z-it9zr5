import { Request, Response, NextFunction } from 'express';
import * as userService from 'src/backend/services/userService';
import { ApiError } from 'src/backend/utils/ApiError';
import { catchAsync } from 'src/backend/utils/catchAsync';
import { validateSchema } from 'src/backend/middleware/validateSchema';
import { registrationSchema, loginSchema } from 'src/backend/schemas/authSchemas';

export const register = catchAsync(
  validateSchema(registrationSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userData = req.body;
    const { user, token } = await userService.createUser(userData);
    res.status(201).json({ user, token });
  }
);

export const login = catchAsync(
  validateSchema(loginSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
    const { user, token } = await userService.authenticateUser(email, password);
    res.status(200).json({ user, token });
  }
);

export const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user.id; // Assuming user ID is attached to req by auth middleware
    await userService.invalidateUserToken(userId);
    res.status(200).json({ message: 'Logged out successfully' });
  }
);

export const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const refreshToken = req.body.refreshToken;
    const newAccessToken = await userService.refreshAccessToken(refreshToken);
    res.status(200).json({ accessToken: newAccessToken });
  }
);

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email } = req.body;
    await userService.generatePasswordResetToken(email);
    res.status(200).json({ message: 'Password reset instructions sent to email' });
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { resetToken, newPassword } = req.body;
    await userService.resetPassword(resetToken, newPassword);
    res.status(200).json({ message: 'Password reset successful' });
  }
);

// Human tasks:
// TODO: Implement rate limiting for login and registration endpoints
// TODO: Add CAPTCHA verification for registration and password reset
// TODO: Implement IP-based blocking for suspicious activity
// TODO: Add support for multi-factor authentication
// TODO: Implement secure password rules and strength meter
// TODO: Add logging for all authentication events
// TODO: Implement account lockout mechanism after multiple failed login attempts
// TODO: Add support for social media authentication
// TODO: Implement proper error messages that don't reveal sensitive information
// TODO: Add unit tests for all authentication controller functions