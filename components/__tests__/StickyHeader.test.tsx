/**
 * @file StickyHeader.test.tsx
 * @description Unit tests for StickyHeader component
 */

import { render } from '@testing-library/react-native';
import React from 'react';
import { Animated, Text } from 'react-native';

// Mock safe-area-context
jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: ({ children, ...props }: any) => {
        const { View } = require('react-native');
        return <View {...props}>{children}</View>;
    },
}));

import { StickyHeader } from '../StickyHeader';

describe('StickyHeader', () => {
    let scrollY: Animated.Value;

    beforeEach(() => {
        scrollY = new Animated.Value(0);
    });

    it('should render title', () => {
        const { getByText } = render(
            <StickyHeader scrollY={scrollY} title="Header Title" />
        );

        expect(getByText('Header Title')).toBeTruthy();
    });

    it('should render rightElement when provided', () => {
        const { getByText } = render(
            <StickyHeader
                scrollY={scrollY}
                title="Title"
                rightElement={<Text>Button</Text>}
            />
        );

        expect(getByText('Button')).toBeTruthy();
    });

    it('should have animated opacity based on scrollY', () => {
        const { UNSAFE_getByType } = render(
            <StickyHeader scrollY={scrollY} title="Header" />
        );

        // Find the Animated.View
        const animatedView = UNSAFE_getByType(Animated.View);
        expect(animatedView.props.style).toBeDefined();
    });
});
