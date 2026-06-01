/**
 * @file RootLayout.test.tsx
 * @description RootLayout 的单元测试
 */

import { render } from '@testing-library/react-native';
import React from 'react';
import { useColorScheme } from 'react-native';
import RootLayout from '../_layout';

// 模拟 expo-router
jest.mock('expo-router', () => {
    const React = require('react');
    const { View } = require('react-native');
    const Stack = ({ children }: any) => <View>{children}</View>;
    Stack.Screen = () => null;
    return { Stack };
});

// 模拟状态栏
jest.mock('expo-status-bar', () => ({
    StatusBar: () => null,
}));

// 模拟 reanimated
jest.mock('react-native-reanimated', () => ({}));

describe('RootLayout', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render correctly in light mode', () => {
        (useColorScheme as jest.Mock).mockReturnValue('light');
        const { getByTestId } = render(<RootLayout />);
        // 基本的渲染检查
    });

    it('should render correctly in dark mode', () => {
        (useColorScheme as jest.Mock).mockReturnValue('dark');
        const { getByTestId } = render(<RootLayout />);
    });
});
