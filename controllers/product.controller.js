import Product from '../models/product.model.js';
import { ErrorResponse } from '../middleware/error.middleware.js';

// Create a new product
export const createProduct = async (req, res, next) => {
  try {
    req.body.seller = req.user.id;
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Get all products with filters
export const getProducts = async (req, res, next) => {
  try {
    const { type, minPrice, maxPrice, isAvailable } = req.query;
    const query = {};

    // Add filters if they exist
    if (type) {
      query.type = { $regex: type, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.pricePerTon = {};
      if (minPrice) query.pricePerTon.$gte = Number(minPrice);
      if (maxPrice) query.pricePerTon.$lte = Number(maxPrice);
    }

    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    const products = await Product.find(query)
      .populate('seller', 'name city location')
      .sort('-createdAt');

    // Anonymize seller information for buyers
    if (req.userType === 'buyer') {
      products.forEach(product => {
        if (product.seller) {
          product.seller.name = `${product.seller.city} Rice Mill #${product.seller._id.toString().slice(-4)}`;
        }
      });
    }

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Get products by seller
export const getSellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user.id })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Get single product
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name city location');

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Anonymize seller information for buyers
    if (req.userType === 'buyer' && product.seller) {
      product.seller.name = `${product.seller.city} Rice Mill #${product.seller._id.toString().slice(-4)}`;
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Update product
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Make sure user is product seller
    if (product.seller.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to update this product', 403));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Make sure user is product seller
    if (product.seller.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to delete this product', 403));
    }

    await product.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// Get nearby products
export const getNearbyProducts = async (req, res, next) => {
  try {
    const { longitude, latitude, maxDistance = 100000 } = req.query; // maxDistance in meters, default 100km

    if (!longitude || !latitude) {
      return next(new ErrorResponse('Please provide longitude and latitude', 400));
    }

    const products = await Product.find({
      'seller.location': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      isAvailable: true
    }).populate('seller', 'name city location');

    // Anonymize seller information
    products.forEach(product => {
      if (product.seller) {
        product.seller.name = `${product.seller.city} Rice Mill #${product.seller._id.toString().slice(-4)}`;
      }
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
}; 