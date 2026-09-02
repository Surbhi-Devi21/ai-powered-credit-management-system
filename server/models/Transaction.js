import mongoose from 'mongoose';

/**
 * Transaction Mongoose Schema (Unified Financial Ledger Journal)
 * Represents an individual credit entry (Udhar given) or payment entry (Jama received).
 */
const transactionSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID is required for multi-tenant isolation'],
      index: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer ID is required to link transaction'],
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: {
        values: ['CREDIT', 'PAYMENT'],
        message: '{VALUE} is not a valid transaction type (Must be CREDIT or PAYMENT)',
      },
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Transaction amount is required'],
      min: [1, 'Amount must be at least ₹1.00'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [250, 'Description cannot exceed 250 characters'],
      default: '',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    paymentMode: {
      type: String,
      enum: {
        values: ['CASH', 'UPI', 'BANK_TRANSFER', 'OTHER', null],
        message: '{VALUE} is not a valid payment mode',
      },
      default: function () {
        return this.type === 'PAYMENT' ? 'CASH' : null;
      },
    },
    balanceAfterTransaction: {
      type: Number,
      required: [true, 'Running balance snapshot is required for audit consistency'],
    },
    billReference: {
      type: String,
      trim: true,
      maxlength: [50, 'Bill reference cannot exceed 50 characters'],
      default: '',
    },
    transactionDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ============================================================================
// High-Performance Compound Indexes for Ledger Queries & Aggregations
// ============================================================================

// Customer-specific chronological statement query (Most critical index)
transactionSchema.index({ ownerId: 1, customerId: 1, transactionDate: -1 });

// Global shop owner recent transaction feed
transactionSchema.index({ ownerId: 1, transactionDate: -1 });

// Daily & Monthly revenue/collection cash flow aggregations
transactionSchema.index({ ownerId: 1, type: 1, transactionDate: 1 });

// Overdue debt identification index
transactionSchema.index({ ownerId: 1, dueDate: 1, type: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
