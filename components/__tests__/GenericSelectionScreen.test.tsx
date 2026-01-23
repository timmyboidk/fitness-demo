import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { GenericSelectionScreen } from '../GenericSelectionScreen';

jest.mock('expo-router', () => {
    const React = require('react');
    return {
        Stack: {
            Screen: () => <></>
        },
        router: {
            back: jest.fn(),
            push: jest.fn()
        }
    };
});

describe('GenericSelectionScreen', () => {
    const mockData = [{ id: '1', name: 'Item 1' }];

    it('should render list items when data exists', () => {
        const { getByText } = render(
            <GenericSelectionScreen
                title="Select Item"
                data={mockData}
                renderItem={({ item }) => <Text>{item.name}</Text>}
                emptyMessage="No items"
            />
        );

        expect(getByText('Item 1')).toBeTruthy();
    });

    it('should render empty message when data is empty', () => {
        const { getByText } = render(
            <GenericSelectionScreen
                title="Select Item"
                data={[]}
                renderItem={({ item }) => <Text>{item.name}</Text>}
                emptyMessage="No items found"
            />
        );

        expect(getByText('No items found')).toBeTruthy();
    });
});
