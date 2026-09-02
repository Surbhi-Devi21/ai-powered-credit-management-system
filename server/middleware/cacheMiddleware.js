import { getCache, setCache } from '../utils/cache.js';

/**
 * Express In-Memory Route Cache Middleware
 *
 * @param {number} ttlSeconds - Time To Live in seconds (Default: 60s)
 * @param {string} prefix - Key prefix category (e.g. 'dashboard', 'customer')
 */
export const checkCache = (ttlSeconds = 60, prefix = 'cache') => {
  return async (req, res, next) => {
    // Only cache GET requests for authenticated users
    if (req.method !== 'GET' || !req.user?._id) {
      return next();
    }

    const ownerId = req.user._id.toString();
    const cacheKey = `${prefix}:${ownerId}:${req.originalUrl}`;

    try {
      // 1. Check if response is already cached in Redis
      const cachedResponse = await getCache(cacheKey);

      if (cachedResponse) {
        // Cache HIT: Return immediately without hitting MongoDB
        return res.status(200).json({
          ...cachedResponse,
          _cached: true,
        });
      }

      // 2. Cache MISS: Override res.json to capture response payload
      const originalJson = res.json.bind(res);

      res.json = (body) => {
        // Only cache successful 200 responses
        if (res.statusCode === 200 && body?.success) {
          setCache(cacheKey, body, ttlSeconds).catch(() => {});
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      // If cache error occurs, continue seamlessly to controller
      next();
    }
  };
};
