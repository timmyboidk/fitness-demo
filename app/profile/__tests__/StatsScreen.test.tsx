import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import StatsScreen from '../stats';

describe.skip('StatsScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        const { getByText } = render(<StatsScreen />);
        expect(getByText('训练数据详情')).toBeTruthy();
        expect(getByText('本周运动时长')).toBeTruthy();
        expect(getByText('累计消耗')).toBeTruthy();
    });

    it('handles back navigation', () => {
        const { getByTestId } = render(<StatsScreen />);
        fireEvent.press(getByTestId('header-back-button'));
        expect(router.back).toHaveBeenCalled();
    });
});
