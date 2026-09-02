import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

let io = null;

/**
 * Initialize Socket.IO Server with JWT Authentication and Shop-Based Room Scopes
 *
 * @param {import('http').Server} httpServer - Node.js HTTP Server instance
 */
export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // ============================================================================
  // Socket JWT Authentication Middleware
  // ============================================================================
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication failed. No token provided.'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user || !user.isActive) {
        return next(new Error('User not authorized for real-time stream.'));
      }

      // Attach user object to socket session
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Invalid token during socket handshake.'));
    }
  });

  // ============================================================================
  // Socket Connection & Private Shop Room Joining
  // ============================================================================
  io.on('connection', (socket) => {
    const ownerId = socket.user._id.toString();
    const shopRoom = `shop:${ownerId}`;

    // Join private tenant room
    socket.join(shopRoom);

    console.log(`[Socket.IO] Owner [${socket.user.name}] connected to room [${shopRoom}] (Socket ID: ${socket.id})`);

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Owner [${socket.user.name}] disconnected.`);
    });
  });

  return io;
};

/**
 * Get active Socket.IO instance
 */
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO is not initialized.');
  }
  return io;
};

/**
 * Emit an event strictly to a specific shop owner's connected devices
 *
 * @param {string|import('mongoose').Types.ObjectId} ownerId - Shop Owner ID
 * @param {string} event - Event name (e.g., 'transactionAdded', 'customerUpdated')
 * @param {any} data - Event payload
 */
export const emitToShop = (ownerId, event, data) => {
  if (!io) return;
  try {
    const shopRoom = `shop:${ownerId.toString()}`;
    io.to(shopRoom).emit(event, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`[Socket Error] Failed to emit event [${event}]: ${error.message}`);
  }
};
