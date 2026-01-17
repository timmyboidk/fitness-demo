import { authService } from '../AuthService';
import client from '../api/client';

// Mock client (客户端 Mock)
jest.mock('../api/client');
const mockedClient = client as jest.Mocked<typeof client>;

// Mock AsyncStorage (异步存储 Mock)
const mockMultiRemove = jest.fn();
jest.mock('@react-native-async-storage/async-storage', () => ({
    __esModule: true,
    default: {
        multiRemove: mockMultiRemove,
    },
}));

describe('AuthService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('verifyOTP posts to API and returns user on success', async () => {
        // verifyOTP 成功时向 API 发送请求并返回用户
        mockedClient.post.mockResolvedValueOnce({
            data: { success: true, data: { id: '1', nickname: 'Test' } },
        });

        const result = await authService.verifyOTP('123', '0000');
        expect(mockedClient.post).toHaveBeenCalledWith('/api/auth', expect.objectContaining({
            type: 'login_phone',
            phone: '123',
            code: '0000'
        }));
        expect(result.success).toBe(true);
        expect(result.user?.nickname).toBe('Test');
    });

    it('verifyOTP handles failures', async () => {
        // verifyOTP 处理失败情况
        mockedClient.post.mockResolvedValueOnce({
            data: { success: false, message: 'Invalid code' },
        });

        const result = await authService.verifyOTP('123', '9999');
        expect(result.success).toBe(false);
        expect(result.message).toBe('Invalid code');
    });

    it('verifyOTP handles network errors', async () => {
        // verifyOTP 处理网络错误
        mockedClient.post.mockRejectedValueOnce({
            response: { data: { message: 'Network error' } }
        });
        const result = await authService.verifyOTP('123', '0000');
        expect(result.success).toBe(false);
        expect(result.message).toBe('Network error');
    });

    it('onboarding posts to API', async () => {
        // onboarding 向 API 发送请求
        mockedClient.post.mockResolvedValueOnce({
            data: { success: true, data: { scoringTolerance: 5 } },
        });

        const result = await authService.onboarding('1', 'expert');
        expect(mockedClient.post).toHaveBeenCalledWith('/api/auth/onboarding', {
            userId: '1',
            difficultyLevel: 'expert'
        });
        expect(result.success).toBe(true);
    });

    it('logout clears async storage', async () => {
        // logout 清除异步存储
        await authService.logout();
        expect(mockMultiRemove).toHaveBeenCalledWith(['user_token', 'user_id']);
    });
});
