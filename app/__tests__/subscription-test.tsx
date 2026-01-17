/**
 * @file subscription-test.tsx
 * @description 订阅页面集成测试
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import { authService } from '../../services/AuthService';
import SubscriptionScreen from '../profile/subscription';

// Mock Services
jest.mock('../../services/AuthService', () => ({
    authService: {
        upgradeToVip: jest.fn(),
    },
}));

// Mock Modules
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

jest.mock('expo-router', () => ({
    router: { push: jest.fn(), back: jest.fn() },
    Stack: { Screen: () => null }, // Mock Stack.Screen
}));

jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: ({ children }: any) => children,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0 }),
}));

jest.mock('@expo/vector-icons', () => ({
    Ionicons: ({ name }: any) => {
        const { Text } = require('react-native');
        return <Text>{name}</Text>;
    },
    MaterialCommunityIcons: ({ name }: any) => {
        const { Text } = require('react-native');
        return <Text>{name}</Text>;
    },
}));

// Spy on Alert
jest.spyOn(Alert, 'alert');

describe('SubscriptionScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        const { getByText } = render(<SubscriptionScreen />);
        expect(getByText('会员中心')).toBeTruthy();
        expect(getByText('PRO 会员')).toBeTruthy();
        expect(getByText('月度会员')).toBeTruthy();
    });

    it('redirects to login if user not logged in', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
        const { getByText } = render(<SubscriptionScreen />);

        fireEvent.press(getByText('月度会员'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("提示", "请先登录");
            expect(router.push).toHaveBeenCalledWith('/(auth)/login');
        });
    });

    it('upgrades successfully', async () => {
        const mockUser = { id: 'u1', isVip: false };
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));
        (authService.upgradeToVip as jest.Mock).mockResolvedValue({ success: true });

        const { getByText } = render(<SubscriptionScreen />);
        fireEvent.press(getByText('月度会员'));

        await waitFor(() => {
            expect(authService.upgradeToVip).toHaveBeenCalledWith('u1', 'monthly');
            expect(Alert.alert).toHaveBeenCalledWith(
                "恭喜",
                "您已成功升级为 VIP 会员！",
                expect.any(Array)
            );
            expect(AsyncStorage.setItem).toHaveBeenCalled();
        });
    });

    it('handles upgrade failure', async () => {
        const mockUser = { id: 'u1' };
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));
        (authService.upgradeToVip as jest.Mock).mockResolvedValue({ success: false, error: 'Failed' });

        const { getByText } = render(<SubscriptionScreen />);
        fireEvent.press(getByText('月度会员'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("支付失败", "Failed");
        });
    });

    it('navigates back', () => {
        const { getByText } = render(<SubscriptionScreen />);
        fireEvent.press(getByText('arrow-back'));
        expect(router.back).toHaveBeenCalled();
    });
});
