import { Router } from 'express';
import {
  listPendingVendors,
  listSuspendedVendors,
  approveVendor,
  rejectVendor,
  suspendVendor,
  getVendorAnalytics,
  getPlatformStats,
  updatePlatformCommission,
} from './vendorManagementController.js';
import { verifyAdmin, verifyToken } from '../../middlewares/authMiddleware.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(verifyToken, verifyAdmin);

router.get('/vendors/pending', listPendingVendors);
router.get('/vendors/suspended', listSuspendedVendors);
router.post('/vendors/:vendorId/approve', approveVendor);
router.post('/vendors/:vendorId/reject', rejectVendor);
router.post('/vendors/:vendorId/suspend', suspendVendor);
router.get('/vendors/:vendorId/analytics', getVendorAnalytics);
router.get('/platform/stats', getPlatformStats);
router.put('/platform/commission', updatePlatformCommission);

export default router;
