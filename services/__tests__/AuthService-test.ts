import { authService } from '../AuthService';
import client from '../api/client';

// Mock client
jest.mock('../api/client');
const mockedClient = client as jest.Mocked<typeof client>;

// Mock AsyncStorage
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
        mockedClient.post.mockResolvedValueOnce({
            data: { success: false, message: 'Invalid code' },
        });

        const result = await authService.verifyOTP('123', '9999');
        expect(result.success).toBe(false);
        expect(result.message).toBe('Invalid code');
    });

    it('verifyOTP handles network errors', async () => {
        mockedClient.post.mockRejectedValueOnce({
            response: { data: { message: 'Network error' } }
        });
        const result = await authService.verifyOTP('123', '0000');
        expect(result.success).toBe(false);
        expect(result.message).toBe('Network error');
    });

    it('onboarding posts to API', async () => {
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
        await authService.logout();
        expect(mockMultiRemove).toHaveBeenCalledWith(['user_token', 'user_id']);
    });
});
