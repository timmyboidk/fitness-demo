import { act, renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { authService } from '../../services/AuthService';
import { useOTP } from '../useOTP';

// Mock AuthService
jest.mock('../../services/AuthService', () => ({
    authService: {
        requestOTP: jest.fn(),
    },
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('useOTP', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useOTP());
        expect(result.current.timer).toBe(0);
        expect(result.current.isTimerRunning).toBe(false);
        expect(result.current.loading).toBe(false);
    });

    it('should show alert for invalid phone number', async () => {
        const { result } = renderHook(() => useOTP());

        await act(async () => {
            const success = await result.current.sendCode('123');
            expect(success).toBe(false);
        });

        expect(Alert.alert).toHaveBeenCalledWith("错误", "请输入正确的11位手机号码");
        expect(result.current.isTimerRunning).toBe(false);
        expect(authService.requestOTP).not.toHaveBeenCalled();
    });

    it('should send code successfully and start timer', async () => {
        (authService.requestOTP as jest.Mock).mockResolvedValue({ success: true });
        const { result } = renderHook(() => useOTP());

        await act(async () => {
            const success = await result.current.sendCode('13800138000');
            expect(success).toBe(true);
        });

        expect(authService.requestOTP).toHaveBeenCalledWith('13800138000');
        expect(result.current.isTimerRunning).toBe(true);
        expect(result.current.timer).toBe(60);
        expect(Alert.alert).toHaveBeenCalledWith("提示", "验证码已发送 (默认1234)");

        // Fast-forward timer
        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(result.current.timer).toBe(59);
    });

    it('should handle API failure', async () => {
        (authService.requestOTP as jest.Mock).mockResolvedValue({ success: false, message: 'Failed' });
        const { result } = renderHook(() => useOTP());

        await act(async () => {
            const success = await result.current.sendCode('13800138000');
            expect(success).toBe(false);
        });

        expect(Alert.alert).toHaveBeenCalledWith("错误", "Failed");
        expect(result.current.isTimerRunning).toBe(false);
        expect(result.current.timer).toBe(0);
    });

    it('should handle API exception', async () => {
        (authService.requestOTP as jest.Mock).mockRejectedValue(new Error('Network Error'));
        const { result } = renderHook(() => useOTP());

        await act(async () => {
            const success = await result.current.sendCode('13800138000');
            expect(success).toBe(false);
        });

        expect(Alert.alert).toHaveBeenCalledWith("错误", "发送失败，请稍后重试");
        expect(result.current.isTimerRunning).toBe(false);
    });

    it('should stop timer when it reaches 0', async () => {
        (authService.requestOTP as jest.Mock).mockResolvedValue({ success: true });
        const { result } = renderHook(() => useOTP());

        await act(async () => {
            await result.current.sendCode('13800138000');
        });

        act(() => {
            jest.advanceTimersByTime(60000);
        });

        expect(result.current.timer).toBe(0);
        expect(result.current.isTimerRunning).toBe(false);
    });
});
