import express from 'express';
import {
  getSellerOrders,
  getBuyerOrders,
  getLogisticsOrders,
  getOrder,
  updateOrderStatus,
  assignLogistics,
  verifyPickupOTP,
  verifyDeliveryOTP,
  updateLocation
} from '../controllers/order.controller.js';
import { protect, authorize, isVerified } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get orders based on user type
router.get('/seller', authorize('seller'), getSellerOrders);
router.get('/buyer', authorize('buyer'), getBuyerOrders);
router.get('/logistics', authorize('logistics'), getLogisticsOrders);

// Get single order
router.get('/:id', getOrder);

// Update order status
router.put('/:id/status', updateOrderStatus);

// Logistics assignment and verification
router.put('/:id/assign-logistics', authorize('seller'), isVerified, assignLogistics);
router.put('/:id/verify-pickup', authorize('logistics'), verifyPickupOTP);
router.put('/:id/verify-delivery', authorize('logistics'), verifyDeliveryOTP);
router.put('/:id/update-location', authorize('logistics'), updateLocation);

export default router; 