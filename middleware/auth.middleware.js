import jwt from 'jsonwebtoken';
import Seller from '../models/seller.model.js';
import Buyer from '../models/buyer.model.js';
import LogisticsProvider from '../models/logistics.model.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from cookies
    token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check user type and attach to request
    let user;
    if (decoded.type === 'seller') {
      user = await Seller.findById(decoded.id).select('-password');
    } else if (decoded.type === 'buyer') {
      user = await Buyer.findById(decoded.id).select('-password');
    } else if (decoded.type === 'logistics') {
      user = await LogisticsProvider.findById(decoded.id).select('-password');
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    req.userType = decoded.type;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userType)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.userType} is not authorized to access this route`
      });
    }
    next();
  };
};

export const isVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Account is not verified. Please verify your account to proceed.'
    });
  }
  next();
}; 