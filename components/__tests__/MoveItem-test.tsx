import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { MoveItem } from '../MoveItem';

// Mock data
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
    });

    it('renders correctly', () => {
        const { getByText, getByTestId } = render(<MoveItem item={mockItem} />);

        expect(getByText('Push Up')).toBeTruthy();
        expect(getByText('Beginner')).toBeTruthy();
        expect(getByTestId('symbol-figure.strengthtraining.traditional')).toBeTruthy();
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

    // "Pressure" / Edge case
    it('handles custom onPress', () => {
        const customPress = jest.fn();
        const { getByText } = render(<MoveItem item={mockItem} onPress={customPress} />);
        fireEvent.press(getByText('Push Up'));
        expect(customPress).toHaveBeenCalled();
        expect(router.push).not.toHaveBeenCalled();
    });
});
