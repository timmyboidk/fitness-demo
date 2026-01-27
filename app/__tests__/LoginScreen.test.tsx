import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import LoginScreen from '../(auth)/login';
import { useOTP } from '../../hooks/useOTP';
import { authService } from '../../services/AuthService';

// Mock mocks
jest.mock('../../hooks/useOTP');
jest.mock('../../services/AuthService');
jest.spyOn(Alert, 'alert');

describe('LoginScreen', () => {
    const mockSendCode = jest.fn();
    const mockUseOTP = useOTP as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseOTP.mockReturnValue({
            timer: 0,
            isTimerRunning: false,
            sendCode: mockSendCode,
            loading: false,
        });
    });

    it('renders correctly', () => {
        const { getByText, getByPlaceholderText } = render(<LoginScreen />);
        expect(getByText('欢迎回来，请登录您的账号')).toBeTruthy();
        expect(getByPlaceholderText('手机号码')).toBeTruthy();
        expect(getByPlaceholderText('验证码')).toBeTruthy();
    });

    it('validates phone input before sending code', async () => {
        const { getByTestId } = render(<LoginScreen />);
        const sendButton = getByTestId('send-code-button');

        fireEvent.press(sendButton);
        await waitFor(() => {
            expect(mockSendCode).toHaveBeenCalled();
        });
    });

    it('calls sendCode from hook', async () => {
        const { getByTestId } = render(<LoginScreen />);
        const phoneInput = getByTestId('phone-input');
        const sendButton = getByTestId('send-code-button');

        fireEvent.changeText(phoneInput, '13800138000');
        fireEvent.press(sendButton);

        expect(mockSendCode).toHaveBeenCalledWith('13800138000');
    });

    it('handles phone login successfully', async () => {
        (authService.verifyOTP as jest.Mock).mockResolvedValue({
            success: true,
            user: { id: '123', nickname: 'Test User', token: 'token' }
        });

        const { getByTestId } = render(<LoginScreen />);

        fireEvent.changeText(getByTestId('phone-input'), '13800138000');
        fireEvent.changeText(getByTestId('code-input'), '1234');
        fireEvent.press(getByTestId('login-button'));

        await waitFor(() => {
            expect(authService.verifyOTP).toHaveBeenCalledWith('13800138000', '1234');
            expect(AsyncStorage.setItem).toHaveBeenCalled();
            expect(Alert.alert).toHaveBeenCalledWith(
                "登录成功",
                "欢迎回来，Test User",
                expect.any(Array)
            );
        });

        // Simulate pressing OK on the alert
        const alertCalls = (Alert.alert as jest.Mock).mock.calls;
        const lastHelperCall = alertCalls[alertCalls.length - 1]; // Get the last call
        const buttons = lastHelperCall[2];
        buttons[0].onPress();
        expect(router.replace).toHaveBeenCalledWith('/(tabs)');
    });

    it('handles phone login failure', async () => {
        (authService.verifyOTP as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Invalid code'
        });

        const { getByTestId } = render(<LoginScreen />);

        fireEvent.changeText(getByTestId('phone-input'), '13800138000');
        fireEvent.changeText(getByTestId('code-input'), 'invalid');
        fireEvent.press(getByTestId('login-button'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("登录失败", "Invalid code");
        });
    });

    it('handles wechat login', async () => {
        (authService.loginWithWeChat as jest.Mock).mockResolvedValue({
            success: true,
            user: { id: '123', nickname: 'WeChat User' }
        });

        const { getByText } = render(<LoginScreen />);
        fireEvent.press(getByText('微信登录'));

        await waitFor(() => {
            expect(authService.loginWithWeChat).toHaveBeenCalled();
            expect(Alert.alert).toHaveBeenCalledWith(
                "登录成功",
                "欢迎回来，WeChat User",
                expect.any(Array)
            );
        });

        // Simulate pressing OK on the alert
        const alertCalls = (Alert.alert as jest.Mock).mock.calls;
        const lastHelperCall = alertCalls[alertCalls.length - 1];
        const buttons = lastHelperCall[2];
        buttons[0].onPress();
        expect(router.replace).toHaveBeenCalledWith('/(tabs)');
    });
});
