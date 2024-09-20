import { Router } from 'express';
import { getProfile, updateProfile, getStyleProfile, updateStyleProfile, getOrderHistory, getSavedDesigns } from '../controllers/userController';
import { authenticateUser } from '../middleware/auth';
import { validateProfileUpdate, validateStyleProfileUpdate } from '../middleware/validation';

const router = Router();

function setupUserRoutes(): Router {
  // User profile routes
  router.get('/profile', authenticateUser, getProfile);
  router.put('/profile', authenticateUser, validateProfileUpdate, updateProfile);

  // Style profile routes
  router.get('/style-profile', authenticateUser, getStyleProfile);
  router.put('/style-profile', authenticateUser, validateStyleProfileUpdate, updateStyleProfile);

  // Order history route
  router.get('/order-history', authenticateUser, getOrderHistory);

  // Saved designs route
  router.get('/saved-designs', authenticateUser, getSavedDesigns);

  return router;
}

export default setupUserRoutes;

// TODO: Implement rate limiting for API endpoints to prevent abuse
// TODO: Add pagination to order history and saved designs endpoints for better performance with large datasets
// TODO: Implement caching strategy for frequently accessed user data
// TODO: Add logging for all route accesses for monitoring and debugging purposes