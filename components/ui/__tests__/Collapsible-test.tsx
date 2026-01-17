import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { Collapsible } from '../collapsible';

// Mock ThemedText 和 ThemedView 为简单的占位符以避免复杂性
jest.mock('@/components/themed-text', () => ({
    ThemedText: ({ children }: any) => {
        const { Text } = require('react-native');
        return <Text>{children}</Text>;
    },
}));
jest.mock('@/components/themed-view', () => ({
    ThemedView: ({ children, style }: any) => {
        const { Text } = require('react-native');
        return <Text style={style}>{children}</Text>;
    },
}));

describe('Collapsible', () => {
    it('toggles content visibility', () => {
        const { getByText, queryByText } = render(
            <Collapsible title="More Info">
                <Text>Hidden Detail</Text>
            </Collapsible>
        );

        // 初始状态内容应隐藏
        expect(getByText('More Info')).toBeTruthy();
        expect(queryByText('Hidden Detail')).toBeNull();

        // 点击展开
        fireEvent.press(getByText('More Info'));
        expect(getByText('Hidden Detail')).toBeTruthy();

        // 点击收起
        fireEvent.press(getByText('More Info'));
        expect(queryByText('Hidden Detail')).toBeNull();
    });
});
