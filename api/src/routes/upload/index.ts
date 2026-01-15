
import { Router } from 'express';
import { uploadImage } from './uploadController.js';
import upload from '../../middlewares/uploadMiddleware.js';

const router = Router();

// POST /upload/image
// Expects a field named 'image' in the form-data
router.post('/image', upload.single('image'), uploadImage);

export default router;
