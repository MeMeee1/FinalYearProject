import { Router } from 'express';
import {
  listVendors,
  getVendorById,
  getVendorProfile,
  createVendor,
  updateVendor,
  getVendorStats,
} from './vendorsController.js';
import { validateData } from '../../middlewares/validationMiddleware.js';
import { createVendorSchema, updateVendorSchema } from '../../db/vendorsSchema.js';
import { verifySeller, verifyToken } from '../../middlewares/authMiddleware.js';
import { debugVendors } from './vendorsController.js';
const router = Router();

// Public routes
router.get('/', listVendors);
router.get('/by-id/:id', getVendorById);
router.get('/debug', debugVendors);
router.post('/', verifyToken, validateData(createVendorSchema), createVendor);
// Protected routes (vendor/admin)
router.get('/profile/me', verifyToken, verifySeller, getVendorProfile);
router.get('/stats/me', verifyToken, verifySeller, getVendorStats);

router.put('/profile/me', verifyToken, verifySeller, validateData(updateVendorSchema), updateVendor);

export default router;
