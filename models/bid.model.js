import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
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
  bidPrice: {
    type: Number,
    required: [true, 'Bid price is required'],
    min: [0, 'Bid price cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'expired', 'cancelled'],
    default: 'pending'
  },
  expiresAt: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index for status and expiry queries
bidSchema.index({ status: 1, expiresAt: 1 });

// Create index for buyer and seller queries
bidSchema.index({ buyer: 1, seller: 1 });

// Create index for product queries
bidSchema.index({ product: 1 });

const Bid = mongoose.model('Bid', bidSchema);

export default Bid; 