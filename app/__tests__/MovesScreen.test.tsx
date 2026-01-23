import { render } from '@testing-library/react-native';
import React from 'react';
import MovesScreen from '../(tabs)/index';
import { libraryStore } from '../../store/library';

// Mock generic component to focus on screen logic
jest.mock('../../components/ResourceListScreen', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return {
        ResourceListScreen: ({ data }: any) => <Text>{data.length} items</Text>
    };
});

jest.mock('../../store/library', () => ({
    libraryStore: {
        getMoves: jest.fn(() => []),
        subscribe: jest.fn(() => jest.fn()),
        toggleMoveVisibility: jest.fn()
    }
}));

describe('MovesScreen', () => {
    it('should render moves list', () => {
        (libraryStore.getMoves as jest.Mock).mockReturnValue([
            { id: '1', isVisible: true },
            { id: '2', isVisible: false }
        ]);

        const { getByText } = render(<MovesScreen />);

        // Should only show visible items (1 item)
        expect(getByText('1 items')).toBeTruthy();
    });
});
