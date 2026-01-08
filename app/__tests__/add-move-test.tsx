import { libraryStore } from '@/store/library';
import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import AddMoveScreen from '../add-move';

// Capture render props
const mockScreenRender = jest.fn();

// Mock dependencies
jest.mock('expo-router', () => {
    return {
        Stack: {
            // We use a functional component that calls our spy
            Screen: (props) => {
                mockScreenRender(props);
                return null;
            }
        },
        router: { back: jest.fn() }
    };
});

jest.mock('@/store/library', () => ({
    libraryStore: {
        getMoves: jest.fn(),
        toggleMoveVisibility: jest.fn(),
    },
}));

// Mocks to capture interactions
jest.mock('@/components/MoveItem', () => ({
    MoveItem: (props) => {
        const { TouchableOpacity, Text } = require('react-native');
        return (
            <>
                <TouchableOpacity testID="move-item-body" onPress={props.onPress}>
                    <Text>Move Body</Text>
                </TouchableOpacity>
                <TouchableOpacity testID="move-item-add" onPress={props.onAdd}>
                    <Text>Add Btn</Text>
                </TouchableOpacity>
            </>
        )
    }
}));

describe('AddMoveScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders empty state when no hidden moves', () => {
        (libraryStore.getMoves as jest.Mock).mockReturnValue([
            { id: '1', name: 'Move 1', isVisible: true }
        ]);
        const { getByText } = render(<AddMoveScreen />);
        expect(getByText('所有动作已添加')).toBeTruthy();
    });

    it('renders list and handles add interaction', () => {
        (libraryStore.getMoves as jest.Mock).mockReturnValue([
            { id: '2', name: 'Move 2', isVisible: false }
        ]);
        const { getByText, getByTestId } = render(<AddMoveScreen />);

        fireEvent.press(getByTestId('move-item-body'));
        fireEvent.press(getByTestId('move-item-add'));

        expect(libraryStore.toggleMoveVisibility).toHaveBeenCalledWith('2');
        expect(router.back).toHaveBeenCalled();
    });

    it('renders header with right option null', () => {
        (libraryStore.getMoves as jest.Mock).mockReturnValue([]);
        render(<AddMoveScreen />);

        // Verify Stack.Screen was passed options where headerRight returns null
        expect(mockScreenRender).toHaveBeenCalled();
        const lastCall = mockScreenRender.mock.calls[mockScreenRender.mock.calls.length - 1][0];
        const headerRight = lastCall.options.headerRight;
        expect(typeof headerRight).toBe('function');
        expect(headerRight()).toBeNull();
    });
});
