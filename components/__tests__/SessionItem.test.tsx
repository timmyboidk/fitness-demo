import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import * as Haptics from 'expo-haptics';
import { Session } from '../../store/library';
import { SessionItem } from '../SessionItem';

// 依赖 jest-setup.js 中的 expo-symbols、expo-haptics 和 expo-linear-gradient 模拟

describe('SessionItem', () => {
    const mockSession: Session = {
        id: 's1',
        name: 'Test Session',
        time: '20 mins',
        count: '5 moves',
        color: '#ff0000',
        isVisible: true,
        moveIds: ['m1'],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

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

    it('should trigger light haptic feedback on card press', () => {
        const { getByTestId } = render(
            <SessionItem item={mockSession} />
        );

        const card = getByTestId('session-item-s1');
        fireEvent.press(card);
        expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });

    it('should trigger haptic on add press', () => {
        const onAdd = jest.fn();
        const { getByTestId } = render(
            <SessionItem item={mockSession} showAddButton={true} onAdd={onAdd} />
        );

        fireEvent.press(getByTestId('symbol-plus.circle.fill'));
        expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });

    it('should trigger warning haptic on remove press', () => {
        const onRemove = jest.fn();
        const { getByTestId } = render(
            <SessionItem item={mockSession} showRemoveButton={true} onRemove={onRemove} />
        );

        fireEvent.press(getByTestId('symbol-minus.circle.fill'));
        expect(Haptics.notificationAsync).toHaveBeenCalledWith(Haptics.NotificationFeedbackType.Warning);
    });

    it('should render gradient play button when no action buttons', () => {
        const { getByTestId } = render(
            <SessionItem item={mockSession} />
        );

        expect(getByTestId('linear-gradient')).toBeTruthy();
    });
});
