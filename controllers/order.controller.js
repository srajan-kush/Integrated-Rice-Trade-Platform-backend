import Order from '../models/order.model.js';
import LogisticsProvider from '../models/logistics.model.js';
import { ErrorResponse } from '../middleware/error.middleware.js';
import { generateOTP } from '../utils/otp.js';

// Get all orders for a seller
export const getSellerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ seller: req.user.id })
      .populate('buyer', 'name phone')
      .populate('product', 'type')
      .populate('logistics.provider', 'name phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders for a buyer
export const getBuyerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate({
        path: 'seller',
        select: 'name city',
        transform: doc => ({
          ...doc.toObject(),
          name: `${doc.city} Rice Mill #${doc._id.toString().slice(-4)}`
        })
      })
      .populate('product', 'type')
      .populate('logistics.provider', 'name phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders for a logistics provider
export const getLogisticsOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ 'logistics.provider': req.user.id })
      .populate('buyer', 'name phone')
      .populate('seller', 'name phone')
      .populate('product', 'type')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// Get single order
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name phone')
      .populate('seller', 'name city')
      .populate('product', 'type')
      .populate('logistics.provider', 'name phone');

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Check if user is authorized to view this order
    if (![order.buyer.toString(), order.seller.toString(), order.logistics?.provider?.toString()].includes(req.user.id)) {
      return next(new ErrorResponse('Not authorized to view this order', 403));
    }

    // Anonymize seller information for buyer
    if (req.userType === 'buyer') {
      order.seller.name = `${order.seller.city} Rice Mill #${order.seller._id.toString().slice(-4)}`;
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Update order status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Check authorization based on status update
    if (status === 'cancelled') {
      if (![order.buyer.toString(), order.seller.toString()].includes(req.user.id)) {
        return next(new ErrorResponse('Not authorized to cancel this order', 403));
      }
    } else if (status === 'processing' || status === 'in_transit') {
      if (order.logistics?.provider?.toString() !== req.user.id) {
        return next(new ErrorResponse('Not authorized to update this order status', 403));
      }
    }

    order.status = status;
    await order.save();

    // Emit socket events
    req.io.to(`buyer_${order.buyer}`).emit('orderStatusUpdated', { order });
    req.io.to(`seller_${order.seller}`).emit('orderStatusUpdated', { order });
    if (order.logistics?.provider) {
      req.io.to(`logistics_${order.logistics.provider}`).emit('orderStatusUpdated', { order });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Assign logistics provider
export const assignLogistics = async (req, res, next) => {
  try {
    const { providerId, vehicleNumber } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Check if user is the seller
    if (order.seller.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to assign logistics for this order', 403));
    }

    // Check if logistics provider exists
    const provider = await LogisticsProvider.findById(providerId);
    if (!provider) {
      return next(new ErrorResponse('Logistics provider not found', 404));
    }

    // Find the vehicle
    const vehicle = provider.vehicles.find(v => v.vehicleNumber === vehicleNumber);
    if (!vehicle) {
      return next(new ErrorResponse('Vehicle not found', 404));
    }

    // Generate OTPs
    const pickupOTP = generateOTP();
    const deliveryOTP = generateOTP();

    // Update order with logistics information
    order.logistics = {
      provider: providerId,
      vehicleNumber,
      driverName: vehicle.driver.name,
      driverPhone: vehicle.driver.phone,
      pickupOTP,
      deliveryOTP
    };
    order.status = 'processing';
    await order.save();

    // Update vehicle availability
    vehicle.isAvailable = false;
    await provider.save();

    // Emit socket events
    req.io.to(`logistics_${providerId}`).emit('newOrderAssigned', { order });
    req.io.to(`buyer_${order.buyer}`).emit('logisticsAssigned', { order });

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Verify pickup OTP
export const verifyPickupOTP = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Check if user is the logistics provider
    if (order.logistics?.provider?.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to verify pickup OTP', 403));
    }

    if (order.logistics.pickupOTP !== otp) {
      return next(new ErrorResponse('Invalid OTP', 400));
    }

    order.status = 'in_transit';
    await order.save();

    // Emit socket events
    req.io.to(`buyer_${order.buyer}`).emit('orderInTransit', { order });
    req.io.to(`seller_${order.seller}`).emit('orderInTransit', { order });

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Verify delivery OTP
export const verifyDeliveryOTP = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Check if user is the logistics provider
    if (order.logistics?.provider?.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to verify delivery OTP', 403));
    }

    if (order.logistics.deliveryOTP !== otp) {
      return next(new ErrorResponse('Invalid OTP', 400));
    }

    order.status = 'delivered';
    order.logistics.actualDeliveryTime = Date.now();
    await order.save();

    // Update vehicle availability
    const provider = await LogisticsProvider.findById(order.logistics.provider);
    const vehicle = provider.vehicles.find(v => v.vehicleNumber === order.logistics.vehicleNumber);
    if (vehicle) {
      vehicle.isAvailable = true;
      await provider.save();
    }

    // Emit socket events
    req.io.to(`buyer_${order.buyer}`).emit('orderDelivered', { order });
    req.io.to(`seller_${order.seller}`).emit('orderDelivered', { order });

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Update logistics location
export const updateLocation = async (req, res, next) => {
  try {
    const { coordinates } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Check if user is the logistics provider
    if (order.logistics?.provider?.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to update location', 403));
    }

    order.logistics.currentLocation = {
      type: 'Point',
      coordinates
    };
    await order.save();

    // Emit socket events
    req.io.to(`buyer_${order.buyer}`).emit('locationUpdated', {
      orderId: order._id,
      location: coordinates
    });
    req.io.to(`seller_${order.seller}`).emit('locationUpdated', {
      orderId: order._id,
      location: coordinates
    });

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
}; 