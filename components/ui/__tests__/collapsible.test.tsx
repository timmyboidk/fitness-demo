/**
 * @file collapsible.test.tsx
 * @description Collapsible 组件的单元测试
 */

import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

// 模拟依赖
let mockColorScheme: 'light' | 'dark' | null = 'light';
jest.mock('@/hooks/use-color-scheme', () => ({
    useColorScheme: () => mockColorScheme,
}));

jest.mock('@/hooks/use-theme-color', () => ({
    useThemeColor: jest.fn(() => '#000000'),
}));

jest.mock('@/constants/theme', () => ({
    Colors: {
        light: { icon: '#687076' },
        dark: { icon: '#9BA1A6' },
    },
}));

jest.mock('@/components/ui/icon-symbol', () => ({
    IconSymbol: ({ name, style }: any) => {
        const { View, Text } = require('react-native');
        return (
            <View testID="icon" style={style}>
                <Text>{name}</Text>
            </View>
        );
    },
}));

jest.mock('@/components/themed-text', () => ({
    ThemedText: ({ children, type }: any) => {
        const { Text } = require('react-native');
        return <Text testID={`text-${type || 'default'}`}>{children}</Text>;
    },
}));

jest.mock('@/components/themed-view', () => ({
    ThemedView: ({ children, style }: any) => {
        const { View } = require('react-native');
        return <View style={style}>{children}</View>;
    },
}));

import { Text } from 'react-native';
import { Collapsible } from '../collapsible';

describe('Collapsible', () => {
    beforeEach(() => {
        mockColorScheme = 'light';
    });

    it('should render title', () => {
        const { getByText } = render(
            <Collapsible title="Section Title">
                <Text>Content</Text>
            </Collapsible>
        );

        expect(getByText('Section Title')).toBeTruthy();
    });

    it('should not render children when collapsed', () => {
        const { queryByText } = render(
            <Collapsible title="Title">
                <Text>Hidden Content</Text>
            </Collapsible>
        );

        expect(queryByText('Hidden Content')).toBeNull();
    });

    it('should render children when expanded', () => {
        const { getByTestId, getByText } = render(
            <Collapsible title="Title">
                <Text>Visible Content</Text>
            </Collapsible>
        );

        // 点击展开
        fireEvent.press(getByTestId('text-defaultSemiBold'));

        expect(getByText('Visible Content')).toBeTruthy();
    });

    it('should toggle between expanded and collapsed', () => {
        const { getByTestId, queryByText } = render(
            <Collapsible title="Title">
                <Text>Toggle Content</Text>
            </Collapsible>
        );

        const titleButton = getByTestId('text-defaultSemiBold');

        // 初始折叠
        expect(queryByText('Toggle Content')).toBeNull();

        // 展开
        fireEvent.press(titleButton);
        expect(queryByText('Toggle Content')).toBeTruthy();

        // 再次折叠
        fireEvent.press(titleButton);
        expect(queryByText('Toggle Content')).toBeNull();
    });

    it('should rotate icon when expanded', () => {
        const { getByTestId } = render(
            <Collapsible title="Title">
                <Text>Content</Text>
            </Collapsible>
        );

        const icon = getByTestId('icon');

        // 初始未旋转
        expect(icon.props.style).toMatchObject({
            transform: [{ rotate: '0deg' }]
        });

        // 点击展开
        fireEvent.press(getByTestId('text-defaultSemiBold'));

        // 验证旋转（状态更改后需要重新查询）
        const expandedIcon = getByTestId('icon');
        expect(expandedIcon.props.style).toMatchObject({
            transform: [{ rotate: '90deg' }]
        });
    });

    it('should use dark theme colors when in dark mode', () => {
        mockColorScheme = 'dark';

        const { getByTestId } = render(
            <Collapsible title="Dark Mode">
                <Text>Content</Text>
            </Collapsible>
        );

        // 确保在暗黑模式下渲染没有错误
        expect(getByTestId('icon')).toBeTruthy();
    });
});
