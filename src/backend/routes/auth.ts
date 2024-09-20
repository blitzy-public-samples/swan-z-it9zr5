import { Router } from 'express';
import { register, login, logout, forgotPassword, resetPassword, refreshToken } from '../controllers/authController';
import { validateRegistration, validateLogin, validatePasswordReset } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// User registration route
router.post('/register', validateRegistration, register);

// User login route
router.post('/login', validateLogin, login);

// User logout route
router.post('/logout', authenticateToken, logout);

// Forgot password route
router.post('/forgot-password', forgotPassword);

// Reset password route
router.post('/reset-password', validatePasswordReset, resetPassword);

// Refresh token route
router.post('/refresh-token', refreshToken);

export default router;