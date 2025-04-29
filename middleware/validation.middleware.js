import { body, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validationRules = {
  register: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required')
  ],
  login: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
  ],
  product: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Product name is required')
      .isLength({ max: 100 })
      .withMessage('Product name cannot be more than 100 characters'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ max: 500 })
      .withMessage('Description cannot be more than 500 characters'),
    body('price')
      .notEmpty()
      .withMessage('Price is required')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('category')
      .trim()
      .notEmpty()
      .withMessage('Category is required')
      .isIn(['Electronics', 'Clothing', 'Food', 'Books', 'Other'])
      .withMessage('Invalid category'),
    body('stock')
      .notEmpty()
      .withMessage('Stock quantity is required')
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer')
  ]
};

export const sellerValidationRules = {
  register: [
    body('name').trim().notEmpty().withMessage('Mill name is required'),
    body('email').trim().isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('location.coordinates')
      .isArray()
      .withMessage('Location coordinates must be an array'),
    body('phone')
      .trim()
      .matches(/^[0-9]{10}$/)
      .withMessage('Please enter a valid 10-digit phone number')
  ],
  login: [
    body('email').trim().isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ]
};

export const buyerValidationRules = {
  register: [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone')
      .trim()
      .matches(/^[0-9]{10}$/)
      .withMessage('Please enter a valid 10-digit phone number'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('location.coordinates')
      .isArray()
      .withMessage('Location coordinates must be an array')
  ],
  login: [
    body('phone')
      .trim()
      .matches(/^[0-9]{10}$/)
      .withMessage('Please enter a valid 10-digit phone number'),
    body('password').notEmpty().withMessage('Password is required')
  ]
};

export const productValidationRules = {
  create: [
    body('type').trim().notEmpty().withMessage('Rice type is required'),
    body('quantity')
      .isNumeric()
      .withMessage('Quantity must be a number')
      .custom(value => value > 0)
      .withMessage('Quantity must be greater than 0'),
    body('pricePerTon')
      .isNumeric()
      .withMessage('Price per ton must be a number')
      .custom(value => value > 0)
      .withMessage('Price per ton must be greater than 0'),
    body('minimumBidPrice')
      .isNumeric()
      .withMessage('Minimum bid price must be a number')
      .custom(value => value > 0)
      .withMessage('Minimum bid price must be greater than 0')
  ],
  update: [
    body('quantity')
      .optional()
      .isNumeric()
      .withMessage('Quantity must be a number')
      .custom(value => value > 0)
      .withMessage('Quantity must be greater than 0'),
    body('pricePerTon')
      .optional()
      .isNumeric()
      .withMessage('Price per ton must be a number')
      .custom(value => value > 0)
      .withMessage('Price per ton must be greater than 0'),
    body('minimumBidPrice')
      .optional()
      .isNumeric()
      .withMessage('Minimum bid price must be a number')
      .custom(value => value > 0)
      .withMessage('Minimum bid price must be greater than 0')
  ]
};

export const bidValidationRules = {
  create: [
    body('productId')
      .isMongoId()
      .withMessage('Invalid product ID'),
    body('quantity')
      .isNumeric()
      .withMessage('Quantity must be a number')
      .custom(value => value > 0)
      .withMessage('Quantity must be greater than 0'),
    body('bidPrice')
      .isNumeric()
      .withMessage('Bid price must be a number')
      .custom(value => value > 0)
      .withMessage('Bid price must be greater than 0')
  ]
};

export const logisticsValidationRules = {
  register: [
    body('name').trim().notEmpty().withMessage('Company name is required'),
    body('email').trim().isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('phone')
      .trim()
      .matches(/^[0-9]{10}$/)
      .withMessage('Please enter a valid 10-digit phone number'),
    body('address.coordinates')
      .isArray()
      .withMessage('Location coordinates must be an array')
  ],
  addVehicle: [
    body('vehicleNumber')
      .trim()
      .notEmpty()
      .withMessage('Vehicle number is required'),
    body('type')
      .isIn(['small', 'medium', 'large'])
      .withMessage('Invalid vehicle type'),
    body('capacity')
      .isNumeric()
      .withMessage('Capacity must be a number')
      .custom(value => value > 0)
      .withMessage('Capacity must be greater than 0'),
    body('driver.name')
      .trim()
      .notEmpty()
      .withMessage('Driver name is required'),
    body('driver.phone')
      .trim()
      .matches(/^[0-9]{10}$/)
      .withMessage('Please enter a valid 10-digit phone number'),
    body('driver.license')
      .trim()
      .notEmpty()
      .withMessage('Driver license number is required')
  ]
}; 