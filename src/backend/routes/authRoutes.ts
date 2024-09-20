import { Router } from 'express';
import * as authController from 'src/backend/controllers/authController';
import { validateSchema } from 'src/backend/middleware/validateSchema';
import { registrationSchema, loginSchema } from 'src/backend/schemas/authSchemas';

const router = Router();

// Registration route
router.post('/register', validateSchema(registrationSchema), authController.register);

// Login route
router.post('/login', validateSchema(loginSchema), authController.login);

// Logout route
router.post('/logout', authController.logout);

// Refresh token route
router.post('/refresh-token', authController.refreshToken);

// Forgot password route
router.post('/forgot-password', authController.forgotPassword);

// Reset password route
router.post('/reset-password', authController.resetPassword);

// TODO: Implement rate limiting middleware
// TODO: Implement CSRF protection
// TODO: Add error handling middleware
// TODO: Consider adding OAuth routes
// TODO: Ensure sensitive routes are protected
// TODO: Add documentation comments
// TODO: Implement logging middleware
// TODO: Consider adding email verification route

export default router;