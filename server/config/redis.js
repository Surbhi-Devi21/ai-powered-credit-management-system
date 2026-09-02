import Redis from 'ioredis';

/**
 * Redis Client Configuration with Graceful Offline Fallback
 * Provides ultra-fast caching while ensuring zero downtime if Redis is offline.
 */
let redisClient = null;
let isRedisReady = false;

export const connectRedis = () => {
  try {
    const redisUrl =
      process.env.REDIS_URL ||
      `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || 6379}`;

    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: true,
      lazyConnect: true,
      retryStrategy: (times) => {
        // If Redis server is not reachable after 3 attempts, stop retrying and fall back to DB
        if (times > 3) {
          return null;
        }
        return Math.min(times * 200, 1000);
      },
    });

    redisClient.on('connect', () => {
      isRedisReady = true;
      console.log('[Redis] Connected to Redis In-Memory Cache Server successfully.');
    });

    redisClient.on('ready', () => {
      isRedisReady = true;
    });

    redisClient.on('error', (err) => {
      isRedisReady = false;
      // Graceful warning notice instead of uncaught crash
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[Redis Notice] Cache offline (${err.message}). Bypassing in-memory cache.`);
      }
    });

    redisClient.on('close', () => {
      isRedisReady = false;
    });

    // Attempt non-blocking initial handshake
    redisClient.connect().catch(() => {
      isRedisReady = false;
    });
  } catch (error) {
    isRedisReady = false;
    console.warn(`[Redis Initialization] Fallback enabled: ${error.message}`);
  }

  return redisClient;
};

export const getRedisClient = () => redisClient;
export const isCacheAvailable = () => isRedisReady && redisClient !== null;
