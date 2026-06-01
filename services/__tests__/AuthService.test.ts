import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../AuthService';
import client from '../api/client';

jest.mock('../api/client');
jest.mock('@react-native-async-storage/async-storage');

describe('AuthService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('verifyOTP', () => {
        it('should return success for demo credentials', async () => {
            (client.post as jest.Mock).mockResolvedValue({
                data: { success: true, data: { id: 'demo', nickname: 'Demo User', token: 'token' } }
            });
            const res = await authService.verifyOTP('13800138000', '1234');
            expect(res.success).toBe(true);
            expect(res.user!.nickname).toBe('Demo User');
        });
        it('should return failure for wrong credentials', async () => {
            (client.post as jest.Mock).mockRejectedValue({
                response: { data: { message: '验证码错误' } }
            });
            const res = await authService.verifyOTP('123', '456');
            expect(res.success).toBe(false);
            expect(res.message).toBe('验证码错误');
        });
    });

    describe('loginWithWeChat', () => {
        it('should return success for mock success code', async () => {
            (client.post as jest.Mock).mockResolvedValue({
                data: { success: true, data: { token: 'wx-token' } }
            });
            const res = await authService.loginWithWeChat('success');
            expect(res.success).toBe(true);
        });
        it('should return failure for other codes', async () => {
            (client.post as jest.Mock).mockRejectedValue({
                response: { data: { message: 'Failed' } }
            });
            const res = await authService.loginWithWeChat('fail');
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
            const res = await authService.upgradeToVip('uid', 'monthly', 'test_receipt');
            expect(res.success).toBe(true);
        });

        it('should handle exception', async () => {
            // 如果可能则强制错误，但代码非常简单。
            // 我们可以模拟 console.log 抛出异常吗？不行。
            // 实际上，我们可以使用 setTimeout 的 spy，但暂时接受没有真实失败难以命中 catch 块的事实。
            // 但如果使用方法本身的 spy，可以手动调用 catch 逻辑。
            // 或者模拟全局 promise。
            jest.spyOn(global, 'setTimeout').mockImplementationOnce(() => { throw new Error('fail'); });
            const res = await authService.upgradeToVip('uid', 'plan', 'test_receipt');
            expect(res.success).toBe(false);
            expect(res.error).toBe('支付验证失败');
        });
    });

    describe('logout', () => {
        it('should remove tokens', async () => {
            await authService.logout();
            expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['user_token', 'user_id']);
        });
    });
});
