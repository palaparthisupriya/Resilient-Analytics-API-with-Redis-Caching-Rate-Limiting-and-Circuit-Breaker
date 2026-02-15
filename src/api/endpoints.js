const express = require('express');
const router = express.Router();
const rateLimiter = require('../services/rateLimitService');
const cacheService = require('../services/cacheService');
const CircuitBreaker = require('../services/circuitBreaker');
const settings = require('../config/settings');
const externalService = require('../services/externalDataSimulator');

const cb = new CircuitBreaker(
    settings.CIRCUIT_BREAKER.FAILURE_THRESHOLD, 
    settings.CIRCUIT_BREAKER.RESET_TIMEOUT
);

let metricsDB = []; // In-memory store

// Metrics Ingestion
router.post('/metrics', rateLimiter, (req, res) => {
    const { timestamp, value, type } = req.body;
    if (!timestamp || !value || !type) return res.status(400).send("Invalid Data");
    metricsDB.push({ timestamp, value, type });
    res.status(201).json({ message: "Metric stored" });
});

// Summary with Caching
router.get('/metrics/summary', async (req, res) => {
    const { type } = req.query;
    const cacheKey = `summary:${type}`;

    try {
        const summary = await cacheService.getOrSet(cacheKey, settings.CACHE_TTL, async () => {
            const filtered = metricsDB.filter(m => m.type === type);
            const avg = filtered.length ? filtered.reduce((a, b) => a + b.value, 0) / filtered.length : 0;
            return { type, avg };
        });
        res.json({ source: 'cache/db', ...summary });
    } catch (err) {
        res.status(500).send("Error");
    }
});
router.get('/external', async (req, res) => {
    try {
        // The Circuit Breaker wraps the simulator call
        const result = await cb.call(() => externalService.fetchData());
        res.json(result);
    } catch (error) {
        res.status(503).json({ 
            error: error.message,
            status: "Circuit remains CLOSED but request failed" 
        });
    }
});

module.exports = router;