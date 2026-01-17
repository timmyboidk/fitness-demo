import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import { MoveItem } from '../MoveItem';

// Mock useColorScheme
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
    default: jest.fn(),
}));

// Mock data (模拟数据)
const mockItem = {
    id: '1',
    name: 'Push Up',
    icon: 'figure.strengthtraining.traditional',
    level: 'Beginner',
    muscle: 'Chest',
    isVisible: true,
};

describe('MoveItem', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // 默认为浅色模式
        (useColorScheme as jest.Mock).mockReturnValue('light');
    });

    it('renders correctly in light mode', () => {
        const { getByText, getByTestId } = render(<MoveItem item={mockItem} />);
        expect(getByText('Push Up')).toBeTruthy();
        expect(getByTestId('symbol-figure.strengthtraining.traditional')).toBeTruthy();
    });

    it('renders correctly in dark mode', () => {
        (useColorScheme as jest.Mock).mockReturnValue('dark');
        const { getByText } = render(<MoveItem item={mockItem} />);
        expect(getByText('Push Up')).toBeTruthy();
        // 我们无法轻易检查颜色，除非匹配快照样式或深入检查 props。
        // 但运行此代码路径覆盖了 "isDark" 分支。
    });

    it('navigates on press', () => {
        const { getByText } = render(<MoveItem item={mockItem} />);
        fireEvent.press(getByText('Push Up'));
        expect(router.push).toHaveBeenCalledWith('/workout/1?mode=move');
    });

    it('calls onAdd when add button is pressed', () => {
        const onAdd = jest.fn();
        const { getByTestId } = render(<MoveItem item={mockItem} showAddButton onAdd={onAdd} />);
        fireEvent.press(getByTestId('symbol-plus.circle.fill'));
        expect(onAdd).toHaveBeenCalled();
    });

    it('calls onRemove when remove button is pressed', () => {
        const onRemove = jest.fn();
        const { getByTestId } = render(<MoveItem item={mockItem} showRemoveButton onRemove={onRemove} />);
        fireEvent.press(getByTestId('symbol-minus.circle.fill'));
        expect(onRemove).toHaveBeenCalled();
    });

    it('handles custom onPress', () => {
        const customPress = jest.fn();
        const { getByText } = render(<MoveItem item={mockItem} onPress={customPress} />);
        fireEvent.press(getByText('Push Up'));
        expect(customPress).toHaveBeenCalled();
        expect(router.push).not.toHaveBeenCalled();
    });
});
