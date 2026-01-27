/**
 * @file themed-view.test.tsx
 * @description Unit tests for ThemedView component
 */

import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

// Mock the theme hook
jest.mock('@/hooks/use-theme-color', () => ({
    useThemeColor: jest.fn(() => '#ffffff'),
}));

import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedView } from '../themed-view';

describe('ThemedView', () => {
    beforeEach(() => {
        (useThemeColor as jest.Mock).mockReturnValue('#ffffff');
    });

    it('should render children', () => {
        const { getByText } = render(
            <ThemedView>
                <Text>Child Content</Text>
            </ThemedView>
        );

        expect(getByText('Child Content')).toBeTruthy();
    });

    it('should apply background color from theme', () => {
        (useThemeColor as jest.Mock).mockReturnValue('#000000');

        const { UNSAFE_getByType } = render(
            <ThemedView>
                <Text>Test</Text>
            </ThemedView>
        );

        const view = UNSAFE_getByType('View');
        const flatStyle = Array.isArray(view.props.style)
            ? view.props.style.flat()
            : [view.props.style];
        expect(flatStyle).toContainEqual(expect.objectContaining({ backgroundColor: '#000000' }));
    });

    it('should pass lightColor and darkColor to useThemeColor', () => {
        render(
            <ThemedView lightColor="#EEE" darkColor="#111">
                <Text>Test</Text>
            </ThemedView>
        );

        expect(useThemeColor).toHaveBeenCalledWith(
            { light: '#EEE', dark: '#111' },
            'background'
        );
    });

    it('should apply custom style', () => {
        const { UNSAFE_getByType } = render(
            <ThemedView style={{ padding: 20 }}>
                <Text>Test</Text>
            </ThemedView>
        );

        const view = UNSAFE_getByType('View');
        const flatStyle = Array.isArray(view.props.style)
            ? view.props.style.flat()
            : [view.props.style];
        expect(flatStyle).toContainEqual(expect.objectContaining({ padding: 20 }));
    });

    it('should pass other props to View', () => {
        const { UNSAFE_getByType } = render(
            <ThemedView testID="themed-view">
                <Text>Test</Text>
            </ThemedView>
        );

        const view = UNSAFE_getByType('View');
        expect(view.props.testID).toBe('themed-view');
    });
});
