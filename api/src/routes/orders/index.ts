import { Router } from 'express';
import {
  createOrder,
  getOrder,
  listOrders,
  updateOrder,
  markAsDroppedOff,
  markAsBadDropOff,
  verifyPickupCode,
} from './ordersController.js';
import { validateData } from '../../middlewares/validationMiddleware.js';
import { insertOrderWithItemsSchema, updateOrderSchema } from '../../db/ordersSchema.js';
import { verifyToken } from '../../middlewares/authMiddleware.js';

const router = Router();

router.post(
  '/',
  verifyToken,
  validateData(insertOrderWithItemsSchema),
  createOrder
);

router.get('/', verifyToken, listOrders);
router.get('/:id', verifyToken, getOrder);
router.put('/:id', verifyToken, validateData(updateOrderSchema), updateOrder);

// Fulfillment Routes
router.patch('/:id/drop-off', verifyToken, markAsDroppedOff);
router.patch('/:id/bad-drop-off', verifyToken, markAsBadDropOff);
router.post('/:id/verify-pickup', verifyToken, verifyPickupCode);

export default router;
