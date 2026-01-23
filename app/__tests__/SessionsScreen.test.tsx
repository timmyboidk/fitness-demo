import { render } from '@testing-library/react-native';
import React from 'react';
import SessionsScreen from '../(tabs)/sessions';
import { libraryStore } from '../../store/library';

jest.mock('../../components/ResourceListScreen', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return {
        ResourceListScreen: ({ data }: any) => <Text>{data.length} sessions</Text>
    };
});

jest.mock('../../store/library', () => ({
    libraryStore: {
        getSessions: jest.fn(() => []),
        subscribe: jest.fn(() => jest.fn()),
        toggleSessionVisibility: jest.fn()
    }
}));

describe('SessionsScreen', () => {
    it('should render sessions list', () => {
        (libraryStore.getSessions as jest.Mock).mockReturnValue([
            { id: '1', isVisible: true },
            { id: '2', isVisible: false }
        ]);

        const { getByText } = render(<SessionsScreen />);

        expect(getByText('1 sessions')).toBeTruthy();
    });
});
