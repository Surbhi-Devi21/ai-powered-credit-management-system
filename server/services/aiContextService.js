import Customer from '../models/Customer.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

/**
 * Grounded context builder for the AI Business Assistant.
 *
 * Every query here is scoped by ownerId (taken from the authenticated JWT user,
 * never from the request body). Read-only: nothing is written to the database.
 * Uses existing collections only: User, Customer, Transaction.
 */

const DAY_MS = 86400000;
const DEFAULT_TERM_DAYS = 15; // Mirrors the fallback used by the Reminders module.

const startOfDay = (d = new Date()) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const endOfDay = (d = new Date()) => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};
const isoDate = (d) => (d ? new Date(d).toISOString().split('T')[0] : null);
const daysBetween = (from, to = new Date()) =>
  Math.floor((startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY_MS);

// Same thresholds as client/src/utils/reminderUtils.js (calculatePriority)
const priorityLevel = (amount, daysOverdue) => {
  if (amount <= 0) return 'SETTLED';
  if (daysOverdue > 30 || (daysOverdue > 14 && amount >= 15000) || (daysOverdue > 7 && amount >= 25000))
    return 'CRITICAL';
  if (daysOverdue >= 15 || (daysOverdue > 0 && amount >= 10000) || amount >= 20000) return 'HIGH';
  if (daysOverdue >= 0 || amount >= 5000) return 'MEDIUM';
  return 'LOW';
};

const sumAgg = async (match) => {
  const r = await Transaction.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
  ]);
  return { total: r[0]?.total || 0, count: r[0]?.count || 0 };
};

/**
 * Build the full JSON snapshot of the owner's live business data.
 * @param {ObjectId} ownerId authenticated shop owner id
 */
export const buildBusinessContext = async (ownerId) => {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [owner, customers, latestCredits, todayPayments, todayCredits, monthPayments, monthCredits, todayPaymentList, recent] =
    await Promise.all([
      User.findById(ownerId).select('name businessName businessCategory currency').lean(),
      Customer.find({ ownerId }).select(
        'name phone creditLimit currentBalance totalCreditGiven totalPaymentReceived status lastTransactionDate createdAt'
      ).lean(),
      // Latest CREDIT with a due date per customer (same source the Reminders page uses)
      Transaction.aggregate([
        { $match: { ownerId, type: 'CREDIT' } },
        { $sort: { transactionDate: -1, createdAt: -1 } },
        { $group: { _id: '$customerId', dueDate: { $first: '$dueDate' }, lastCreditDate: { $first: '$transactionDate' } } },
      ]),
      sumAgg({ ownerId, type: 'PAYMENT', transactionDate: { $gte: todayStart, $lte: todayEnd } }),
      sumAgg({ ownerId, type: 'CREDIT', transactionDate: { $gte: todayStart, $lte: todayEnd } }),
      sumAgg({ ownerId, type: 'PAYMENT', transactionDate: { $gte: monthStart, $lte: todayEnd } }),
      sumAgg({ ownerId, type: 'CREDIT', transactionDate: { $gte: monthStart, $lte: todayEnd } }),
      Transaction.find({ ownerId, type: 'PAYMENT', transactionDate: { $gte: todayStart, $lte: todayEnd } })
        .sort({ transactionDate: -1 })
        .populate('customerId', 'name')
        .select('amount paymentMode transactionDate customerId')
        .lean(),
      Transaction.find({ ownerId })
        .sort({ transactionDate: -1, createdAt: -1 })
        .limit(15)
        .populate('customerId', 'name')
        .select('type amount description paymentMode transactionDate dueDate customerId')
        .lean(),
    ]);

  const dueMap = new Map(latestCredits.map((c) => [String(c._id), c]));
  const active = customers.filter((c) => c.status === 'active');

  const customerRows = active.map((c) => {
    const balance = c.currentBalance || 0;
    const credit = dueMap.get(String(c._id));
    let dueDate = credit?.dueDate || null;
    let dueDateSource = dueDate ? 'recorded' : null;
    if (!dueDate && balance > 0) {
      const base = c.lastTransactionDate || c.createdAt;
      dueDate = new Date(new Date(base).getTime() + DEFAULT_TERM_DAYS * DAY_MS);
      dueDateSource = `estimated (last activity + ${DEFAULT_TERM_DAYS} days)`;
    }
    const daysOverdue = balance > 0 && dueDate ? daysBetween(dueDate) : 0;
    const daysSinceLastActivity = c.lastTransactionDate ? daysBetween(c.lastTransactionDate) : null;
    return {
      name: c.name,
      phone: c.phone,
      outstandingBalance: balance,
      creditLimit: c.creditLimit || 0,
      overLimitBy: c.creditLimit > 0 && balance > c.creditLimit ? balance - c.creditLimit : 0,
      dueDate: isoDate(dueDate),
      dueDateSource,
      daysOverdue: Math.max(daysOverdue, 0),
      isOverdue: balance > 0 && daysOverdue > 0,
      lastTransactionDate: isoDate(c.lastTransactionDate),
      daysSinceLastTransaction: daysSinceLastActivity,
      priority: priorityLevel(balance, daysOverdue),
    };
  });

  const debtors = customerRows.filter((c) => c.outstandingBalance > 0);
  const byBalance = [...debtors].sort((a, b) => b.outstandingBalance - a.outstandingBalance);
  const totalOutstanding = debtors.reduce((s, c) => s + c.outstandingBalance, 0);
  const overdue = customerRows.filter((c) => c.isOverdue).sort((a, b) => b.daysOverdue - a.daysOverdue);

  // "Not paid for >30 days": last payment per debtor, from the Transaction ledger
  const lastPayments = await Transaction.aggregate([
    { $match: { ownerId, type: 'PAYMENT' } },
    { $group: { _id: '$customerId', lastPaymentDate: { $max: '$transactionDate' } } },
  ]);
  const lastPayMap = new Map(lastPayments.map((p) => [String(p._id), p.lastPaymentDate]));
  const notPaid30 = active
    .filter((c) => c.currentBalance > 0)
    .map((c) => {
      const last = lastPayMap.get(String(c._id)) || null;
      const days = last ? daysBetween(last) : null;
      return {
        name: c.name,
        outstandingBalance: c.currentBalance,
        lastPaymentDate: isoDate(last),
        daysSinceLastPayment: days, // null => no payment ever recorded
      };
    })
    .filter((c) => c.daysSinceLastPayment === null || c.daysSinceLastPayment > 30)
    .sort((a, b) => b.outstandingBalance - a.outstandingBalance);

  const payersToday = {};
  todayPaymentList.forEach((t) => {
    const n = t.customerId?.name || 'Unknown customer';
    payersToday[n] = (payersToday[n] || 0) + t.amount;
  });

  return {
    generatedAt: now.toISOString(),
    currency: owner?.currency || 'INR',
    business: {
      ownerName: owner?.name,
      businessName: owner?.businessName,
      category: owner?.businessCategory,
    },
    totals: {
      totalOutstanding,
      activeCustomers: active.length,
      archivedCustomers: customers.length - active.length,
      customersWithPendingBalance: debtors.length,
      settledCustomers: active.length - debtors.length,
      averagePendingPerDebtor: debtors.length ? Math.round(totalOutstanding / debtors.length) : 0,
      overdueCustomerCount: overdue.length,
      overdueAmount: overdue.reduce((s, c) => s + c.outstandingBalance, 0),
      overLimitCustomerCount: customerRows.filter((c) => c.overLimitBy > 0).length,
      criticalPriorityCount: customerRows.filter((c) => c.priority === 'CRITICAL').length,
    },
    today: {
      date: isoDate(now),
      collection: todayPayments.total,
      paymentCount: todayPayments.count,
      creditGiven: todayCredits.total,
      creditCount: todayCredits.count,
      customersWhoPaid: Object.entries(payersToday).map(([name, amount]) => ({ name, amount })),
    },
    thisMonth: {
      from: isoDate(monthStart),
      to: isoDate(now),
      collection: monthPayments.total,
      paymentCount: monthPayments.count,
      creditGiven: monthCredits.total,
      creditCount: monthCredits.count,
      netChangeInOutstanding: monthCredits.total - monthPayments.total,
    },
    top5Debtors: byBalance.slice(0, 5),
    highestPendingCustomer: byBalance[0] || null,
    overdueCustomers: overdue.slice(0, 25),
    customersOverCreditLimit: customerRows.filter((c) => c.overLimitBy > 0).sort((a, b) => b.overLimitBy - a.overLimitBy),
    customersNotPaidOver30Days: notPaid30.slice(0, 25),
    allActiveCustomers: customerRows
      .sort((a, b) => b.outstandingBalance - a.outstandingBalance)
      .slice(0, 150),
    customerListTruncated: customerRows.length > 150,
    recentTransactions: recent.map((t) => ({
      customer: t.customerId?.name || 'Unknown customer',
      type: t.type === 'PAYMENT' ? 'Payment received' : 'Credit given',
      amount: t.amount,
      paymentMode: t.paymentMode || null,
      note: t.description || '',
      date: isoDate(t.transactionDate),
      dueDate: isoDate(t.dueDate),
    })),
    notes: [
      'Overdue is computed from the latest credit entry due date; if none was recorded, due date is estimated as last activity + 15 days.',
      'All amounts are in INR (₹).',
    ],
  };
};
