require('dotenv').config();

const settings = {
    // Server Configuration
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Redis Configuration
    REDIS: {
        HOST: process.env.REDIS_HOST || 'localhost',
        PORT: parseInt(process.env.REDIS_PORT) || 6379,
    },

    // Rate Limiting Logic
    RATE_LIMIT: {
        THRESHOLD: parseInt(process.env.RATE_LIMIT_THRESHOLD) || 5, // Max requests
        WINDOW: 60, // 60 seconds
    },

    // Circuit Breaker Logic
    CIRCUIT_BREAKER: {
        FAILURE_THRESHOLD: parseInt(process.env.CB_FAILURE_THRESHOLD) || 3,
        RESET_TIMEOUT: parseInt(process.env.CB_RESET_TIMEOUT) || 10000, // 10 seconds
    },

    // External Service Simulation
    EXTERNAL_SERVICE: {
        FAILURE_RATE: parseFloat(process.env.EXTERNAL_SERVICE_FAILURE_RATE) || 0.5,
    },

    // Cache TTL Defaults
    CACHE_TTL: 60, // seconds
};

/**
 * Basic validation to ensure required variables are present
 * This prevents the app from starting in a broken state.
 */
const validateConfig = () => {
    if (settings.EXTERNAL_SERVICE.FAILURE_RATE < 0 || settings.EXTERNAL_SERVICE.FAILURE_RATE > 1) {
        throw new Error("EXTERNAL_SERVICE_FAILURE_RATE must be between 0 and 1");
    }
    console.log("✅ Configuration Loaded Successfully");
};

validateConfig();

module.exports = settings;