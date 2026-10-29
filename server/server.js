import dotenv from 'dotenv';
// Load environment variables before importing modules that depend on them
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';
import { connectRedis } from './config/redis.js';

const PORT = Number(process.env.PORT) || 5000;

/**
 * Boots the server:
 * 1. Establishes connection to MongoDB Atlas
 * 2. Initializes Redis In-Memory Cache (with graceful fallback)
 * 3. Starts HTTP server listener on the specified PORT
 */
const startServer = async (requestedPort = PORT) => {
  // Connect to MongoDB Atlas
  await connectDB();

  // Initialize Redis Cache Client
  connectRedis();

  const server = app.listen(requestedPort, () => {
    console.log(`[Server] Credit Management API running in [${process.env.NODE_ENV || 'development'}] mode on port ${requestedPort}`);
    console.log(`[Server] Health Check available at http://localhost:${requestedPort}/api/v1/health`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = requestedPort + 1;
      console.warn(`[Server] Port ${requestedPort} is busy. Retrying on ${nextPort}...`);
      server.close(() => startServer(nextPort));
      return;
    }

    console.error(`[Fatal Error] ${err.message}`);
    process.exit(1);
  });

  // Handle Unhandled Promise Rejections (e.g. database disconnects after startup)
  process.on('unhandledRejection', (err) => {
    console.error(`[Fatal Error] Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });

  // Handle Graceful Termination Signals (e.g., Docker stop, Nodemon restart, Ctrl+C)
  const shutdown = () => {
    console.log('\n[Server] Gracefully shutting down HTTP server...');
    server.close(() => {
      console.log('[Server] HTTP server closed. Process terminated.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

startServer();
