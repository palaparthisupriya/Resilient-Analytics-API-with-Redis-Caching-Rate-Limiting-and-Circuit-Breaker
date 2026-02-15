const request = require('supertest');
const app = require('../src/app'); // Double check this path!

describe('Analytics API Integration Tests', () => {
    
    test('GET /health should return 200 OK', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('OK');
    });

    test('POST /api/metrics should store a metric', async () => {
        const metric = { timestamp: new Date().toISOString(), value: 85, type: "cpu" };
        const response = await request(app).post('/api/metrics').send(metric);
        expect(response.statusCode).toBe(201);
    });

    test('GET /api/metrics/summary should return data', async () => {
        const response = await request(app).get('/api/metrics/summary?type=cpu');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('avg');
    });
});