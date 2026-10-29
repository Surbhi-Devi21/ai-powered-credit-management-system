import express from 'express';
import { chatWithAssistant } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Authenticated shop owners only
router.use(protect);

router.post('/chat', chatWithAssistant);

export default router;
