import { libraryStore } from '@/store/library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import AddMoveScreen from '../add-move';

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
            // 我们使用一个函数式组件调用我们的 spy
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
        getMoves: jest.fn(),
        toggleMoveVisibility: jest.fn(),
    },
}));

// Mock 用于捕获交互
jest.mock('@/components/MoveItem', () => ({
    MoveItem: (props: any) => {
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
        jest.spyOn(Alert, 'alert');
    });

    it('renders empty state when no hidden moves', () => {
        (libraryStore.getMoves as jest.Mock).mockReturnValue([
            { id: '1', name: 'Move 1', isVisible: true }
        ]);
        const { getByText } = render(<AddMoveScreen />);
        expect(getByText('所有动作已添加')).toBeTruthy();
    });

    it('renders list and handles add interaction', async () => {
        (libraryStore.getMoves as jest.Mock).mockReturnValue([
            { id: '2', name: 'Move 2', isVisible: false }
        ]);
        const { getByText, getByTestId } = render(<AddMoveScreen />);

        fireEvent.press(getByTestId('move-item-body'));
        fireEvent.press(getByTestId('move-item-add'));

        await waitFor(() => {
            expect(libraryStore.toggleMoveVisibility).toHaveBeenCalledWith('2');
            expect(router.back).toHaveBeenCalled();
        });
    });

    it('renders header with right option null', () => {
        (libraryStore.getMoves as jest.Mock).mockReturnValue([]);
        render(<AddMoveScreen />);

        // 验证 Stack.Screen 被传递了选项，其中 headerRight 返回 null
        expect(mockScreenRender).toHaveBeenCalled();
        const lastCall = mockScreenRender.mock.calls[mockScreenRender.mock.calls.length - 1][0];
        const headerRight = lastCall.options.headerRight;
        expect(typeof headerRight).toBe('function');
        expect(headerRight()).toBeNull();
    });

    it('allows VIP user to add unlimited moves', async () => {
        const vipUser = { isVip: true };
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(vipUser));
        (libraryStore.getMoves as jest.Mock).mockReturnValue([
            { id: '3', name: 'Move 3', isVisible: false }
        ]);

        const { getAllByTestId } = render(<AddMoveScreen />);
        const addButtons = getAllByTestId('move-item-add');

        fireEvent.press(addButtons[0]);

        await waitFor(() => {
            expect(libraryStore.toggleMoveVisibility).toHaveBeenCalled();
            expect(router.back).toHaveBeenCalled();
        });
    });

    it('prevents free user from adding more than 10 moves', async () => {
        const freeUser = { isVip: false };
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(freeUser));

        // Mock store to return 10 visible moves
        (libraryStore.getMoves as jest.Mock).mockReturnValue([
            ...Array(10).fill({ id: 'visible', isVisible: true }),
            { id: 'm1', name: 'New Move', isVisible: false }
        ]);

        const { getAllByTestId } = render(<AddMoveScreen />);
        const addButtons = getAllByTestId('move-item-add');

        fireEvent.press(addButtons[0]);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                "达到限制",
                expect.stringContaining("免费版最多只能添加 10 个动作"),
                expect.any(Array)
            );
            expect(libraryStore.toggleMoveVisibility).not.toHaveBeenCalled();
        });
    });
});
