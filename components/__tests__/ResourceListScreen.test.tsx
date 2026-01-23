import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { ResourceListScreen } from '../ResourceListScreen';

const mockAddPress = jest.fn();

// Mock child components using require to avoid hoisting issues
jest.mock('../StickyHeader', () => {
    const { Text } = require('react-native');
    const React = require('react');
    return {
        StickyHeader: ({ title }: any) => <Text>{title}</Text>
    };
});

jest.mock('../LargeTitle', () => {
    const { Text } = require('react-native');
    const React = require('react');
    return {
        LargeTitle: ({ title }: any) => <Text>Large-{title}</Text>
    };
});

describe('ResourceListScreen', () => {
    const mockData = [{ id: '1', name: 'Item 1' }, { id: '2', name: 'Item 2' }];

    it('should render title and list items', () => {
        const { getByText } = render(
            <ResourceListScreen
                title="Test Title"
                data={mockData}
                renderItem={({ item }) => <Text>{item.name}</Text>}
                onAddPress={mockAddPress}
            />
        );

        expect(getByText('Test Title')).toBeTruthy();
        expect(getByText('Large-Test Title')).toBeTruthy();
        expect(getByText('Item 1')).toBeTruthy();
        expect(getByText('Item 2')).toBeTruthy();
    });
});
