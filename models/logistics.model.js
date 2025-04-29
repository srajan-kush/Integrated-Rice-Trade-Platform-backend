import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const logisticsProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      type: [Number],
      required: true
    }
  },
  operatingAreas: [{
    city: String,
    state: String,
    pincode: String
  }],
  vehicles: [{
    vehicleNumber: {
      type: String,
      required: true,
      unique: true
    },
    type: {
      type: String,
      enum: ['small', 'medium', 'large'],
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    driver: {
      name: String,
      phone: String,
      license: String
    },
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
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  documents: [{
    type: {
      type: String,
      enum: ['registration', 'insurance', 'permit', 'other'],
      required: true
    },
    number: String,
    expiryDate: Date,
    url: String
  }],
  bankDetails: {
    accountHolder: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create geospatial index for vehicle locations
logisticsProviderSchema.index({ 'vehicles.currentLocation': '2dsphere' });

// Create index for operating areas
logisticsProviderSchema.index({ 'operatingAreas.city': 1, 'operatingAreas.state': 1 });

// Hash password before saving
logisticsProviderSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
logisticsProviderSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const LogisticsProvider = mongoose.model('LogisticsProvider', logisticsProviderSchema);

export default LogisticsProvider; 