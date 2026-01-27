/**
 * @file RootLayout.test.tsx
 * @description Unit tests for RootLayout
 */

import { render } from '@testing-library/react-native';
import React from 'react';
import { useColorScheme } from 'react-native';
import RootLayout from '../_layout';

// Mock expo-router
jest.mock('expo-router', () => {
    const React = require('react');
    const { View } = require('react-native');
    const Stack = ({ children }: any) => <View>{children}</View>;
    Stack.Screen = () => null;
    return { Stack };
});

// Mock status bar
jest.mock('expo-status-bar', () => ({
    StatusBar: () => null,
}));

// Mock reanimated
jest.mock('react-native-reanimated', () => ({}));

describe('RootLayout', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render correctly in light mode', () => {
        (useColorScheme as jest.Mock).mockReturnValue('light');
        const { getByTestId } = render(<RootLayout />);
        // Basic render check
    });

    it('should render correctly in dark mode', () => {
        (useColorScheme as jest.Mock).mockReturnValue('dark');
        const { getByTestId } = render(<RootLayout />);
    });
});
