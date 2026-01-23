import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../AuthService';
import client from '../api/client';

jest.mock('../api/client');
jest.mock('@react-native-async-storage/async-storage');

describe('AuthService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Placeholders', () => {
        it('requestOTP return successfully', async () => {
            const res = await authService.requestOTP('123');
            expect(res.success).toBe(true);
        });
        it('verifyOTP return fail', async () => {
            const res = await authService.verifyOTP('123', 'code');
            expect(res.success).toBe(false);
        });
        it('loginWithWeChat return fail', async () => {
            const res = await authService.loginWithWeChat('code');
            expect(res.success).toBe(false);
        });
    });

    describe('onboarding', () => {
        it('should call api successfully', async () => {
            (client.post as jest.Mock).mockResolvedValue({
                data: { success: true }
            });
            const res = await authService.onboarding('uid', 'Hard');
            expect(client.post).toHaveBeenCalledWith('/api/auth/onboarding', {
                userId: 'uid',
                difficultyLevel: 'Hard'
            });
            expect(res.success).toBe(true);
        });

        it('should handle failure', async () => {
            (client.post as jest.Mock).mockRejectedValue({
                response: { data: { message: 'Failed' } }
            });
            const res = await authService.onboarding('uid', 'Hard');
            expect(res.success).toBe(false);
            expect(res.error).toBe('Failed');
        });
    });

    describe('upgradeToVip', () => {
        it('should simulate success', async () => {
            const res = await authService.upgradeToVip('uid', 'monthly');
            expect(res.success).toBe(true);
        });
    });

    describe('logout', () => {
        it('should remove tokens', async () => {
            await authService.logout();
            expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['user_token', 'user_id']);
        });
    });
});
