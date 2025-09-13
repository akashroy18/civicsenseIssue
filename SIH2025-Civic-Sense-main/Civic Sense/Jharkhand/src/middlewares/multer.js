import multer from 'multer';
import AppError from '../utils/AppError.js';


const storage = multer.memoryStorage();


function fileFilter(req, file, cb) {
if (file.mimetype.startsWith('image/')) cb(null, true);
else cb(new AppError('Only image files are allowed.', 400));
}


export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });