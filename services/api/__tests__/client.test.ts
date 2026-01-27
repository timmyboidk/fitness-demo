/**
 * @file client.test.ts
 * @description Unit tests for API client mock responses
 */

// We'll test the mock behavior by calling the actual client
// and verifying it returns mock data

jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn().mockResolvedValue(null),
    deleteItemAsync: jest.fn(),
}));

describe('API Client Mock Responses', () => {
    let client: any;

    beforeEach(() => {
        jest.resetModules();
        client = require('../client').default;
    });

    it('should return debug user for debug login', async () => {
        try {
            await client.post('/api/auth', { phone: '9999', code: '0000' });
            fail('Should have thrown');
        } catch (e: any) {
            expect(e.response.status).toBe(200);
            expect(e.response.data.success).toBe(true);
            expect(e.response.data.data.id).toBe('debug_user_9999');
        }
    });

    it('should return debug user for email login', async () => {
        try {
            await client.post('/api/auth', { email: '9999', password: '0000' });
            fail('Should have thrown');
        } catch (e: any) {
            expect(e.response.data.data.id).toBe('debug_user_9999');
        }
    });

    it('should return mock user for normal login', async () => {
        try {
            await client.post('/api/auth', { phone: '123', code: '456' });
            fail('Should have thrown');
        } catch (e: any) {
            expect(e.response.data.data.id).toBe('mock_user_001');
        }
    });

    it('should return mock library data', async () => {
        try {
            await client.get('/api/library');
            fail('Should have thrown');
        } catch (e: any) {
            expect(e.response.data.data.moves.length).toBe(3);
        }
    });

    it('should return mock AI score', async () => {
        try {
            await client.post('/api/ai/score', {});
            fail('Should have thrown');
        } catch (e: any) {
            expect(e.response.data.score).toBe(92);
        }
    });

    it('should return success for analytics', async () => {
        try {
            await client.post('/api/data/collect', {});
            fail('Should have thrown');
        } catch (e: any) {
            expect(e.response.data.success).toBe(true);
        }
    });

    it('should return model check response', async () => {
        try {
            await client.get('/api/core/models/latest');
            fail('Should have thrown');
        } catch (e: any) {
            expect(e.response.data.success).toBe(true);
        }
    });

    it('should return onboarding success', async () => {
        try {
            await client.post('/api/auth/onboarding', {});
            fail('Should have thrown');
        } catch (e: any) {
            expect(e.response.data.success).toBe(true);
        }
    });

    it('should return 404 for unknown endpoints', async () => {
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
        try {
            await client.get('/api/unknown');
            fail('Should have thrown');
        } catch (e: any) {
            expect(e.response.status).toBe(404);
        }
        consoleSpy.mockRestore();
    });
});
