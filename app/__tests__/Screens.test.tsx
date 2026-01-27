/**
 * @file screens.test.tsx
 * @description Simple rendering tests for the remaining Profile and Onboarding screens 
 * to fill function and branch coverage gaps.
 */

import { render } from '@testing-library/react-native';
import React from 'react';
import OnboardingStart from '../onboarding/index';
import HelpScreen from '../profile/help';
import LeaderboardScreen from '../profile/leaderboard';
import SettingsScreen from '../profile/settings';
import SocialScreen from '../profile/social';

// Mock SafeAreaView
jest.mock('react-native-safe-area-context', () => {
    const { View } = require('react-native');
    return {
        SafeAreaView: ({ children }: any) => <View>{children}</View>,
        useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    };
});

// Mock expo-router
jest.mock('expo-router', () => ({
    router: { push: jest.fn(), replace: jest.fn() },
    useLocalSearchParams: () => ({}),
}));

// Mock icons
jest.mock('@expo/vector-icons', () => ({
    Ionicons: () => null,
}));

describe('Minor Screens Rendering', () => {
    it('OnboardingStart renders', () => {
        const { getByText } = render(<OnboardingStart />);
        expect(getByText(/AI 健身助理/i)).toBeTruthy();
    });

    it('HelpScreen renders', () => {
        const { getByText } = render(<HelpScreen />);
        expect(getByText(/帮助与支持/i)).toBeTruthy();
    });

    it('LeaderboardScreen renders', () => {
        const { getByText } = render(<LeaderboardScreen />);
        expect(getByText(/排行榜/i)).toBeTruthy();
    });

    it('SettingsScreen renders', () => {
        const { getByText } = render(<SettingsScreen />);
        expect(getByText(/系统设置/i)).toBeTruthy();
    });

    it('SocialScreen renders', () => {
        const { getByText } = render(<SocialScreen />);
        expect(getByText(/动态/i)).toBeTruthy();
    });
});
