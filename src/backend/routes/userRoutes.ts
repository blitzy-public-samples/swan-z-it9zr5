import { Router } from 'express';
import * as userController from 'src/backend/controllers/userController';
import { validateSchema } from 'src/backend/middleware/validateSchema';
import { updateUserSchema, updateStyleProfileSchema } from 'src/backend/schemas/userSchemas';
import { authenticate } from 'src/backend/middleware/authenticate';

const router = Router();

// Get user profile
router.get('/profile', authenticate, userController.getUserProfile);

// Update user profile
router.put('/profile', authenticate, validateSchema(updateUserSchema), userController.updateUserProfile);

// Update user style profile
router.put('/style-profile', authenticate, validateSchema(updateStyleProfileSchema), userController.updateUserStyleProfile);

// Delete user account
router.delete('/account', authenticate, userController.deleteUserAccount);

export default router;