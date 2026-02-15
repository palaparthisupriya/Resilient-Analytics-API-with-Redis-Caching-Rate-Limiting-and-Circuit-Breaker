const Redis = require('ioredis');

// Connect to Redis using environment variables
const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
});

class CacheService {
    /**
     * Get data from cache or fetch and store it if not present.
     * @param {string} key - The unique cache key.
     * @param {number} ttl - Time-to-live in seconds.
     * @param {function} fetchFunction - The logic to run if cache misses.
     */
    async getOrSet(key, ttl, fetchFunction) {
        try {
            // 1. Attempt to retrieve from Redis
            const cachedData = await redis.get(key);

            if (cachedData) {
                console.log(`Cache Hit for key: ${key}`);
                return JSON.parse(cachedData);
            }

            // 2. Cache Miss: Execute the provided function to get fresh data
            console.log(`Cache Miss for key: ${key}. Fetching fresh data...`);
            const freshData = await fetchFunction();

            // 3. Store the fresh data in Redis with the specified TTL
            // SETEX is an atomic command: SET with EXpiration
            await redis.setex(key, ttl, JSON.stringify(freshData));

            return freshData;
        } catch (error) {
            console.error('Cache Service Error:', error);
            // Fallback: If Redis fails, just return fresh data so the API doesn't crash
            return await fetchFunction();
        }
    }

    /**
     * Explicitly invalidate a cache key (useful when data is updated).
     */
    async invalidate(key) {
        await redis.del(key);
    }
}

module.exports = new CacheService();