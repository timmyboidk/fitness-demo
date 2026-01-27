import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store');

const mockRequestUse = jest.fn();
const mockResponseUse = jest.fn();

jest.mock('axios', () => {
    const instance = {
        interceptors: {
            request: { use: mockRequestUse },
            response: { use: mockResponseUse }
        },
        defaults: { headers: { common: {} } },
        get: jest.fn(),
        post: jest.fn(),
    };

    return {
        __esModule: true,
        default: {
            create: jest.fn(() => instance),
            isAxiosError: jest.fn(),
            defaults: { headers: { common: {} } },
        },
    };
});

import client from '../api/client';

describe('API Client', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(client).toBeDefined();
    });

    describe('Environment', () => {
        it('should have interceptors registered', () => {
            expect(mockRequestUse).toHaveBeenCalled();
            expect(mockResponseUse).toHaveBeenCalled();
        });
    });

    describe('Mock Interceptor (First interceptor)', () => {
        const getMockInterceptor = () => mockRequestUse.mock.calls[0][0];

        it('should handle debug login', async () => {
            const interceptor = getMockInterceptor();
            const config = { url: '/api/auth', method: 'post', data: { phone: '9999', code: '0000' } };

            try {
                await interceptor(config);
            } catch (error: any) {
                expect(error.response.data.success).toBe(true);
                expect(error.response.data.data.nickname).toBe('Debug User');
            }
        });

        it('should handle normal mock login', async () => {
            const interceptor = getMockInterceptor();
            const config = { url: '/api/auth', method: 'post', data: { phone: '123' } };

            try {
                await interceptor(config);
            } catch (error: any) {
                expect(error.response.data.success).toBe(true);
                expect(error.response.data.data.nickname).toBe('Demo User');
            }
        });

        it('should handle library sync', async () => {
            const interceptor = getMockInterceptor();
            const config = { url: '/api/library', method: 'get' };

            try {
                await interceptor(config);
            } catch (error: any) {
                expect(error.response.data.success).toBe(true);
                expect(error.response.data.data.moves).toBeDefined();
            }
        });

        it('should handle AI scoring', async () => {
            const interceptor = getMockInterceptor();
            const config = { url: '/api/ai/score', method: 'post' };

            try {
                await interceptor(config);
            } catch (error: any) {
                expect(error.response.data.score).toBe(92);
            }
        });

        it('should handle analytics collection', async () => {
            const interceptor = getMockInterceptor();
            const config = { url: '/api/data/collect' };
            try {
                await interceptor(config);
            } catch (error: any) {
                expect(error.response.status).toBe(200);
            }
        });

        it('should handle model updates', async () => {
            const interceptor = getMockInterceptor();
            const config = { url: '/api/core/models/latest' };
            try {
                await interceptor(config);
            } catch (error: any) {
                expect(error.response.status).toBe(200);
            }
        });

        it('should handle onboarding', async () => {
            const interceptor = getMockInterceptor();
            const config = { url: '/api/auth/onboarding' };
            try {
                await interceptor(config);
            } catch (error: any) {
                expect(error.response.status).toBe(200);
            }
        });

        it('should handle unknown endpoints with 404', async () => {
            const interceptor = getMockInterceptor();
            const config = { url: '/api/unknown' };
            try {
                await interceptor(config);
            } catch (error: any) {
                expect(error.response.status).toBe(404);
            }
        });
    });

    describe('Auth Interceptor (Second interceptor)', () => {
        const getAuthInterceptor = () => mockRequestUse.mock.calls[1][0];

        it('should inject token if exists', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('my-token');
            const interceptor = getAuthInterceptor();
            const config = { headers: {} as any };
            await interceptor(config);
            expect(config.headers.Authorization).toBe('Bearer my-token');
        });

        it('should not inject token if missing', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
            const interceptor = getAuthInterceptor();
            const config = { headers: {} as any };
            await interceptor(config);
            expect(config.headers.Authorization).toBeUndefined();
        });
    });

    describe('Response Interceptor', () => {
        const getHandlers = () => mockResponseUse.mock.calls[0];

        it('should return response on success', async () => {
            const [successHandler] = getHandlers();
            const response = { status: 200, data: { ok: true } };
            const result = successHandler(response);
            expect(result).toBe(response);
        });

        it('should handle 401 and delete token', async () => {
            const [, errorHandler] = getHandlers();
            const error = { response: { status: 401 } };

            try {
                await errorHandler(error);
            } catch (e) {
                expect(e).toBe(error);
            }
            expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('user_token');
        });

        it('should reject other errors', async () => {
            const [, errorHandler] = getHandlers();
            const error = { response: { status: 500 } };
            try {
                await errorHandler(error);
            } catch (e) {
                expect(e).toBe(error);
            }
            expect(SecureStore.deleteItemAsync).not.toHaveBeenCalled();
        });
    });
});
