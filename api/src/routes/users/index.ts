
import { Router } from 'express';
import { getUserProfile, updateUserProfile } from './usersController.js';
import { verifyToken } from '../../middlewares/authMiddleware.js';

const router = Router();

router.get('/me', verifyToken, getUserProfile);
router.put('/me', verifyToken, updateUserProfile);

export default router;
