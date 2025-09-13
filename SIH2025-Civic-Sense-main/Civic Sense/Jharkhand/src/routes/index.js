import { Router } from 'express';
import authRoutes from './authRoutes.js';
import reportRoutes from './reportRoutes.js';
import insightRoutes from './insightRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/reports', reportRoutes);
router.use('/insights', insightRoutes); // ✅ add insights

export default router;
