import mongoose from 'mongoose';

/**
 * Connects to MongoDB Atlas using Mongoose.
 * Logs connection status and handles initial connection failures gracefully.
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables.');
    }

    const conn = await mongoose.connect(mongoUri, {
      autoIndex: true, // Build indexes in development
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host} | DB: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database Error] Connection Failed: ${error.message}`);
    // Exit process with failure code if DB connection is unavailable
    process.exit(1);
  }
};

export default connectDB;
