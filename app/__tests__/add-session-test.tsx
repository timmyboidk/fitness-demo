import { libraryStore } from '@/store/library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import AddSessionScreen from '../add-session';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

// 捕获 render props
const mockScreenRender = jest.fn();

// Mock 依赖项
jest.mock('expo-router', () => {
    return {
        Stack: {
            Screen: (props: any) => {
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

// Mock 用于捕获交互
jest.mock('@/components/SessionItem', () => ({
    SessionItem: (props: any) => {
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
        jest.spyOn(Alert, 'alert');
    });

    it('renders empty state when no hidden sessions', () => {
        (libraryStore.getSessions as jest.Mock).mockReturnValue([
            { id: 's1', name: 'Session 1', isVisible: true }
        ]);
        const { getByText } = render(<AddSessionScreen />);
        expect(getByText('所有课程已添加')).toBeTruthy();
    });

    it('renders list and handles add interaction', async () => {
        (libraryStore.getSessions as jest.Mock).mockReturnValue([
            { id: 's2', name: 'Session 2', isVisible: false }
        ]);
        const { getByText, getByTestId } = render(<AddSessionScreen />);

        fireEvent.press(getByTestId('session-item-body'));
        fireEvent.press(getByTestId('session-item-add'));

        await waitFor(() => {
            expect(libraryStore.toggleSessionVisibility).toHaveBeenCalledWith('s2');
            expect(router.back).toHaveBeenCalled();
        });
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

    it('allows VIP user to add unlimited sessions', async () => {
        const vipUser = { isVip: true };
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(vipUser));
        (libraryStore.getSessions as jest.Mock).mockReturnValue([
            { id: 's3', name: 'Session 3', isVisible: false }
        ]);

        const { getAllByTestId } = render(<AddSessionScreen />);
        const addButtons = getAllByTestId('session-item-add');

        fireEvent.press(addButtons[0]);

        await waitFor(() => {
            expect(libraryStore.toggleSessionVisibility).toHaveBeenCalled();
            expect(router.back).toHaveBeenCalled();
        });
    });

    it('prevents free user from adding more than 3 sessions', async () => {
        const freeUser = { isVip: false };
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(freeUser));

        // Mock store to return 3 visible sessions
        (libraryStore.getSessions as jest.Mock).mockReturnValue([
            ...Array(3).fill({ id: 'visible', isVisible: true }),
            { id: 's1', title: 'New Session', isVisible: false, moves: [] }
        ]);

        const { getAllByTestId } = render(<AddSessionScreen />);
        const addButtons = getAllByTestId('session-item-add');

        fireEvent.press(addButtons[0]);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                "达到限制",
                expect.stringContaining("免费版每月限 3 个课程"),
                expect.any(Array)
            );
            expect(libraryStore.toggleSessionVisibility).not.toHaveBeenCalled();
        });
    });
});
