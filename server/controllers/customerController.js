import Customer from '../models/Customer.js';
import { clearCachePattern } from '../utils/cache.js';

/**
 * Invalidate owner-specific cache keys upon database updates
 */
const invalidateCustomerCache = async (ownerId) => {
  const idStr = ownerId.toString();
  await Promise.all([
    clearCachePattern(`customer:${idStr}:*`),
    clearCachePattern(`dashboard:${idStr}:*`),
  ]);
};

/**
 * @desc    Create a new customer account
 * @route   POST /api/v1/customers
 * @access  Private (Owner only)
 */
export const createCustomer = async (req, res, next) => {
  try {
    const { name, phone, address, creditLimit, openingBalance } = req.body;
    const ownerId = req.user._id;

    // Check if customer with same phone already exists for this shop owner
    const existingCustomer = await Customer.findOne({
      ownerId,
      phone: phone.trim(),
    });

    if (existingCustomer) {
      res.status(400);
      throw new Error(
        `A customer with phone number ${phone.trim()} already exists in your records (${existingCustomer.name}).`
      );
    }

    const initialBalance = Number(openingBalance) || 0;

    const customer = await Customer.create({
      ownerId,
      name: name.trim(),
      phone: phone.trim(),
      address: address ? address.trim() : '',
      creditLimit: Number(creditLimit) || 0,
      currentBalance: initialBalance,
      totalCreditGiven: initialBalance,
      totalPaymentReceived: 0,
      status: 'active',
      lastTransactionDate: initialBalance > 0 ? new Date() : null,
    });

    // Invalidate Redis cache
    await invalidateCustomerCache(ownerId);

    res.status(201).json({
      success: true,
      message: 'Customer added to your directory successfully.',
      data: {
        customer,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all customers with search, status filters, sorting, and pagination
 * @route   GET /api/v1/customers
 * @access  Private (Owner only)
 */
export const getCustomers = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const {
      search = '',
      status = 'active',
      sortBy = 'recent',
      sortOrder = 'desc',
      page = 1,
      limit = 15,
    } = req.query;

    // Base query with tenant isolation
    const query = { ownerId };

    // Status filter
    if (status === 'active') {
      query.status = 'active';
    } else if (status === 'archived') {
      query.status = 'archived';
    } else if (status === 'has_dues') {
      query.status = 'active';
      query.currentBalance = { $gt: 0 };
    } else if (status === 'settled') {
      query.status = 'active';
      query.currentBalance = 0;
    }

    // Search filter (Search by Name or Phone Number using regex)
    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { phone: searchRegex }, { address: searchRegex }];
    }

    // Sorting strategy
    let sortOptions = {};
    if (sortBy === 'balance') {
      sortOptions.currentBalance = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'name') {
      sortOptions.name = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'recent') {
      sortOptions.updatedAt = -1;
    } else {
      sortOptions.createdAt = -1;
    }

    // Pagination calculations
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.max(1, Math.min(100, parseInt(limit, 10) || 15));
    const skip = (pageNumber - 1) * limitNumber;

    // Execute query and count
    const [customers, totalCount, aggregateStats] = await Promise.all([
      Customer.find(query).sort(sortOptions).skip(skip).limit(limitNumber).lean(),
      Customer.countDocuments(query),
      Customer.aggregate([
        { $match: { ownerId, status: 'active' } },
        {
          $group: {
            _id: null,
            totalOutstanding: { $sum: '$currentBalance' },
            totalCustomers: { $sum: 1 },
            activeDebtors: {
              $sum: {
                $cond: [{ $gt: ['$currentBalance', 0] }, 1, 0],
              },
            },
          },
        },
      ]),
    ]);

    const stats = aggregateStats[0] || {
      totalOutstanding: 0,
      totalCustomers: 0,
      activeDebtors: 0,
    };

    res.status(200).json({
      success: true,
      count: customers.length,
      total: totalCount,
      page: pageNumber,
      totalPages: Math.ceil(totalCount / limitNumber) || 1,
      stats: {
        totalOutstanding: stats.totalOutstanding,
        totalCustomers: stats.totalCustomers,
        activeDebtors: stats.activeDebtors,
      },
      data: {
        customers,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single customer profile by ID
 * @route   GET /api/v1/customers/:id
 * @access  Private (Owner only)
 */
export const getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user._id;

    const customer = await Customer.findOne({ _id: id, ownerId });

    if (!customer) {
      res.status(404);
      throw new Error('Customer account not found in your directory.');
    }

    res.status(200).json({
      success: true,
      data: {
        customer,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update customer details (Name, Phone, Address, Credit Limit)
 * @route   PUT /api/v1/customers/:id
 * @access  Private (Owner only)
 */
export const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user._id;
    const { name, phone, address, creditLimit } = req.body;

    const customer = await Customer.findOne({ _id: id, ownerId });

    if (!customer) {
      res.status(404);
      throw new Error('Customer not found in your directory.');
    }

    // Check phone uniqueness if phone is changing
    if (phone && phone.trim() !== customer.phone) {
      const phoneExists = await Customer.findOne({
        ownerId,
        phone: phone.trim(),
        _id: { $ne: id },
      });

      if (phoneExists) {
        res.status(400);
        throw new Error(
          `Another customer (${phoneExists.name}) already has phone number ${phone.trim()}.`
        );
      }
      customer.phone = phone.trim();
    }

    if (name) customer.name = name.trim();
    if (address !== undefined) customer.address = address.trim();
    if (creditLimit !== undefined) customer.creditLimit = Number(creditLimit) || 0;

    const updatedCustomer = await customer.save();

    // Invalidate Redis cache
    await invalidateCustomerCache(ownerId);

    res.status(200).json({
      success: true,
      message: 'Customer information updated successfully.',
      data: {
        customer: updatedCustomer,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Archive a customer (Soft Delete)
 * @route   PATCH /api/v1/customers/:id/archive
 * @access  Private (Owner only)
 */
export const archiveCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user._id;

    const customer = await Customer.findOne({ _id: id, ownerId });

    if (!customer) {
      res.status(404);
      throw new Error('Customer not found in your directory.');
    }

    customer.status = 'archived';
    await customer.save();

    // Invalidate Redis cache
    await invalidateCustomerCache(ownerId);

    res.status(200).json({
      success: true,
      message: `${customer.name} has been archived successfully.`,
      data: {
        customer,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Restore an archived customer back to active
 * @route   PATCH /api/v1/customers/:id/restore
 * @access  Private (Owner only)
 */
export const restoreCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user._id;

    const customer = await Customer.findOne({ _id: id, ownerId });

    if (!customer) {
      res.status(404);
      throw new Error('Customer not found in your directory.');
    }

    customer.status = 'active';
    await customer.save();

    // Invalidate Redis cache
    await invalidateCustomerCache(ownerId);

    res.status(200).json({
      success: true,
      message: `${customer.name} has been restored to your active directory.`,
      data: {
        customer,
      },
    });
  } catch (error) {
    next(error);
  }
};
