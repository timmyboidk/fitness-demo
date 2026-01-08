import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
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

// Mock Expo Router
jest.mock('expo-router', () => ({
    router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock Vector Icons
jest.mock('@expo/vector-icons', () => ({
    Ionicons: ({ name }: { name: string }) => {
        const { Text } = require('react-native');
        return <Text testID={`icon-${name}`}>{name}</Text>;
    },
}));

// Mock SafeArea
jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
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

    it('alerts on invalid phone format', () => {
        const { getByText, getByPlaceholderText } = render(<LoginScreen />);
        const sendBtn = getByText('获取验证码');
        const phoneInput = getByPlaceholderText('手机号码');

        fireEvent.changeText(phoneInput, '123');
        fireEvent.press(sendBtn);
        expect(authService.requestOTP).not.toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith("错误", "请输入正确的11位手机号码");
    });

    it('handles requestOTP success', async () => {
        (authService.requestOTP as jest.Mock).mockResolvedValue({ success: true });
        const { getByText, getByPlaceholderText } = render(<LoginScreen />);
        fireEvent.changeText(getByPlaceholderText('手机号码'), '13800138000');
        fireEvent.press(getByText('获取验证码'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("提示", "验证码已发送 (默认1234)");
        });
    });

    it('handles requestOTP failure', async () => {
        (authService.requestOTP as jest.Mock).mockResolvedValue({ success: false, message: 'Bad network' });
        const { getByText, getByPlaceholderText } = render(<LoginScreen />);
        fireEvent.changeText(getByPlaceholderText('手机号码'), '13800138000');
        fireEvent.press(getByText('获取验证码'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("错误", "Bad network");
        });
    });

    it('handles requestOTP exception', async () => {
        (authService.requestOTP as jest.Mock).mockRejectedValue(new Error('Network error'));
        const { getByText, getByPlaceholderText } = render(<LoginScreen />);
        fireEvent.changeText(getByPlaceholderText('手机号码'), '13800138000');
        fireEvent.press(getByText('获取验证码'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("错误", "发送失败，请稍后重试");
        });
    });

    it('validates empty inputs on login', async () => {
        const { getByText } = render(<LoginScreen />);
        fireEvent.press(getByText('登 录'));
        expect(authService.verifyOTP).not.toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith("提示", "请输入手机号和验证码");
    });

    it('handles login success', async () => {
        const mockUser = { id: '1', nickname: 'Tester' };
        (authService.verifyOTP as jest.Mock).mockResolvedValue({ success: true, user: mockUser });

        const { getByText, getByPlaceholderText } = render(<LoginScreen />);

        fireEvent.changeText(getByPlaceholderText('手机号码'), '13800138000');
        fireEvent.changeText(getByPlaceholderText('验证码'), '1234');
        fireEvent.press(getByText('登 录'));

        await waitFor(() => {
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
            const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
            buttons[0].onPress();
            expect(router.replace).toHaveBeenCalledWith('/(tabs)');
        });
    });

    it('handles login failure', async () => {
        (authService.verifyOTP as jest.Mock).mockResolvedValue({ success: false, message: 'Invalid code' });
        const { getByText, getByPlaceholderText } = render(<LoginScreen />);

        fireEvent.changeText(getByPlaceholderText('手机号码'), '13800138000');
        fireEvent.changeText(getByPlaceholderText('验证码'), '1111');
        fireEvent.press(getByText('登 录'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("登录失败", "Invalid code");
        });
    });

    it('handles login exception', async () => {
        (authService.verifyOTP as jest.Mock).mockRejectedValue(new Error('System error'));
        const { getByText, getByPlaceholderText } = render(<LoginScreen />);

        fireEvent.changeText(getByPlaceholderText('手机号码'), '13800138000');
        fireEvent.changeText(getByPlaceholderText('验证码'), '1234');
        fireEvent.press(getByText('登 录'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("系统错误", "请稍后重试");
        });
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

    it('navigates to signup', () => {
        const { getByText } = render(<LoginScreen />);
        fireEvent.press(getByText('立即注册'));
        expect(router.push).toHaveBeenCalledWith('/(auth)/signup');
    });

    it('navigates back', () => {
        const { getByTestId } = render(<LoginScreen />);
        fireEvent.press(getByTestId('icon-close'));
        expect(router.back).toHaveBeenCalled();
    });
});
