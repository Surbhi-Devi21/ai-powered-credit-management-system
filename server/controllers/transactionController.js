import Transaction from '../models/Transaction.js';
import Customer from '../models/Customer.js';
import { clearCachePattern } from '../utils/cache.js';

/**
 * Invalidate owner-specific cache keys upon transaction updates
 */
const invalidateTransactionCache = async (ownerId) => {
  const idStr = ownerId.toString();
  await Promise.all([
    clearCachePattern(`dashboard:${idStr}:*`),
    clearCachePattern(`customer:${idStr}:*`),
  ]);
};

/**
 * @desc    Record a new Credit transaction (Udhar given to customer)
 * @route   POST /api/v1/transactions/credit
 * @access  Private (Owner only)
 */
export const recordCredit = async (req, res, next) => {
  try {
    const { customerId, amount, description, dueDate, billReference, transactionDate } = req.body;
    const ownerId = req.user._id;
    const numAmount = Number(amount);

    // Verify customer exists and belongs to this shop owner
    const customer = await Customer.findOne({ _id: customerId, ownerId });

    if (!customer) {
      res.status(404);
      throw new Error('Customer account not found.');
    }

    if (customer.status === 'archived') {
      res.status(400);
      throw new Error('Cannot add credit to an archived customer. Please restore account first.');
    }

    // Calculate new running balance
    const previousBalance = customer.currentBalance || 0;
    const newBalance = previousBalance + numAmount;
    const postingDate = transactionDate ? new Date(transactionDate) : new Date();

    // Create immutable transaction ledger record
    const transaction = await Transaction.create({
      ownerId,
      customerId,
      type: 'CREDIT',
      amount: numAmount,
      description: description ? description.trim() : '',
      dueDate: dueDate ? new Date(dueDate) : null,
      paymentMode: null,
      balanceAfterTransaction: newBalance,
      billReference: billReference ? billReference.trim() : '',
      transactionDate: postingDate,
    });

    // Update customer denormalized balance atomically
    customer.currentBalance = newBalance;
    customer.totalCreditGiven = (customer.totalCreditGiven || 0) + numAmount;
    customer.lastTransactionDate = postingDate;
    await customer.save();

    // Invalidate Redis Cache
    await invalidateTransactionCache(ownerId);

    res.status(201).json({
      success: true,
      message: `Credit entry of ₹${numAmount.toLocaleString('en-IN')} recorded successfully.`,
      data: {
        transaction,
        customer: {
          _id: customer._id,
          name: customer.name,
          currentBalance: customer.currentBalance,
          totalCreditGiven: customer.totalCreditGiven,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Record a new Payment transaction (Jama received from customer)
 * @route   POST /api/v1/transactions/payment
 * @access  Private (Owner only)
 */
export const recordPayment = async (req, res, next) => {
  try {
    const { customerId, amount, description, paymentMode, transactionDate } = req.body;
    const ownerId = req.user._id;
    const numAmount = Number(amount);

    // Verify customer exists and belongs to this shop owner
    const customer = await Customer.findOne({ _id: customerId, ownerId });

    if (!customer) {
      res.status(404);
      throw new Error('Customer account not found.');
    }

    if (customer.status === 'archived') {
      res.status(400);
      throw new Error('Cannot record payment for an archived customer. Please restore account first.');
    }

    // Calculate new running balance
    const previousBalance = customer.currentBalance || 0;
    const newBalance = previousBalance - numAmount;
    const postingDate = transactionDate ? new Date(transactionDate) : new Date();

    // Create immutable transaction ledger record
    const transaction = await Transaction.create({
      ownerId,
      customerId,
      type: 'PAYMENT',
      amount: numAmount,
      description: description ? description.trim() : '',
      dueDate: null,
      paymentMode: paymentMode || 'CASH',
      balanceAfterTransaction: newBalance,
      billReference: '',
      transactionDate: postingDate,
    });

    // Update customer denormalized balance atomically
    customer.currentBalance = newBalance;
    customer.totalPaymentReceived = (customer.totalPaymentReceived || 0) + numAmount;
    customer.lastTransactionDate = postingDate;
    await customer.save();

    // Invalidate Redis Cache
    await invalidateTransactionCache(ownerId);

    res.status(201).json({
      success: true,
      message: `Payment of ₹${numAmount.toLocaleString('en-IN')} recorded successfully.`,
      data: {
        transaction,
        customer: {
          _id: customer._id,
          name: customer.name,
          currentBalance: customer.currentBalance,
          totalPaymentReceived: customer.totalPaymentReceived,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get chronological statement / ledger for a specific customer
 * @route   GET /api/v1/transactions/customer/:customerId
 * @access  Private (Owner only)
 */
export const getCustomerLedger = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const ownerId = req.user._id;
    const {
      type = 'ALL',
      startDate,
      endDate,
      search = '',
      page = 1,
      limit = 20,
    } = req.query;

    // Verify customer belongs to owner
    const customer = await Customer.findOne({ _id: customerId, ownerId }).lean();
    if (!customer) {
      res.status(404);
      throw new Error('Customer not found in your directory.');
    }

    // Construct query filter
    const query = { ownerId, customerId };

    if (type === 'CREDIT' || type === 'PAYMENT') {
      query.type = type;
    }

    if (startDate || endDate) {
      query.transactionDate = {};
      if (startDate) query.transactionDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.transactionDate.$lte = end;
      }
    }

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ description: searchRegex }, { billReference: searchRegex }];
    }

    // Pagination calculations
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNumber - 1) * limitNumber;

    const [transactions, totalCount] = await Promise.all([
      Transaction.find(query)
        .sort({ transactionDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      Transaction.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: transactions.length,
      total: totalCount,
      page: pageNumber,
      totalPages: Math.ceil(totalCount / limitNumber) || 1,
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        creditLimit: customer.creditLimit,
        currentBalance: customer.currentBalance,
        totalCreditGiven: customer.totalCreditGiven,
        totalPaymentReceived: customer.totalPaymentReceived,
        status: customer.status,
      },
      data: {
        transactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get recent transaction stream across all store customers (for Dashboard)
 * @route   GET /api/v1/transactions/recent
 * @access  Private (Owner only)
 */
export const getRecentTransactions = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const limit = parseInt(req.query.limit, 10) || 10;

    const transactions = await Transaction.find({ ownerId })
      .sort({ transactionDate: -1, createdAt: -1 })
      .limit(limit)
      .populate('customerId', 'name phone currentBalance status')
      .lean();

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: {
        transactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete / Reverse a transaction and recalibrate customer balance
 * @route   DELETE /api/v1/transactions/:id
 * @access  Private (Owner only)
 */
export const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user._id;

    const transaction = await Transaction.findOne({ _id: id, ownerId });
    if (!transaction) {
      res.status(404);
      throw new Error('Transaction record not found.');
    }

    const customer = await Customer.findOne({ _id: transaction.customerId, ownerId });

    if (customer) {
      // Reverse balance impact
      if (transaction.type === 'CREDIT') {
        customer.currentBalance -= transaction.amount;
        customer.totalCreditGiven = Math.max(0, customer.totalCreditGiven - transaction.amount);
      } else if (transaction.type === 'PAYMENT') {
        customer.currentBalance += transaction.amount;
        customer.totalPaymentReceived = Math.max(0, customer.totalPaymentReceived - transaction.amount);
      }
      await customer.save();
    }

    await Transaction.deleteOne({ _id: id, ownerId });

    // Invalidate Redis Cache
    await invalidateTransactionCache(ownerId);

    res.status(200).json({
      success: true,
      message: 'Transaction removed and customer balance recalibrated successfully.',
    });
  } catch (error) {
    next(error);
  }
};
