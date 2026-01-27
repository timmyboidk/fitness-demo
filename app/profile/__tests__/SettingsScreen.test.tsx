import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { authService } from '../../../services/AuthService';
import SettingsScreen from '../settings';

jest.mock('../../../services/AuthService');

describe.skip('SettingsScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        const { getByText } = render(<SettingsScreen />);
        expect(getByText('设置')).toBeTruthy();
        expect(getByText('推送通知')).toBeTruthy();
        expect(getByText('退出登录')).toBeTruthy();
    });

    it('handles logout', async () => {
        const { getByText } = render(<SettingsScreen />);
        fireEvent.press(getByText('退出登录'));

        await waitFor(() => {
            expect(authService.logout).toHaveBeenCalled();
            expect(router.replace).toHaveBeenCalledWith('/(tabs)/profile');
        });
    });
});
