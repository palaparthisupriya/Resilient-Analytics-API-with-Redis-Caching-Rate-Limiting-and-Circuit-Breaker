const CircuitBreaker = require('../src/services/circuitBreaker');

describe('Circuit Breaker Unit Tests', () => {
    test('Should transition to OPEN after failure threshold is reached', async () => {
        const threshold = 2;
        const cb = new CircuitBreaker(threshold, 1000);
        const failingAction = async () => { throw new Error("Fail"); };

        // First failure
        try { await cb.call(failingAction); } catch (e) {}
        expect(cb.state).toBe('CLOSED');

        // Second failure (reaches threshold)
        try { await cb.call(failingAction); } catch (e) {}
        expect(cb.state).toBe('OPEN');
    });
});