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

// Mock Expo Router
jest.mock('expo-router', () => ({
    router: { push: jest.fn(), replace: jest.fn(), back: jest.fn(), dismissAll: jest.fn() },
    useFocusEffect: jest.fn((cb) => cb()),
}));

// Mock Vector Icons
jest.mock('@expo/vector-icons', () => ({
    Ionicons: ({ name }: { name: string }) => {
        const { Text } = require('react-native');
        return <Text>{name}</Text>;
    },
    MaterialCommunityIcons: ({ name }: { name: string }) => {
        const { Text } = require('react-native');
        return <Text>{name}</Text>;
    },
}));

describe('ProfileScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders guest state initially', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

        const { getByText } = render(<ProfileScreen />);

        // 等待副作用执行
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

        // 等待副作用执行
        await waitFor(() => expect(getByText('Timmy')).toBeTruthy());

        // 检查 ID 格式 (后6位大写)
        expect(getByText('ID: 567890')).toBeTruthy();

        // 检查统计数据
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

    it('navigates to settings via header', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
        const { getAllByText } = render(<ProfileScreen />);
        await waitFor(() => { });

        // 点击设置图标 (Header 中有两个，任意一个都应触发)
        fireEvent.press(getAllByText('settings-outline')[0]);
        expect(router.push).toHaveBeenCalledWith('/profile/settings');
    });

    it('navigates to stats when stats card is pressed', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
        const { getByText } = render(<ProfileScreen />);
        await waitFor(() => { });

        fireEvent.press(getByText('累计训练')); // 卡片内的统计标签
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
