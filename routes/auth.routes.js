import express from 'express';
import {
  registerSeller,
  registerBuyer,
  registerLogistics,
  loginSeller,
  loginBuyer,
  loginLogistics,
  getMe,
  logout
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import {
  validate,
  sellerValidationRules,
  buyerValidationRules,
  logisticsValidationRules
} from '../middleware/validation.middleware.js';

const router = express.Router();

// Seller routes
router.post('/seller/register', sellerValidationRules.register, validate, registerSeller);
router.post('/seller/login', sellerValidationRules.login, validate, loginSeller);

// Buyer routes
router.post('/buyer/register', buyerValidationRules.register, validate, registerBuyer);
router.post('/buyer/login', buyerValidationRules.login, validate, loginBuyer);

// Logistics routes
router.post('/logistics/register', logisticsValidationRules.register, validate, registerLogistics);
router.post('/logistics/login', sellerValidationRules.login, validate, loginLogistics);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router; 