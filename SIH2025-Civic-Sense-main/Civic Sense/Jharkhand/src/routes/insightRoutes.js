import { Router } from 'express';
import { protect, restrictTo } from '../middlewares/auth.js';
import { getInsights } from '../controllers/insightController.js';

const router = Router();

// Only admins can view insights
router.get('/', protect, restrictTo('admin'), getInsights);

export default router;
