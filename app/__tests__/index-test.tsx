/**
 * @file index-test.tsx
 * @description 首页动作列表集成测试。
 * 验证动作列表渲染、Mock 数据展示以及可见性切换功能。
 * 包含 Store 状态订阅更新的测试。
 */

import { libraryStore } from '@/store/library';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import MovesScreen from '../(tabs)/index';

// 我们希望使用真实的 MoveItem 来测试父子组件交互，但在之前的步骤中可能mock了它。
// 如果使用通用 mock (jest-setup)，则没问题。
// 但在此测试文件中，我们需要确保 MoveItem 的行为符合预期。

// Mock store 控制数据
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
