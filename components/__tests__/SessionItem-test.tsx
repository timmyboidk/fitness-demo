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
    moves: [], // Assuming moves array exists in Session type
    date: '2023-01-01',
};

describe('SessionItem', () => {
    it('renders correctly', () => {
        const { getByText, getByTestId } = render(<SessionItem item={mockItem} />);

        expect(getByText('Morning Cardio')).toBeTruthy();
        expect(getByText('30m')).toBeTruthy();
        expect(getByText('5')).toBeTruthy();
        // Play button shows by default if no add/remove buttons
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
