import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Mongoose Schema (Shop Owner - Tenant Root)
 * Represents the authenticated shop owner who manages store credit and analytics.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Owner name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      match: [/^[0-9]{10,15}$/, 'Please provide a valid 10-15 digit phone number'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Do not return password by default in queries
    },
    businessName: {
      type: String,
      required: [true, 'Business/Shop name is required'],
      trim: true,
      minlength: [2, 'Business name must be at least 2 characters long'],
      maxlength: [100, 'Business name cannot exceed 100 characters'],
    },
    businessCategory: {
      type: String,
      required: [true, 'Business category is required'],
      enum: {
        values: [
          'kirana',
          'medical',
          'electronics',
          'stationery',
          'restaurant',
          'clothing',
          'other',
        ],
        message: '{VALUE} is not a valid business category',
      },
      default: 'kirana',
    },
    currency: {
      type: String,
      default: 'INR',
    },
    role: {
      type: String,
      enum: ['owner', 'staff', 'admin'],
      default: 'owner',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ============================================================================
// Pre-Save Hook: Encrypt password using bcrypt before saving
// ============================================================================
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ============================================================================
// Instance Method: Match entered password with hashed password in database
// ============================================================================
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
