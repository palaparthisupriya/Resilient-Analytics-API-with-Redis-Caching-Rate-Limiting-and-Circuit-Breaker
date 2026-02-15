const Redis = require('ioredis');
const redis = new Redis({ host: process.env.REDIS_HOST || 'localhost' });

const rateLimiter = async (req, res, next) => {
    const ip = req.ip;
    const key = `rate_limit:${ip}`;
    const limit = parseInt(process.env.RATE_LIMIT_THRESHOLD) || 5;

    const current = await redis.get(key);
    
    if (current && parseInt(current) >= limit) {
        const ttl = await redis.ttl(key);
        res.set('Retry-After', ttl);
        return res.status(429).json({ error: "Too Many Requests" });
    }

    const multi = redis.multi();
    multi.incr(key);
    if (!current) multi.expire(key, 60); // 1-minute window
    await multi.exec();
    next();
};

module.exports = rateLimiter;