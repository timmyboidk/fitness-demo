import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { SessionItem } from '../SessionItem';

const mockItem = {
    id: 's1',
    name: 'Morning Cardio',
    color: '#FF0000',
    time: '30m',
    count: '5',
    moves: [], // 假设 moves 数组存在于 Session 类型中
    date: '2023-01-01',
};

describe('SessionItem', () => {
    it('renders correctly', () => {
        const { getByText, getByTestId } = render(<SessionItem item={mockItem} />);

        expect(getByText('Morning Cardio')).toBeTruthy();
        expect(getByText('30m')).toBeTruthy();
        expect(getByText('5')).toBeTruthy();
        // 如果没有添加/删除按钮，默认显示播放按钮
        expect(getByTestId('symbol-play.fill')).toBeTruthy();
    });

    it('navigates on press', () => {
        const { getByText } = render(<SessionItem item={mockItem} />);
        fireEvent.press(getByText('Morning Cardio'));
        expect(router.push).toHaveBeenCalledWith('/workout/s1?mode=session');
    });

    it('calls onAdd', () => {
        const onAdd = jest.fn();
        const { getByTestId } = render(<SessionItem item={mockItem} showAddButton onAdd={onAdd} />);
        fireEvent.press(getByTestId('symbol-plus.circle.fill'));
        expect(onAdd).toHaveBeenCalled();
    });

    it('calls onRemove', () => {
        const onRemove = jest.fn();
        const { getByTestId } = render(<SessionItem item={mockItem} showRemoveButton onRemove={onRemove} />);
        fireEvent.press(getByTestId('symbol-minus.circle.fill'));
        expect(onRemove).toHaveBeenCalled();
    });
});
