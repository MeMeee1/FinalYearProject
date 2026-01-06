import { Router } from 'express';
import {
  listPendingVendors,
  approveVendor,
  rejectVendor,
  suspendVendor,
  getVendorAnalytics,
  getPlatformStats,
} from './vendorManagementController.js';
import { verifyAdmin, verifyToken } from '../../middlewares/authMiddleware.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(verifyToken, verifyAdmin);

router.get('/vendors/pending', listPendingVendors);
router.post('/vendors/:vendorId/approve', approveVendor);
router.post('/vendors/:vendorId/reject', rejectVendor);
router.post('/vendors/:vendorId/suspend', suspendVendor);
router.get('/vendors/:vendorId/analytics', getVendorAnalytics);
router.get('/platform/stats', getPlatformStats);

export default router;
