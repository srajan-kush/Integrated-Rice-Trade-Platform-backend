import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Buyer',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  pricePerTon: {
    type: Number,
    required: [true, 'Price per ton is required'],
    min: [0, 'Price cannot be negative']
  },
  totalAmount: {
    type: Number,
    required: true
  },
  commission: {
    type: Number,
    required: true,
    default: 0
  },
  transportCost: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'paid', 'processing', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  logistics: {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LogisticsProvider'
    },
    vehicleNumber: String,
    driverName: String,
    driverPhone: String,
    pickupOTP: String,
    deliveryOTP: String,
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number]
      }
    },
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date
  },
  pickupAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      type: [Number],
      required: true
    }
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      type: [Number],
      required: true
    }
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index for status queries
orderSchema.index({ status: 1 });

// Create index for buyer and seller queries
orderSchema.index({ buyer: 1, seller: 1 });

// Create compound index for logistics tracking
orderSchema.index({ 'logistics.provider': 1, status: 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order; 