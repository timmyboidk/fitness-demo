/**
 * @file auth-signup-test.tsx
 * @description 注册页面集成测试
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import SignupScreen from '../(auth)/signup';
import { authService } from '../../services/AuthService';

// Mock Services
jest.mock('../../services/AuthService', () => ({
    authService: {
        verifyOTP: jest.fn(),
    },
}));

// Mock Modules
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

jest.mock('expo-router', () => ({
    router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
}));

jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({ top: 0, bottom: 0 }),
    SafeAreaView: ({ children }: any) => children,
}));

jest.mock('@expo/vector-icons', () => ({
    Ionicons: ({ name }: any) => {
        const { Text } = require('react-native');
        return <Text>{name}</Text>;
    },
}));

jest.spyOn(Alert, 'alert');

describe('SignupScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        const { getByText, getByTestId } = render(<SignupScreen />);
        expect(getByText('加入 FITBODY')).toBeTruthy();
        expect(getByTestId('nickname-input')).toBeTruthy();
        expect(getByTestId('phone-input')).toBeTruthy();
    });

    it('validates empty inputs', () => {
        const { getByTestId, getByText } = render(<SignupScreen />);
        fireEvent.press(getByTestId('signup-button'));
        expect(Alert.alert).toHaveBeenCalledWith("提示", "请输入有效的手机号和验证码");
    });

    it('validates nickname length', () => {
        const { getByTestId } = render(<SignupScreen />);
        fireEvent.changeText(getByTestId('phone-input'), '13812345678');
        fireEvent.changeText(getByTestId('code-input'), '1234');
        fireEvent.changeText(getByTestId('nickname-input'), 'A'); // Short

        fireEvent.press(getByTestId('signup-button'));
        expect(Alert.alert).toHaveBeenCalledWith("提示", "请设置一个昵称");
    });

    it('handles successful signup', async () => {
        const mockUser = { id: 'u1', token: 'jwt', nickname: 'NewUser' };
        (authService.verifyOTP as jest.Mock).mockResolvedValue({ success: true, user: mockUser });

        const { getByTestId } = render(<SignupScreen />);
        fireEvent.changeText(getByTestId('nickname-input'), 'NewUser');
        fireEvent.changeText(getByTestId('phone-input'), '13812345678');
        fireEvent.changeText(getByTestId('code-input'), '1234');

        fireEvent.press(getByTestId('signup-button'));

        await waitFor(() => {
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('user_token', 'jwt');
            expect(router.replace).toHaveBeenCalledWith({
                pathname: '/onboarding/difficulty',
                params: { userId: 'u1' }
            });
        });
    });

    it('handles API failure', async () => {
        (authService.verifyOTP as jest.Mock).mockResolvedValue({ success: false, message: 'Invalid code' });

        const { getByTestId } = render(<SignupScreen />);
        fireEvent.changeText(getByTestId('nickname-input'), 'NewUser');
        fireEvent.changeText(getByTestId('phone-input'), '13812345678');
        fireEvent.changeText(getByTestId('code-input'), '1234');

        fireEvent.press(getByTestId('signup-button'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("错误", "Invalid code");
        });
    });

    it('navigates back', () => {
        const { getByText } = render(<SignupScreen />);
        fireEvent.press(getByText('arrow-back'));
        expect(router.back).toHaveBeenCalled();
    });
});
