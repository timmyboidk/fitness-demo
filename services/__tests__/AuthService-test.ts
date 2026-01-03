import { authService } from '../AuthService';

// Mock AsyncStorage
const mockMultiRemove = jest.fn();
jest.mock('@react-native-async-storage/async-storage', () => ({
    __esModule: true,
    default: {
        multiRemove: mockMultiRemove,
    },
}));

// Setup global fetch mock
global.fetch = jest.fn() as jest.Mock;

describe('AuthService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('requestOTP returns success (mock)', async () => {
        const result = await authService.requestOTP('1234567890');
        expect(result.success).toBe(true);
    });

    it('verifyOTP posts to API and returns user on success', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({ success: true, user: { id: '1', nickname: 'Test' } }),
        });

        const result = await authService.verifyOTP('123', '0000');
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/auth'), expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('login_phone')
        }));
        expect(result.success).toBe(true);
        expect(result.user?.nickname).toBe('Test');
    });

    it('verifyOTP handles failures', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({ success: false, error: 'Invalid code' }),
        });

        const result = await authService.verifyOTP('123', '9999');
        expect(result.success).toBe(false);
        expect(result.message).toBe('Invalid code');
    });

    it('verifyOTP handles failures with default message', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({ success: false }),
        });

        const result = await authService.verifyOTP('123', '9999');
        expect(result.success).toBe(false);
        expect(result.message).toBe('Login failed');
    });

    it('verifyOTP handles network errors', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
        const result = await authService.verifyOTP('123', '0000');
        expect(result.success).toBe(false);
        expect(result.message).toBe('Network error');
    });

    it('logout clears async storage', async () => {
        await authService.logout();
        expect(mockMultiRemove).toHaveBeenCalledWith(['user', 'token']);
    });

    it('loginWithWeChat posts to API and returns user', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({ success: true, user: { nickname: 'WeChatUser' } }),
        });

        const result = await authService.loginWithWeChat('code123');
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/auth'), expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('login_wechat')
        }));
        expect(result.success).toBe(true);
        expect(result.user?.nickname).toBe('WeChatUser');
    });

    it('loginWithWeChat handles failure', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({ success: false, error: 'Failed' }),
        });
        const result = await authService.loginWithWeChat('code123');
        expect(result.success).toBe(false);
        expect(result.message).toBe('Failed');
    });

    it('loginWithWeChat handles failure with default message', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({ success: false }),
        });
        const result = await authService.loginWithWeChat('code123');
        expect(result.success).toBe(false);
        expect(result.message).toBe('Login failed');
    });

    it('loginWithWeChat handles network error', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Net err'));
        const result = await authService.loginWithWeChat('code123');
        expect(result.success).toBe(false);
    });
});
