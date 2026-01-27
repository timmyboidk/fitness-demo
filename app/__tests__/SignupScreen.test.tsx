import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import SignupScreen from '../(auth)/signup';
import { useOTP } from '../../hooks/useOTP';
import { authService } from '../../services/AuthService';

// Mock dependencies
jest.mock('../../hooks/useOTP');
jest.mock('../../services/AuthService');
jest.spyOn(Alert, 'alert');

describe('SignupScreen', () => {
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
        const { getByText, getByTestId } = render(<SignupScreen />);
        expect(getByText('加入 FITBODY')).toBeTruthy();
        expect(getByTestId('nickname-input')).toBeTruthy();
        expect(getByTestId('phone-input')).toBeTruthy();
        expect(getByTestId('code-input')).toBeTruthy();
    });

    it('validates inputs before signup', () => {
        const { getByTestId } = render(<SignupScreen />);
        fireEvent.press(getByTestId('signup-button'));
        expect(Alert.alert).toHaveBeenCalledWith("提示", "请输入有效的手机号和验证码");
    });

    it('validates nickname before signup', () => {
        const { getByTestId } = render(<SignupScreen />);
        fireEvent.changeText(getByTestId('phone-input'), '13800138000');
        fireEvent.changeText(getByTestId('code-input'), '1234');
        fireEvent.press(getByTestId('signup-button'));
        expect(Alert.alert).toHaveBeenCalledWith("提示", "请设置一个昵称");
    });

    it('handles signup success', async () => {
        (authService.verifyOTP as jest.Mock).mockResolvedValue({
            success: true,
            user: { id: '123', nickname: 'New User', token: 'token' }
        });

        const { getByTestId } = render(<SignupScreen />);

        fireEvent.changeText(getByTestId('nickname-input'), 'New User');
        fireEvent.changeText(getByTestId('phone-input'), '13800138000');
        fireEvent.changeText(getByTestId('code-input'), '1234');
        fireEvent.press(getByTestId('signup-button'));

        await waitFor(() => {
            expect(authService.verifyOTP).toHaveBeenCalledWith('13800138000', '1234');
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', expect.any(String));
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('user_token', 'token');
            expect(router.replace).toHaveBeenCalledWith({
                pathname: '/onboarding/difficulty',
                params: { userId: '123' }
            });
        });
    });

    it('handles signup failure', async () => {
        (authService.verifyOTP as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Signup failed'
        });

        const { getByTestId } = render(<SignupScreen />);

        fireEvent.changeText(getByTestId('nickname-input'), 'New User');
        fireEvent.changeText(getByTestId('phone-input'), '13800138000');
        fireEvent.changeText(getByTestId('code-input'), '1234');
        fireEvent.press(getByTestId('signup-button'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("错误", "Signup failed");
        });
    });
});
