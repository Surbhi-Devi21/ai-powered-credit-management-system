import express from 'express';
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  archiveCustomer,
  restoreCustomer,
} from '../controllers/customerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkCache } from '../middleware/cacheMiddleware.js';
import {
  validateCreateCustomer,
  validateUpdateCustomer,
} from '../middleware/customerValidation.js';

const router = express.Router();

// All customer routes require authentication
router.use(protect);

router
  .route('/')
  .post(validateCreateCustomer, createCustomer)
  .get(checkCache(60, 'customer'), getCustomers);

router
  .route('/:id')
  .get(getCustomerById)
  .put(validateUpdateCustomer, updateCustomer);

router.patch('/:id/archive', archiveCustomer);
router.patch('/:id/restore', restoreCustomer);

export default router;
