/**
 * Request Input Validation Middlewares
 * Sanitizes and verifies required payload structures before hitting controllers.
 */

// Validate Owner Registration
export const validateRegister = (req, res, next) => {
  const { name, email, phone, password, businessName, businessCategory } = req.body;

  if (!name || !email || !phone || !password || !businessName) {
    res.status(400);
    return next(new Error('Please provide all required registration fields.'));
  }

  if (password.length < 6) {
    res.status(400);
    return next(new Error('Password must be at least 6 characters long.'));
  }

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    return next(new Error('Please provide a valid email address format.'));
  }

  if (!/^[0-9]{10,15}$/.test(phone)) {
    res.status(400);
    return next(new Error('Phone number must be between 10 and 15 digits.'));
  }

  next();
};

// Validate Owner Login
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    return next(new Error('Please provide both email and password.'));
  }

  next();
};

// Validate Password Change
export const validateChangePassword = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    return next(new Error('Please provide both current and new password.'));
  }

  if (newPassword.length < 6) {
    res.status(400);
    return next(new Error('New password must be at least 6 characters long.'));
  }

  next();
};
