import { Router } from 'express';
import {
    getKeys,
    initializeTransaction,
    verifyTransaction,
    handleWebhook,
    getEscrowStatus,
} from './paystackController.js';
import { verifyToken } from '../../middlewares/authMiddleware.js';

const router = Router();

// Public key for frontend
router.get('/keys', getKeys);

// Initialize transaction (requires auth)
router.post('/initialize', verifyToken, initializeTransaction);

// Verify transaction (requires auth)
router.get('/verify/:reference', verifyToken, verifyTransaction);

// Webhook (no auth - verified by signature)
router.post('/webhook', handleWebhook);

// Get escrow status for an order
router.get('/escrow/:id', verifyToken, getEscrowStatus);

export default router;
