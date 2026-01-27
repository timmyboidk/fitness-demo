import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { MoveItem } from '../MoveItem';
import { SessionItem } from '../SessionItem';

describe('Item Components - Function Expansion', () => {
    const mockOnPress = jest.fn();
    const move = { id: 'm1', name: 'Move 1', level: 'Beginner', isVisible: true, icon: 'run' };
    const session = { id: 's1', name: 'Session 1', time: '10 min', count: '5 moves', color: 'red', isVisible: true };

    it('MoveItem calls onPress', () => {
        const { getByText } = render(<MoveItem item={move} onPress={mockOnPress} />);
        fireEvent.press(getByText('Move 1'));
        expect(mockOnPress).toHaveBeenCalled();
    });

    it('SessionItem calls onPress', () => {
        const { getByText } = render(<SessionItem item={session} onPress={mockOnPress} />);
        fireEvent.press(getByText('Session 1'));
        expect(mockOnPress).toHaveBeenCalled();
    });
});
