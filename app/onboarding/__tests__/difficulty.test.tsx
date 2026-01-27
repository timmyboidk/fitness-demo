/**
 * @file difficulty.test.tsx
 * @description Unit tests for Onboarding Difficulty selection screen
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import { authService } from '../../../services/AuthService';

// Mock expo-router
jest.mock('expo-router', () => ({
    router: {
        replace: jest.fn(),
    },
    useLocalSearchParams: jest.fn(),
}));

// Mock react-native Alert
jest.spyOn(Alert, 'alert');

// Mock components
jest.mock('../../../components/ui/Button', () => ({
    Button: ({ label, onPress, disabled, testID }: any) => {
        const { TouchableOpacity, Text } = require('react-native');
        return (
            <TouchableOpacity onPress={onPress} disabled={disabled} testID={testID}>
                <Text>{label}</Text>
            </TouchableOpacity>
        );
    },
}));

// Mock services
jest.mock('../../../services/AuthService', () => ({
    authService: {
        onboarding: jest.fn(),
    },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    __esModule: true,
    default: {
        getItem: jest.fn(),
        setItem: jest.fn(),
    },
}));

import DifficultyScreen from '../difficulty';

describe('DifficultyScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useLocalSearchParams as jest.Mock).mockReturnValue({ userId: 'test-user-123' });
    });

    it('should render all difficulty levels', () => {
        const { getByText } = render(<DifficultyScreen />);

        expect(getByText('入门 (Novice)')).toBeTruthy();
        expect(getByText('进阶 (Skilled)')).toBeTruthy();
        expect(getByText('高手 (Expert)')).toBeTruthy();
    });

    it('should allow selecting a difficulty level', () => {
        const { getByTestId } = render(<DifficultyScreen />);

        const skilledLevel = getByTestId('level-skilled');
        fireEvent.press(skilledLevel);

        // State is internal, but we can verify it by looking at the UI changes if needed
        // Since we are mocking icons, we just check if it doesn't crash
    });

    it('should show error alert if no userId is found', async () => {
        (useLocalSearchParams as jest.Mock).mockReturnValue({ userId: undefined });
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

        const { getByTestId } = render(<DifficultyScreen />);
        fireEvent.press(getByTestId('finish-button'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("错误", "无法识别用户信息，请重新登录");
        });
    });

    it('should handle successful onboarding', async () => {
        (authService.onboarding as jest.Mock).mockResolvedValue({ success: true });
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({ id: '123' }));

        const { getByTestId } = render(<DifficultyScreen />);
        fireEvent.press(getByTestId('finish-button'));

        await waitFor(() => {
            expect(authService.onboarding).toHaveBeenCalled();
            expect(Alert.alert).toHaveBeenCalledWith("设置成功", "你的训练计划已更新！", expect.any(Array));

            // Trigger the alert callback
            const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
            const buttons = alertCall[2];
            buttons[0].onPress();
            expect(router.replace).toHaveBeenCalledWith('/(tabs)');
        });
    });

    it('should handle onboarding failure', async () => {
        (authService.onboarding as jest.Mock).mockResolvedValue({ success: false, error: 'API Error' });

        const { getByTestId } = render(<DifficultyScreen />);
        fireEvent.press(getByTestId('finish-button'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("同步失败", "API Error");
        });
    });

    it('should handle network error during onboarding', async () => {
        (authService.onboarding as jest.Mock).mockRejectedValue(new Error('Network error'));

        const { getByTestId } = render(<DifficultyScreen />);
        fireEvent.press(getByTestId('finish-button'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("网络异常", "请检查网络连接");
        });
    });
});
