import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Move } from '../../store/library';
import { MoveItem } from '../MoveItem';

// Rely on jest-setup.js for expo-symbols mock

describe('MoveItem', () => {
    const mockMove: Move = {
        id: 'm1',
        name: 'Test Move',
        level: 'Easy',
        icon: 'test-icon',
        isVisible: true
    } as any; // Cast as any if other props are required by type but not used in component

    it('should render move details correctly', () => {
        const { getByText } = render(
            <MoveItem item={mockMove} />
        );

        expect(getByText('Test Move')).toBeTruthy();
        expect(getByText('Easy')).toBeTruthy();
    });

    it('should call onAdd when add button is pressed', () => {
        const onAdd = jest.fn();
        const { getByTestId } = render(
            <MoveItem item={mockMove} showAddButton={true} onAdd={onAdd} />
        );

        const icon = getByTestId('symbol-plus.circle.fill');
        fireEvent.press(icon);
        expect(onAdd).toHaveBeenCalled();
    });

    it('should call onRemove when remove button is pressed', () => {
        const onRemove = jest.fn();
        const { getByTestId } = render(
            <MoveItem item={mockMove} showRemoveButton={true} onRemove={onRemove} />
        );

        const icon = getByTestId('symbol-minus.circle.fill');
        fireEvent.press(icon);
        expect(onRemove).toHaveBeenCalled();
    });
});
