import { authService } from '../AuthService';

describe('AuthService', () => {
    it('requestOTP should return success true (placeholder)', async () => {
        const result = await authService.requestOTP('1234567890');
        expect(result.success).toBe(true);
    });

    it('verifyOTP should return success false (unconnected)', async () => {
        const result = await authService.verifyOTP('1234567890', '123456');
        expect(result.success).toBe(false);
    });

    it('loginWithWeChat should return success false (unconnected)', async () => {
        const result = await authService.loginWithWeChat('test_code');
        expect(result.success).toBe(false);
    });
});
