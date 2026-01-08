import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import LoginScreen from '../(auth)/login';
import { authService } from '../../services/AuthService';

// Mock AuthService
jest.mock('../../services/AuthService', () => ({
    authService: {
        requestOTP: jest.fn(),
        verifyOTP: jest.fn(),
        loginWithWeChat: jest.fn(),
    },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
}));

describe('LoginScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        const { getByText, getByPlaceholderText } = render(<LoginScreen />);
        expect(getByText('FITBODY')).toBeTruthy();
        expect(getByPlaceholderText('手机号码')).toBeTruthy();
        expect(getByPlaceholderText('验证码')).toBeTruthy();
    });

    it('validates phone number on send code', () => {
        const { getByText, getByPlaceholderText } = render(<LoginScreen />);
        const sendBtn = getByText('获取验证码');
        const phoneInput = getByPlaceholderText('手机号码');

        // Invalid phone
        fireEvent.changeText(phoneInput, '123');
        fireEvent.press(sendBtn);
        // Alert should trigger. Since RN Alert is hard to test without mock, 
        // we can assume Validation check prevents service call.
        expect(authService.requestOTP).not.toHaveBeenCalled();
    });

    it('sends OTP code on valid phone', async () => {
        (authService.requestOTP as jest.Mock).mockResolvedValue({ success: true });
        const { getByText, getByPlaceholderText } = render(<LoginScreen />);

        fireEvent.changeText(getByPlaceholderText('手机号码'), '13800138000');
        fireEvent.press(getByText('获取验证码'));

        await waitFor(() => {
            expect(authService.requestOTP).toHaveBeenCalledWith('13800138000');
        });
    });

    it('logs in with phone and code', async () => {
        const mockUser = { id: '1', nickname: 'Tester' };
        (authService.verifyOTP as jest.Mock).mockResolvedValue({ success: true, user: mockUser });

        const { getByText, getByPlaceholderText } = render(<LoginScreen />);

        fireEvent.changeText(getByPlaceholderText('手机号码'), '13800138000');
        fireEvent.changeText(getByPlaceholderText('验证码'), '1234');
        fireEvent.press(getByText('登 录'));

        await waitFor(() => {
            expect(authService.verifyOTP).toHaveBeenCalledWith('13800138000', '1234');
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
            // Alert logic triggers navigation on OK... hard to test synchronous Alert button callback
            // But we can verify service success logic ran.
        });
    });

    it('navigates to signup', () => {
        const { getByText } = render(<LoginScreen />);
        fireEvent.press(getByText('立即注册'));
        expect(router.push).toHaveBeenCalledWith('/(auth)/signup');
    });

    it('handles WeChat login', async () => {
        const mockUser = { id: '2', nickname: 'WeChatUser' };
        (authService.loginWithWeChat as jest.Mock).mockResolvedValue({ success: true, user: mockUser });

        const { getByText } = render(<LoginScreen />);
        fireEvent.press(getByText('微信登录'));

        await waitFor(() => {
            expect(authService.loginWithWeChat).toHaveBeenCalled();
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
        });
    });
});
