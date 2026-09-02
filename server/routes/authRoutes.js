import express from 'express';
import {
  registerOwner,
  loginOwner,
  getOwnerProfile,
  updateOwnerProfile,
  changePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validateRegister,
  validateLogin,
  validateChangePassword,
} from '../middleware/validateMiddleware.js';

const router = express.Router();

// ============================================================================
// Public Authentication Routes
// ============================================================================
router.post('/register', validateRegister, registerOwner);
router.post('/login', validateLogin, loginOwner);

// ============================================================================
// Protected Shop Owner Profile Routes (Require Valid JWT)
// ============================================================================
router.get('/me', protect, getOwnerProfile);
router.put('/profile', protect, updateOwnerProfile);
router.put('/change-password', protect, validateChangePassword, changePassword);

export default router;
