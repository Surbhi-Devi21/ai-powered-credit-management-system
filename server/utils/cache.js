import { getRedisClient, isCacheAvailable } from '../config/redis.js';

/**
 * Cache Utility Helper Functions
 * Encapsulates Redis operations with automatic JSON serialization and pattern invalidation.
 */

/**
 * Retrieve cached JSON data by key
 */
export const getCache = async (key) => {
  if (!isCacheAvailable()) return null;
  try {
    const redis = getRedisClient();
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

/**
 * Store data in Redis with Time-To-Live (TTL) in seconds
 */
export const setCache = async (key, value, ttlSeconds = 60) => {
  if (!isCacheAvailable()) return false;
  try {
    const redis = getRedisClient();
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Delete a specific key from Redis
 */
export const deleteCache = async (key) => {
  if (!isCacheAvailable()) return false;
  try {
    const redis = getRedisClient();
    await redis.del(key);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Invalidate all keys matching a pattern (e.g., "customer:<ownerId>:*")
 */
export const clearCachePattern = async (pattern) => {
  if (!isCacheAvailable()) return false;
  try {
    const redis = getRedisClient();
    const keys = await redis.keys(pattern);
    if (keys && keys.length > 0) {
      await redis.del(...keys);
    }
    return true;
  } catch (error) {
    return false;
  }
};
