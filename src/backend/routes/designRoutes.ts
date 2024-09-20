import { Router } from 'express';
import * as designController from 'src/backend/controllers/designController';
import { validateSchema } from 'src/backend/middleware/validateSchema';
import { createDesignSchema, updateDesignSchema } from 'src/backend/schemas/designSchemas';
import { authenticate } from 'src/backend/middleware/authenticate';

const router = Router();

// Create a new design
router.post('/', authenticate, validateSchema(createDesignSchema), designController.createDesign);

// Get a specific design
router.get('/:designId', authenticate, designController.getDesign);

// Update a design
router.put('/:designId', authenticate, validateSchema(updateDesignSchema), designController.updateDesign);

// Delete a design
router.delete('/:designId', authenticate, designController.deleteDesign);

// Get all designs for the authenticated user
router.get('/user', authenticate, designController.getUserDesigns);

// Generate a preview image for a design
router.post('/preview', authenticate, designController.generatePreviewImage);

export default router;