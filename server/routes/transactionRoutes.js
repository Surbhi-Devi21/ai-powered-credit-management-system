import express from 'express';
import {
  recordCredit,
  recordPayment,
  getCustomerLedger,
  getRecentTransactions,
  deleteTransaction,
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validateCredit,
  validatePayment,
} from '../middleware/transactionValidation.js';

const router = express.Router();

// All transaction endpoints require owner authentication
router.use(protect);

router.post('/credit', validateCredit, recordCredit);
router.post('/payment', validatePayment, recordPayment);
router.get('/customer/:customerId', getCustomerLedger);
router.get('/recent', getRecentTransactions);
router.delete('/:id', deleteTransaction);

export default router;
