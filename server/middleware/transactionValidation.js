/**
 * Transaction Payload Validation Middlewares
 * Ensures financial inputs (Amounts, dates, modes) are valid before hitting database controllers.
 */

export const validateCredit = (req, res, next) => {
  const { customerId, amount, dueDate, transactionDate } = req.body;

  if (!customerId) {
    res.status(400);
    return next(new Error('Customer ID is required to record credit.'));
  }

  if (amount === undefined || isNaN(amount) || Number(amount) < 1) {
    res.status(400);
    return next(new Error('Please enter a valid credit amount of at least ₹1.00.'));
  }

  if (dueDate && isNaN(Date.parse(dueDate))) {
    res.status(400);
    return next(new Error('Please provide a valid repayment due date.'));
  }

  if (transactionDate && isNaN(Date.parse(transactionDate))) {
    res.status(400);
    return next(new Error('Please provide a valid transaction posting date.'));
  }

  next();
};

export const validatePayment = (req, res, next) => {
  const { customerId, amount, paymentMode, transactionDate } = req.body;

  if (!customerId) {
    res.status(400);
    return next(new Error('Customer ID is required to record payment.'));
  }

  if (amount === undefined || isNaN(amount) || Number(amount) < 1) {
    res.status(400);
    return next(new Error('Please enter a valid payment amount of at least ₹1.00.'));
  }

  const validModes = ['CASH', 'UPI', 'BANK_TRANSFER', 'OTHER'];
  if (paymentMode && !validModes.includes(paymentMode)) {
    res.status(400);
    return next(new Error(`Invalid payment mode. Must be one of: ${validModes.join(', ')}`));
  }

  if (transactionDate && isNaN(Date.parse(transactionDate))) {
    res.status(400);
    return next(new Error('Please provide a valid transaction posting date.'));
  }

  next();
};
