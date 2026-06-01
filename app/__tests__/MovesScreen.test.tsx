import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import MovesScreen from '../(tabs)/index';
import { libraryStore } from '../../store/library';

// 不要模拟 ResourceListScreen 以允许内部函数运行
// jest.mock('../../components/ResourceListScreen', ...);

// 模拟 SafeAreaView
jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../../store/library', () => ({
    libraryStore: {
        getMoves: jest.fn(() => []),
        subscribe: jest.fn(() => jest.fn()),
        toggleMoveVisibility: jest.fn()
    }
}));

jest.mock('../../components/StickyHeader', () => ({
    __esModule: true,
    StickyHeader: ({ title }: any) => {
        const { Text } = require('react-native');
        return <Text>{title}</Text>;
    }
}));
describe('MovesScreen', () => {
    it('should handle move selection', () => {
        const moves = [{ id: '1', name: 'Move 1', isVisible: true, level: 'Beginner', icon: 'run' }];
        (libraryStore.getMoves as jest.Mock).mockReturnValue(moves);

        const { getByText } = render(<MovesScreen />);
        fireEvent.press(getByText('Move 1'));
        expect(require('expo-router').router.push).toHaveBeenCalledWith('/workout/1?mode=move');
    });
});
