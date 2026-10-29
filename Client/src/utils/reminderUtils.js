/**
 * Reminder & Overdue Tracking Calculation Utilities
 * Dynamically computes overdue aging, risk priority scores, and WhatsApp message generators.
 * Zero database schema modifications required.
 */

/**
 * Calculate the number of days a payment is overdue.
 * If due in future, returns negative number. If due today, returns 0. If overdue, returns positive number.
 */
export function getDaysOverdue(dueDate) {
  if (!dueDate) return 0;

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - due.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Assign an Overdue Aging Bucket based on days overdue
 * Buckets: Today, 1–7 Days, 8–30 Days, 31–60 Days, 60+ Days
 */
export function getOverdueBucket(daysOverdue, balance) {
  if (balance <= 0) return 'SETTLED';
  if (daysOverdue === 0) return 'TODAY';
  if (daysOverdue >= 1 && daysOverdue <= 7) return '1-7_DAYS';
  if (daysOverdue >= 8 && daysOverdue <= 30) return '8-30_DAYS';
  if (daysOverdue >= 31 && daysOverdue <= 60) return '31-60_DAYS';
  if (daysOverdue > 60) return '60+_DAYS';
  return 'UPCOMING'; // Due date is in future
}

/**
 * Dynamic Priority Evaluator
 * Assigns LOW, MEDIUM, HIGH, CRITICAL based on Days Overdue & Outstanding Balance.
 */
export function calculatePriority(customer, daysOverdue) {
  const amount = customer.currentBalance || 0;

  if (amount <= 0) {
    return {
      level: 'SETTLED',
      label: 'Settled',
      badgeVariant: 'settled',
      score: 0,
    };
  }

  // CRITICAL: Overdue by > 30 days OR (Overdue > 14 days & balance >= ₹15,000) OR balance >= ₹25,000 with overdue > 7 days
  if (
    daysOverdue > 30 ||
    (daysOverdue > 14 && amount >= 15000) ||
    (daysOverdue > 7 && amount >= 25000)
  ) {
    return {
      level: 'CRITICAL',
      label: 'Critical Risk',
      badgeVariant: 'danger',
      score: 4,
    };
  }

  // HIGH: Overdue 15–30 days OR (Overdue > 0 & balance >= ₹10,000) OR balance >= ₹20,000
  if (
    daysOverdue >= 15 ||
    (daysOverdue > 0 && amount >= 10000) ||
    amount >= 20000
  ) {
    return {
      level: 'HIGH',
      label: 'High Priority',
      badgeVariant: 'warning',
      score: 3,
    };
  }

  // MEDIUM: Overdue 1–14 days OR Due Today OR balance >= ₹5,000
  if (daysOverdue >= 1 || daysOverdue === 0 || amount >= 5000) {
    return {
      level: 'MEDIUM',
      label: 'Medium Priority',
      badgeVariant: 'pending',
      score: 2,
    };
  }

  // LOW: Small balance (< ₹5,000) or upcoming due date in the future
  return {
    level: 'LOW',
    label: 'Low Priority',
    badgeVariant: 'neutral',
    score: 1,
  };
}

/**
 * Generate formatted WhatsApp reminder message link
 */
export function generateWhatsAppUrl(customer, businessName = 'our store', tone = 'polite', dueDate = null) {
  const cleanPhone = (customer.phone || '').replace(/[^0-9]/g, '');
  const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(Math.abs(customer.currentBalance || 0));

  const formattedDueDate = dueDate
    ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dueDate))
    : 'as per ledger terms';

  let text = '';

  if (tone === 'urgent') {
    text = `Namaste ${customer.name},\n\nThis is an urgent payment notice from *${businessName}*.\n\nYour pending balance of *${formattedAmount}* is significantly overdue (Due: ${formattedDueDate}). Kindly clear this amount today via UPI or Cash to continue uninterrupted store credit.\n\nThank you!`;
  } else if (tone === 'formal') {
    text = `Dear ${customer.name},\n\nStatement notice from *${businessName}*:\nYour pending balance is *${formattedAmount}* (Due date: ${formattedDueDate}).\n\nPlease arrange for the settlement at your earliest convenience.\n\nBest regards,\n${businessName}`;
  } else {
    // Default Polite & Friendly Tone
    text = `Namaste ${customer.name},\n\nThis is a friendly reminder from *${businessName}* that *${formattedAmount}* is pending in your khata account.\n\nPlease make the payment whenever convenient via Cash or UPI.\n\nThank you!`;
  }

  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`;
}
