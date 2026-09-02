/**
 * Customer Input Validation Middlewares
 * Validates payloads for customer creation and updates.
 */

export const validateCreateCustomer = (req, res, next) => {
  const { name, phone, creditLimit, openingBalance } = req.body;

  if (!name || !name.trim()) {
    res.status(400);
    return next(new Error('Customer name is required.'));
  }

  if (name.trim().length < 2) {
    res.status(400);
    return next(new Error('Customer name must be at least 2 characters long.'));
  }

  if (!phone || !phone.trim()) {
    res.status(400);
    return next(new Error('Customer mobile number is required.'));
  }

  if (!/^[0-9]{10,15}$/.test(phone.trim())) {
    res.status(400);
    return next(new Error('Please provide a valid 10-15 digit mobile number.'));
  }

  if (creditLimit !== undefined && (isNaN(creditLimit) || Number(creditLimit) < 0)) {
    res.status(400);
    return next(new Error('Credit limit must be a valid positive number.'));
  }

  if (openingBalance !== undefined && (isNaN(openingBalance) || Number(openingBalance) < 0)) {
    res.status(400);
    return next(new Error('Opening balance must be a valid positive number.'));
  }

  next();
};

export const validateUpdateCustomer = (req, res, next) => {
  const { name, phone, creditLimit } = req.body;

  if (name !== undefined && name.trim().length < 2) {
    res.status(400);
    return next(new Error('Customer name must be at least 2 characters long.'));
  }

  if (phone !== undefined && !/^[0-9]{10,15}$/.test(phone.trim())) {
    res.status(400);
    return next(new Error('Please provide a valid 10-15 digit mobile number.'));
  }

  if (creditLimit !== undefined && (isNaN(creditLimit) || Number(creditLimit) < 0)) {
    res.status(400);
    return next(new Error('Credit limit must be a valid positive number.'));
  }

  next();
};
