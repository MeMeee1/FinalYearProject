
import { Router } from 'express';
import { uploadImage } from './uploadController.js';
import upload from '../../middlewares/uploadMiddleware.js';

const router = Router();

// POST /upload/image
// Expects a field named 'image' in the form-data
// POST /upload/image
// Expects a field named 'image' in the form-data
router.post('/image', upload.single('image'), uploadImage);

// POST /upload/video
// Expects a field named 'video' in the form-data
router.post('/video', upload.single('video'), uploadImage);

export default router;
