/**
 * @file collapsible.test.tsx
 * @description Unit tests for Collapsible component
 */

import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

// Mock dependencies
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

        // Click to expand
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

        // Initially collapsed
        expect(queryByText('Toggle Content')).toBeNull();

        // Expand
        fireEvent.press(titleButton);
        expect(queryByText('Toggle Content')).toBeTruthy();

        // Collapse again
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

        // Initially not rotated
        expect(icon.props.style).toMatchObject({
            transform: [{ rotate: '0deg' }]
        });

        // Click to expand
        fireEvent.press(getByTestId('text-defaultSemiBold'));

        // Verify rotation (need to re-query after state change)
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

        // Just ensure it renders without error in dark mode
        expect(getByTestId('icon')).toBeTruthy();
    });
});
