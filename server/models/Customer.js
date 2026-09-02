import mongoose from 'mongoose';

/**
 * Customer Mongoose Schema (Debtor Account)
 * Represents a retail customer with credit limits, running balances, and status.
 */
const customerSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID is required for multi-tenant isolation'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Customer phone number is required'],
      trim: true,
      match: [/^[0-9]{10,15}$/, 'Please provide a valid 10-15 digit phone number'],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters'],
      default: '',
    },
    creditLimit: {
      type: Number,
      default: 0,
      min: [0, 'Credit limit cannot be negative'],
    },
    currentBalance: {
      type: Number,
      default: 0,
    },
    totalCreditGiven: {
      type: Number,
      default: 0,
      min: [0, 'Total credit cannot be negative'],
    },
    totalPaymentReceived: {
      type: Number,
      default: 0,
      min: [0, 'Total payment cannot be negative'],
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'archived'],
        message: '{VALUE} is not a valid customer status',
      },
      default: 'active',
      index: true,
    },
    lastTransactionDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ============================================================================
// Compound Indexes for High-Performance Multi-Tenant Queries
// ============================================================================

// Unique phone per shop owner (same phone allowed across different owners)
customerSchema.index({ ownerId: 1, phone: 1 }, { unique: true });

// Fast listing by owner & status
customerSchema.index({ ownerId: 1, status: 1 });

// High-speed sorting by current balance (top debtors)
customerSchema.index({ ownerId: 1, currentBalance: -1 });

// Fast search by owner & customer name
customerSchema.index({ ownerId: 1, name: 1 });

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
