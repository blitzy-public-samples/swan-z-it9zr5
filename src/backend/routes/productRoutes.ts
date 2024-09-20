import { Router } from 'express';
import * as productController from 'src/backend/controllers/productController';
import { validateSchema } from 'src/backend/middleware/validateSchema';
import { createProductSchema, updateProductSchema } from 'src/backend/schemas/productSchemas';
import { authenticate } from 'src/backend/middleware/authenticate';
import { authorize } from 'src/backend/middleware/authorize';

const router = Router();

// Create a new product
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateSchema(createProductSchema),
  productController.createProduct
);

// Get a specific product by ID
router.get('/:productId', productController.getProduct);

// Update a product
router.put(
  '/:productId',
  authenticate,
  authorize('admin'),
  validateSchema(updateProductSchema),
  productController.updateProduct
);

// Delete a product
router.delete(
  '/:productId',
  authenticate,
  authorize('admin'),
  productController.deleteProduct
);

// Get all products
router.get('/', productController.getProducts);

// Search products
router.get('/search', productController.searchProducts);

// Get products by style line
router.get('/style-line/:styleLineId', productController.getProductsByStyleLine);

export default router;