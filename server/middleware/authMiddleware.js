import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Authentication Guard Middleware
 * Verifies the JWT Bearer token from incoming request headers.
 * Attaches the authenticated shop owner document to req.user.
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token string
      token = req.headers.authorization.split(' ')[1];

      // Verify token signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by decoded ID, explicitly excluding the hashed password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User session not found. Please log in again.');
      }

      if (!req.user.isActive) {
        res.status(403);
        throw new Error('Account is deactivated. Please contact support.');
      }

      return next();
    } catch (error) {
      res.status(401);
      if (error.name === 'TokenExpiredError') {
        return next(new Error('Session has expired. Please log in again.'));
      }
      return next(new Error('Invalid authentication token. Authorization denied.'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Access denied. No authentication token provided.'));
  }
};
