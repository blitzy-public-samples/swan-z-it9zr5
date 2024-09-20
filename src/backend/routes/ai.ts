import { Router } from 'express';
import { styleMatch, generateDesign } from '../controllers/aiController';
import { authenticateUser } from '../middleware/auth';
import { validateStyleMatchInput, validateDesignGenerationInput } from '../middleware/validation';

const router = Router();

router.post('/style-match', authenticateUser, validateStyleMatchInput, async (req, res, next) => {
  try {
    const userPreferences = req.body;
    const styleMatchResults = await styleMatch(userPreferences);
    res.json(styleMatchResults);
  } catch (error) {
    next(error);
  }
});

router.post('/generate-design', authenticateUser, validateDesignGenerationInput, async (req, res, next) => {
  try {
    const designParameters = req.body;
    const generatedDesign = await generateDesign(designParameters);
    res.json(generatedDesign);
  } catch (error) {
    next(error);
  }
});

export default router;