import express from 'express';
import {
  getDashboardSummary,
  getCashFlowTrends,
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkCache } from '../middleware/cacheMiddleware.js';

const router = express.Router();

// All dashboard endpoints require owner authentication
router.use(protect);

// Cache dashboard summary for 60 seconds
router.get('/summary', checkCache(60, 'dashboard'), getDashboardSummary);

// Cache cash flow trends for 120 seconds
router.get('/trends', checkCache(120, 'dashboard'), getCashFlowTrends);

export default router;
