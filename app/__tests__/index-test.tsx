import { libraryStore } from '@/store/library';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import MovesScreen from '../(tabs)/index';

// We want to use Real MoveItem to test interaction from parent to child, 
// but we mocked it in previous step. 
// If generic mocks (jest-setup) are used, we are good.
// But in the previous specific test file `index-test.tsx` I manually mocked MoveItem. I should remove that manual mock.

// Mock store to control data
jest.mock('@/store/library', () => ({
    libraryStore: {
        getMoves: jest.fn(),
        subscribe: jest.fn((cb) => {
            return jest.fn(); // unsubscribe
        }),
        toggleMoveVisibility: jest.fn(),
    },
}));

describe('MovesScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders visible moves', async () => {
        (libraryStore.getMoves as jest.Mock).mockReturnValue([
            { id: '1', name: 'Move 1', isVisible: true, icon: 'icon1', level: '1' },
            { id: '2', name: 'Move 2', isVisible: false, icon: 'icon2', level: '2' },
        ]);

        const { getByText, queryByText } = render(<MovesScreen />);

        // Should show Move 1
        expect(getByText('Move 1')).toBeTruthy();

        // Should NOT show Move 2
        expect(queryByText('Move 2')).toBeNull();
    });

    it('handles remove interaction', async () => {
        (libraryStore.getMoves as jest.Mock).mockReturnValue([
            { id: '1', name: 'Move 1', isVisible: true, icon: 'icon1', level: '1' },
            { id: '2', name: 'Move 2', isVisible: true, icon: 'icon2', level: '2' },
        ]);

        const { getAllByTestId } = render(<MovesScreen />);

        // Find remove buttons. MoveItem (real or mocked?) 
        // If we didn't mock MoveItem in this file, it uses the real one (or generic mock).
        // Real MoveItem uses SymbolView which is mocked to `symbol-<name>`.
        // Remove icon is "minus.circle.fill".

        const removeButtons = getAllByTestId('symbol-minus.circle.fill');
        expect(removeButtons.length).toBe(2);

        // Click first one
        fireEvent.press(removeButtons[0]);

        expect(libraryStore.toggleMoveVisibility).toHaveBeenCalledWith('1');
    });

    it('updates when store notifies', async () => {
        let listener: any;
        (libraryStore.subscribe as jest.Mock).mockImplementation((l) => {
            listener = l;
            return jest.fn();
        });

        (libraryStore.getMoves as jest.Mock).mockReturnValue([]);

        const { getByText, queryByText, rerender } = render(<MovesScreen />);

        expect(queryByText('New Move')).toBeNull();

        // Update store mock and trigger listener
        (libraryStore.getMoves as jest.Mock).mockReturnValue([
            { id: '3', name: 'New Move', isVisible: true, icon: 'icon3', level: '3' }
        ]);

        expect(listener).toBeDefined();

        // Act
        const { act } = require('@testing-library/react-native');
        act(() => {
            listener();
        });

        // Need to wait for re-render?
        // render does not automatically re-render unless props change or state updates.
        // listener calls setMoves state update.
        // So we just need to wait/expect.

        const newMove = await waitFor(() => getByText('New Move'));
        expect(newMove).toBeTruthy();
    });
});
