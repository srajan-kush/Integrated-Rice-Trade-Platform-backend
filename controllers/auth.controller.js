import jwt from 'jsonwebtoken';
import { ErrorResponse } from '../middleware/error.middleware.js';
import Seller from '../models/seller.model.js';
import Buyer from '../models/buyer.model.js';
import LogisticsProvider from '../models/logistics.model.js';

// Helper function to create and send token response
const sendTokenResponse = (user, userType, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, type: userType },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  user.password = undefined;

  res
    .status(statusCode)
    .cookie('jwt', token, options)
    .json({
      success: true,
      token,
      data: user
    });
};

// Register seller
export const registerSeller = async (req, res, next) => {
  try {
    const { name, email, password, city, location, phone } = req.body;

    const seller = await Seller.create({
      name,
      email,
      password,
      city,
      location,
      phone
    });

    sendTokenResponse(seller, 'seller', 201, res);
  } catch (error) {
    next(error);
  }
};

// Register buyer
export const registerBuyer = async (req, res, next) => {
  try {
    const { name, phone, password, location } = req.body;

    const buyer = await Buyer.create({
      name,
      phone,
      password,
      location
    });

    sendTokenResponse(buyer, 'buyer', 201, res);
  } catch (error) {
    next(error);
  }
};

// Register logistics provider
export const registerLogistics = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const logistics = await LogisticsProvider.create({
      name,
      email,
      password,
      phone,
      address
    });

    sendTokenResponse(logistics, 'logistics', 201, res);
  } catch (error) {
    next(error);
  }
};

// Login seller
export const loginSeller = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorResponse('Please provide email and password', 400));
    }

    const seller = await Seller.findOne({ email });

    if (!seller) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isMatch = await seller.comparePassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(seller, 'seller', 200, res);
  } catch (error) {
    next(error);
  }
};

// Login buyer
export const loginBuyer = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return next(new ErrorResponse('Please provide phone and password', 400));
    }

    const buyer = await Buyer.findOne({ phone });

    if (!buyer) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isMatch = await buyer.comparePassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(buyer, 'buyer', 200, res);
  } catch (error) {
    next(error);
  }
};

// Login logistics provider
export const loginLogistics = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorResponse('Please provide email and password', 400));
    }

    const logistics = await LogisticsProvider.findOne({ email });

    if (!logistics) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isMatch = await logistics.comparePassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(logistics, 'logistics', 200, res);
  } catch (error) {
    next(error);
  }
};

// Get current logged in user
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
};

// Logout user
export const logout = async (req, res) => {
  res.cookie('jwt', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Successfully logged out'
  });
}; 