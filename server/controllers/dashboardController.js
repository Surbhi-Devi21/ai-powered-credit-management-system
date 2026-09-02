import Transaction from '../models/Transaction.js';
import Customer from '../models/Customer.js';

/**
 * @desc    Get complete dashboard summary metrics, KPIs, top debtors & recent transactions
 * @route   GET /api/v1/dashboard/summary
 * @access  Private (Owner only)
 */
export const getDashboardSummary = async (req, res, next) => {
  try {
    const ownerId = req.user._id;

    // Define "Today" boundaries (Midnight to 23:59:59.999 in local server/UTC)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Parallel Execution of High-Performance Aggregations
    const [
      todayPaymentsAgg,
      todayCreditsAgg,
      customerStatsAgg,
      topDebtors,
      recentTransactions,
    ] = await Promise.all([
      // 1. Today's Total Payments Collected (Jama)
      Transaction.aggregate([
        {
          $match: {
            ownerId,
            type: 'PAYMENT',
            transactionDate: { $gte: todayStart, $lte: todayEnd },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),

      // 2. Today's Total Credit Given (Udhar)
      Transaction.aggregate([
        {
          $match: {
            ownerId,
            type: 'CREDIT',
            transactionDate: { $gte: todayStart, $lte: todayEnd },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),

      // 3. Customer Directory Metrics (Market Dues, Customer Counts, Average Debt)
      Customer.aggregate([
        { $match: { ownerId, status: 'active' } },
        {
          $group: {
            _id: null,
            totalOutstandingDues: { $sum: '$currentBalance' },
            totalCustomers: { $sum: 1 },
            activeDebtors: {
              $sum: {
                $cond: [{ $gt: ['$currentBalance', 0] }, 1, 0],
              },
            },
            settledCustomers: {
              $sum: {
                $cond: [{ $eq: ['$currentBalance', 0] }, 1, 0],
              },
            },
            avgDebtorDebt: {
              $avg: {
                $cond: [{ $gt: ['$currentBalance', 0] }, '$currentBalance', null],
              },
            },
          },
        },
      ]),

      // 4. Top 5 Debtors with highest outstanding balances
      Customer.find({ ownerId, status: 'active', currentBalance: { $gt: 0 } })
        .sort({ currentBalance: -1 })
        .limit(5)
        .select('name phone currentBalance creditLimit address')
        .lean(),

      // 5. Recent 8 transactions across all customers
      Transaction.find({ ownerId })
        .sort({ transactionDate: -1, createdAt: -1 })
        .limit(8)
        .populate('customerId', 'name phone currentBalance status')
        .lean(),
    ]);

    const todayCollection = todayPaymentsAgg[0]?.totalAmount || 0;
    const todayPaymentsCount = todayPaymentsAgg[0]?.count || 0;

    const todayCredit = todayCreditsAgg[0]?.totalAmount || 0;
    const todayCreditCount = todayCreditsAgg[0]?.count || 0;

    const customerStats = customerStatsAgg[0] || {
      totalOutstandingDues: 0,
      totalCustomers: 0,
      activeDebtors: 0,
      settledCustomers: 0,
      avgDebtorDebt: 0,
    };

    res.status(200).json({
      success: true,
      data: {
        kpis: {
          todayCollection,
          todayPaymentsCount,
          todayCredit,
          todayCreditCount,
          totalOutstandingDues: customerStats.totalOutstandingDues,
          totalCustomers: customerStats.totalCustomers,
          activeDebtors: customerStats.activeDebtors,
          settledCustomers: customerStats.settledCustomers,
          avgDebtorDebt: Math.round(customerStats.avgDebtorDebt || 0),
        },
        topDebtors,
        recentTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get daily/weekly cash flow trends (Credit Given vs Payments Received) for charts
 * @route   GET /api/v1/dashboard/trends
 * @access  Private (Owner only)
 */
export const getCashFlowTrends = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const days = parseInt(req.query.days, 10) || 7;

    // Define start date
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    // Aggregate transactions by date
    const trendsAgg = await Transaction.aggregate([
      {
        $match: {
          ownerId,
          transactionDate: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$transactionDate' },
          },
          creditGiven: {
            $sum: {
              $cond: [{ $eq: ['$type', 'CREDIT'] }, '$amount', 0],
            },
          },
          paymentReceived: {
            $sum: {
              $cond: [{ $eq: ['$type', 'PAYMENT'] }, '$amount', 0],
            },
          },
          creditCount: {
            $sum: {
              $cond: [{ $eq: ['$type', 'CREDIT'] }, 1, 0],
            },
          },
          paymentCount: {
            $sum: {
              $cond: [{ $eq: ['$type', 'PAYMENT'] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Build complete daily timeline including days with 0 transactions
    const trendsMap = new Map(trendsAgg.map((item) => [item._id, item]));
    const completeTrends = [];

    for (let i = 0; i < days; i++) {
      const dateObj = new Date(startDate);
      dateObj.setDate(dateObj.getDate() + i);
      const dateStr = dateObj.toISOString().split('T')[0];

      // Format clean display label (e.g., "24 Aug" or "Mon")
      const label = new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
      }).format(dateObj);

      const existingData = trendsMap.get(dateStr);

      completeTrends.push({
        date: dateStr,
        displayDate: label,
        creditGiven: existingData?.creditGiven || 0,
        paymentReceived: existingData?.paymentReceived || 0,
        creditCount: existingData?.creditCount || 0,
        paymentCount: existingData?.paymentCount || 0,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        days,
        trends: completeTrends,
      },
    });
  } catch (error) {
    next(error);
  }
};
