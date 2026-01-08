import { libraryStore } from '@/store/library';
import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import AddSessionScreen from '../add-session';

// Capture render props
const mockScreenRender = jest.fn();

// Mock dependencies
jest.mock('expo-router', () => {
    return {
        Stack: {
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
        getSessions: jest.fn(),
        toggleSessionVisibility: jest.fn(),
    },
}));

// Mocks to capture interactions
jest.mock('@/components/SessionItem', () => ({
    SessionItem: (props) => {
        const { TouchableOpacity, Text } = require('react-native');
        return (
            <>
                <TouchableOpacity testID="session-item-body" onPress={props.onPress}>
                    <Text>Session Body</Text>
                </TouchableOpacity>
                <TouchableOpacity testID="session-item-add" onPress={props.onAdd}>
                    <Text>Add Btn</Text>
                </TouchableOpacity>
            </>
        )
    }
}));

describe('AddSessionScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders empty state when no hidden sessions', () => {
        (libraryStore.getSessions as jest.Mock).mockReturnValue([
            { id: 's1', name: 'Session 1', isVisible: true }
        ]);
        const { getByText } = render(<AddSessionScreen />);
        expect(getByText('所有课程已添加')).toBeTruthy();
    });

    it('renders list and handles add interaction', () => {
        (libraryStore.getSessions as jest.Mock).mockReturnValue([
            { id: 's2', name: 'Session 2', isVisible: false }
        ]);
        const { getByText, getByTestId } = render(<AddSessionScreen />);

        fireEvent.press(getByTestId('session-item-body'));
        fireEvent.press(getByTestId('session-item-add'));

        expect(libraryStore.toggleSessionVisibility).toHaveBeenCalledWith('s2');
        expect(router.back).toHaveBeenCalled();
    });

    it('renders header with right option null', () => {
        (libraryStore.getSessions as jest.Mock).mockReturnValue([]);
        render(<AddSessionScreen />);

        expect(mockScreenRender).toHaveBeenCalled();
        const lastCall = mockScreenRender.mock.calls[mockScreenRender.mock.calls.length - 1][0];
        const headerRight = lastCall.options.headerRight;
        expect(typeof headerRight).toBe('function');
        expect(headerRight()).toBeNull();
    });
});
