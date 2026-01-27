import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import SessionsScreen from '../(tabs)/sessions';
import { libraryStore } from '../../store/library';

// Don't mock ResourceListScreen
// jest.mock('../../components/ResourceListScreen', ...);

// Mock SafeAreaView
jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../../store/library', () => ({
    libraryStore: {
        getSessions: jest.fn(() => []),
        subscribe: jest.fn(() => jest.fn()),
        toggleSessionVisibility: jest.fn()
    }
}));

jest.mock('../../components/StickyHeader', () => ({
    __esModule: true,
    StickyHeader: ({ title }: any) => {
        const { Text } = require('react-native');
        return <Text>{title}</Text>;
    }
}));

describe('SessionsScreen', () => {
    it('should render sessions list', () => {
        (libraryStore.getSessions as jest.Mock).mockReturnValue([
            { id: '1', isVisible: true },
            { id: '2', isVisible: false }
        ]);

        const { getByText } = render(<SessionsScreen />);

        expect(getByText('1 sessions')).toBeTruthy();
    });

    it('should handle session selection', () => {
        const sessions = [{ id: 's1', name: 'S1', isVisible: true, time: '10', count: '5', color: 'red' }];
        (libraryStore.getSessions as jest.Mock).mockReturnValue(sessions);

        const { getByText } = render(<SessionsScreen />);
        fireEvent.press(getByText('S1'));
        expect(require('expo-router').router.push).toHaveBeenCalledWith('/workout/s1?mode=session');
    });
});
