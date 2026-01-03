import { libraryStore } from '@/store/library';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import SessionsScreen from '../(tabs)/sessions';

jest.mock('@/store/library', () => ({
    libraryStore: {
        getSessions: jest.fn(),
        subscribe: jest.fn((cb) => jest.fn()),
        toggleSessionVisibility: jest.fn(),
    },
}));

describe('SessionsScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders visible sessions', () => {
        (libraryStore.getSessions as jest.Mock).mockReturnValue([
            { id: 's1', name: 'Session 1', isVisible: true, color: 'red', time: '10m', count: '5' },
            { id: 's2', name: 'Session 2', isVisible: false, color: 'blue', time: '20m', count: '6' },
        ]);

        const { getByText, queryByText } = render(<SessionsScreen />);
        expect(getByText('Session 1')).toBeTruthy();
        expect(queryByText('Session 2')).toBeNull();
    });

    it('handles remove interaction', () => {
        (libraryStore.getSessions as jest.Mock).mockReturnValue([
            { id: 's1', name: 'Session 1', isVisible: true, color: 'red', time: '10m', count: '5' }
        ]);

        const { getByTestId } = render(<SessionsScreen />);
        // Remove button in SessionItem is "minus.circle.fill"
        fireEvent.press(getByTestId('symbol-minus.circle.fill'));

        expect(libraryStore.toggleSessionVisibility).toHaveBeenCalledWith('s1');
    });

    it('updates when store notifies', async () => {
        let listener: any;
        (libraryStore.subscribe as jest.Mock).mockImplementation((l) => {
            listener = l;
            return jest.fn();
        });

        (libraryStore.getSessions as jest.Mock).mockReturnValue([]);

        const { getByText, queryByText } = render(<SessionsScreen />);

        expect(queryByText('New Session')).toBeNull();

        (libraryStore.getSessions as jest.Mock).mockReturnValue([
            { id: 's3', name: 'New Session', isVisible: true, color: 'green', time: '5m', count: '1' }
        ]);

        const { act } = require('@testing-library/react-native');
        act(() => {
            listener();
        });

        const newSession = await waitFor(() => getByText('New Session'));
        expect(newSession).toBeTruthy();
    });
});
