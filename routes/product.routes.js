import express from 'express';
import {
  createProduct,
  getProducts,
  getSellerProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getNearbyProducts
} from '../controllers/product.controller.js';
import { protect, authorize, isVerified } from '../middleware/auth.middleware.js';
import { validate, productValidationRules } from '../middleware/validation.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/nearby', getNearbyProducts);
router.get('/:id', getProduct);

// Protected routes
router.use(protect);

// Seller routes
router.post(
  '/',
  authorize('seller'),
  isVerified,
  productValidationRules.create,
  validate,
  createProduct
);

router.get('/seller/products', authorize('seller'), getSellerProducts);

router.route('/:id')
  .put(
    authorize('seller'),
    isVerified,
    productValidationRules.update,
    validate,
    updateProduct
  )
  .delete(authorize('seller'), deleteProduct);

export default router; 