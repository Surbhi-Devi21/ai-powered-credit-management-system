import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { notFound } from './middleware/notFoundMiddleware.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// ============================================================================
// Global Security & Request Processing Middlewares
// ============================================================================

// Set security-related HTTP response headers
app.use(helmet());

// Enable Cross-Origin Resource Sharing (CORS)
const parseAllowedOrigins = () => {
  const configuredOrigins = [process.env.CLIENT_URL, process.env.CLIENT_URLS]
    .flatMap((value) => {
      if (!value) return [];
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    });

  return [...new Set([
    ...configuredOrigins,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
  ])];
};

const allowedOrigins = parseAllowedOrigins();

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// HTTP request logger in development mode
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================================
// Base Health Check Route
// ============================================================================
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    message: 'Credit Management System API is running smoothly.',
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// Application REST API Routes
// ============================================================================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/ai', aiRoutes);

// ============================================================================
// Error Handling Pipeline (Must be mounted last)
// ============================================================================
app.use(notFound);
app.use(errorHandler);

export default app;
