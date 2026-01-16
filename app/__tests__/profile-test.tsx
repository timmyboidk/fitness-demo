/**
 * @file profile-test.tsx
 * @description 个人中心集成测试。
 * 验证已登录/未登录状态下的 UI 展示。
 * 测试统计数据渲染、菜单跳转以及 AsyncStorage 异常处理。
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import ProfileScreen from '../(tabs)/profile';

// Mock AsyncStorage (异步存储)
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
}));

describe('ProfileScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders guest state initially', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

        const { getByText } = render(<ProfileScreen />);

        // Wait for effect
        await waitFor(() => { });

        expect(getByText('未登录用户')).toBeTruthy();
        expect(getByText('点击登录')).toBeTruthy();
    });

    it('renders user state when logged in', async () => {
        const mockUser = {
            nickname: 'Timmy',
            _id: '1234567890',
            avatar: 'http://test.com/avatar.png',
            stats: { totalWorkouts: 10, accuracyAvg: 85, activeDays: 5 }
        };
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));

        const { getByText } = render(<ProfileScreen />);

        // Wait for effect
        await waitFor(() => expect(getByText('Timmy')).toBeTruthy());

        // Check ID formatting (last 6 chars uppercase)
        expect(getByText('ID: 567890')).toBeTruthy();

        // Check stats
        expect(getByText('10')).toBeTruthy(); // totalWorkouts
        expect(getByText('85%')).toBeTruthy(); // accuracy
    });

    it('navigates to login when tapping profile as guest', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
        const { getByText } = render(<ProfileScreen />);
        await waitFor(() => { });

        fireEvent.press(getByText('未登录用户'));
        expect(router.push).toHaveBeenCalledWith('/(auth)/login');
    });

    it('does not navigate to login when tapping profile as user', async () => {
        const mockUser = {
            nickname: 'Timmy',
            _id: '1234567890',
            avatar: 'http://test.com/avatar.png',
            stats: { totalWorkouts: 10, accuracyAvg: 85, activeDays: 5 }
        };
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));
        const { getByText } = render(<ProfileScreen />);
        await waitFor(() => { });

        fireEvent.press(getByText('Timmy'));
        expect(router.push).not.toHaveBeenCalledWith('/(auth)/login');
    });

    it('navigates to menu items', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
        const { getByText } = render(<ProfileScreen />);
        await waitFor(() => { });

        fireEvent.press(getByText('设置'));
        expect(router.push).toHaveBeenCalledWith('/profile/settings');
    });

    it('navigates to stats when stats card is pressed', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
        const { getByText } = render(<ProfileScreen />);
        await waitFor(() => { });

        fireEvent.press(getByText('累计训练')); // Stat label inside the card
        expect(router.push).toHaveBeenCalledWith('/profile/stats');
    });

    it('handles AsyncStorage error safely', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage Error'));

        render(<ProfileScreen />);
        await waitFor(() => { });

        expect(consoleSpy).toHaveBeenCalledWith('Failed to load user', expect.any(Error));
        consoleSpy.mockRestore();
    });
});
