import { Router } from 'express';
import { protect, restrictTo } from '../middlewares/auth.js';
import { upload } from '../middlewares/multer.js';
import { createReport, getReports, getReportById, updateReportStatus } from '../controllers/reportController.js';


const router = Router();


// Citizens create report (image optional)
router.post('/', protect, upload.single('image'), createReport);


// List & read
router.get('/', protect, getReports);
router.get('/:id', protect, getReportById);


// Staff/Admin update status/assignment
router.patch('/:id/status', protect, restrictTo('staff', 'admin'), updateReportStatus);


export default router;