import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import * as Haptics from 'expo-haptics';
import { Move } from '../../store/library';
import { MoveItem } from '../MoveItem';

// 依赖 jest-setup.js 中的 expo-symbols、expo-haptics 和 expo-linear-gradient 模拟

describe('MoveItem', () => {
    const mockMove: Move = {
        id: 'm1',
        name: 'Test Move',
        level: 'Easy',
        icon: 'test-icon',
        isVisible: true,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

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

    it('should trigger light haptic feedback on card press', () => {
        const { getByTestId } = render(
            <MoveItem item={mockMove} />
        );

        const card = getByTestId('move-item-m1');
        fireEvent.press(card);
        expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });

    it('should trigger haptic on add press', () => {
        const onAdd = jest.fn();
        const { getByTestId } = render(
            <MoveItem item={mockMove} showAddButton={true} onAdd={onAdd} />
        );

        fireEvent.press(getByTestId('symbol-plus.circle.fill'));
        expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });

    it('should trigger warning haptic on remove press', () => {
        const onRemove = jest.fn();
        const { getByTestId } = render(
            <MoveItem item={mockMove} showRemoveButton={true} onRemove={onRemove} />
        );

        fireEvent.press(getByTestId('symbol-minus.circle.fill'));
        expect(Haptics.notificationAsync).toHaveBeenCalledWith(Haptics.NotificationFeedbackType.Warning);
    });

    it('should render with ScoringConfig data', () => {
        const moveWithConfig: Move = {
            ...mockMove,
            scoringConfig: {
                referenceAngles: [
                    { jointName: 'LEFT_KNEE', targetAngleDeg: 90, toleranceDeg: 10, weight: 0.8 },
                ],
                phases: [],
                minConfidenceThreshold: 0.6,
                maxRepDurationMs: 10000,
            },
        };

        const { getByText } = render(
            <MoveItem item={moveWithConfig} />
        );

        expect(getByText('Test Move')).toBeTruthy();
    });
});
