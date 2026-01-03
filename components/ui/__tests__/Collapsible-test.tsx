import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { Collapsible } from '../collapsible';

// Mock ThemedText and ThemedView to be simple placeholders to avoid complexity
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

        // Initially content is hidden
        expect(getByText('More Info')).toBeTruthy();
        expect(queryByText('Hidden Detail')).toBeNull();

        // Press to open
        fireEvent.press(getByText('More Info'));
        expect(getByText('Hidden Detail')).toBeTruthy();

        // Press to close
        fireEvent.press(getByText('More Info'));
        expect(queryByText('Hidden Detail')).toBeNull();
    });
});
