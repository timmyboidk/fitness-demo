import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Session } from '../../store/library';
import { SessionItem } from '../SessionItem';

// Rely on jest-setup.js for expo-symbols mock

describe('SessionItem', () => {
    const mockSession: Session = {
        id: 's1',
        name: 'Test Session',
        time: '20 mins',
        count: '5 moves',
        color: '#ff0000',
        isVisible: true,
        moveIds: ['m1']
    };

    it('should render session details', () => {
        const { getByText } = render(
            <SessionItem item={mockSession} />
        );

        expect(getByText('Test Session')).toBeTruthy();
        expect(getByText('20 mins')).toBeTruthy();
        expect(getByText('5 moves')).toBeTruthy();
    });

    it('should trigger onPress', () => {
        const onPress = jest.fn();
        const { getByText } = render(
            <SessionItem item={mockSession} onPress={onPress} />
        );

        fireEvent.press(getByText('Test Session'));
        expect(onPress).toHaveBeenCalled();
    });

    it('should handle add button', () => {
        const onAdd = jest.fn();
        const { getByTestId } = render(
            <SessionItem item={mockSession} showAddButton={true} onAdd={onAdd} />
        );

        fireEvent.press(getByTestId('symbol-plus.circle.fill'));
        expect(onAdd).toHaveBeenCalled();
    });

    it('should handle remove button', () => {
        const onRemove = jest.fn();
        const { getByTestId } = render(
            <SessionItem item={mockSession} showRemoveButton={true} onRemove={onRemove} />
        );

        fireEvent.press(getByTestId('symbol-minus.circle.fill'));
        expect(onRemove).toHaveBeenCalled();
    });
});
