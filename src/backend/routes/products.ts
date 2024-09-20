import { Router } from 'express';
import { getProducts, getProductById, getRecommendedProducts, searchProducts } from '../controllers/productController';
import { authenticateUser } from '../middleware/auth';
import { validateProductQuery, validateProductId } from '../middleware/validation';

const router = Router();

const setupProductRoutes = (): Router => {
  // GET route for retrieving product listings
  router.get('/', authenticateUser, validateProductQuery, getProducts);

  // GET route for retrieving a specific product by ID
  router.get('/:id', authenticateUser, validateProductId, getProductById);

  // GET route for retrieving recommended products
  router.get('/recommended', authenticateUser, getRecommendedProducts);

  // GET route for searching products
  router.get('/search', authenticateUser, validateProductQuery, searchProducts);

  return router;
};

export default setupProductRoutes;