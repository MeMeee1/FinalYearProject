import { Router } from 'express';
import {
  listProducts,
  getProductById,
  getProductsBySeller,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductCategories
} from './productsController.js';
import { validateData } from '../../middlewares/validationMiddleware.js';

import {
  createProductSchema,
  updateProductSchema,
} from '../../db/productsSchema.js';
import { verifySeller, verifyToken } from '../../middlewares/authMiddleware.js';

const router = Router();

// Public routes
router.get('/', listProducts);
router.get('/categories', getProductCategories);
router.get('/search', searchProducts);
router.get('/seller/:sellerId', getProductsBySeller);
router.get('/:id', getProductById);

// Protected routes (seller/admin only)
router.post(
  '/',
  verifyToken,
  verifySeller,
  validateData(createProductSchema),
  createProduct
);
router.put(
  '/:id',
  verifyToken,
  verifySeller,
  validateData(updateProductSchema),
  updateProduct
);
router.delete('/:id', verifyToken, verifySeller, deleteProduct);

export default router;
