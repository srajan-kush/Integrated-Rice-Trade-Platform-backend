import express from 'express';
import {
  createBid,
  getSellerBids,
  getBuyerBids,
  acceptBid,
  rejectBid,
  cancelBid
} from '../controllers/bid.controller.js';
import { protect, authorize, isVerified } from '../middleware/auth.middleware.js';
import { validate, bidValidationRules } from '../middleware/validation.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Buyer routes
router.post(
  '/',
  authorize('buyer'),
  isVerified,
  bidValidationRules.create,
  validate,
  createBid
);
router.get('/buyer', authorize('buyer'), getBuyerBids);
router.put('/:id/cancel', authorize('buyer'), cancelBid);

// Seller routes
router.get('/seller', authorize('seller'), getSellerBids);
router.put('/:id/accept', authorize('seller'), acceptBid);
router.put('/:id/reject', authorize('seller'), rejectBid);

export default router; 