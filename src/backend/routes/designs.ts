import { Router } from 'express';
import { createDesign, getDesign, updateDesign, deleteDesign, getUserDesigns, generateAIDesign } from '../controllers/designController';
import { authenticateUser } from '../middleware/auth';
import { validateDesignInput } from '../middleware/validation';

const router = Router();

// Create a new custom design
router.post('/', authenticateUser, validateDesignInput, createDesign);

// Get a specific design by ID
router.get('/:id', authenticateUser, getDesign);

// Update an existing design
router.put('/:id', authenticateUser, validateDesignInput, updateDesign);

// Delete a design
router.delete('/:id', authenticateUser, deleteDesign);

// Get all designs for a user
router.get('/user/:userId', authenticateUser, getUserDesigns);

// Generate an AI design based on user input
router.post('/generate', authenticateUser, generateAIDesign);

export default router;