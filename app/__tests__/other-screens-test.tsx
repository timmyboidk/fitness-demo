import { libraryStore } from '@/store/library';
import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import AddMoveScreen from '../add-move';
import AddSessionScreen from '../add-session';
import ModalScreen from '../modal';

// Mock dependencies
jest.mock('expo-router', () => ({
    Stack: { Screen: () => <></> },
    Link: ({ children }: any) => <>{children}</>,
    router: { push: jest.fn(), back: jest.fn() },
    useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
    useLocalSearchParams: () => ({ id: '1', mode: 'move' }),
}));

jest.mock('@/store/library', () => ({
    libraryStore: {
        getMoves: jest.fn(),
        getSessions: jest.fn(),
        toggleMoveVisibility: jest.fn(),
        toggleSessionVisibility: jest.fn(),
    },
}));

// Mock components to simplify rendering but ensure interaction
// We want to verify `onAdd` callback is called.
// Since MoveItem and SessionItem are presentational, we can use real ones OR smart mocks.
// Real ones use `SymbolView` which is mocked globally.
// Let's use real components but mock their dependencies if needed.
// Actually, using real components is better.
// BUT `MoveItem` imports `router` which is mocked.
// Let's mock MoveItem/SessionItem to just render a button we can press.

jest.mock('@/components/MoveItem', () => ({
    MoveItem: ({ onAdd }: any) => {
        const { TouchableOpacity, Text } = require('react-native');
        return (
            <TouchableOpacity onPress={onAdd}>
                <Text>Add Move</Text>
            </TouchableOpacity>
        );
    }
}));

jest.mock('@/components/SessionItem', () => ({
    SessionItem: ({ onAdd }: any) => {
        const { TouchableOpacity, Text } = require('react-native');
        return (
            <TouchableOpacity onPress={onAdd}>
                <Text>Add Session</Text>
            </TouchableOpacity>
        );
    }
}));

jest.mock('@/components/ui/Input', () => ({ Input: () => <></> }));
jest.mock('@/components/ui/Button', () => ({ Button: () => <></> }));

describe('Other Screens', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('AddMoveScreen', () => {
        it('renders empty state when no hidden moves', () => {
            (libraryStore.getMoves as jest.Mock).mockReturnValue([
                { id: '1', name: 'Move 1', isVisible: true }
            ]);
            const { getByText } = render(<AddMoveScreen />);
            expect(getByText('所有动作已添加')).toBeTruthy();
        });

        it('renders list and handles add interaction', () => {
            (libraryStore.getMoves as jest.Mock).mockReturnValue([
                { id: '2', name: 'Move 2', isVisible: false }
            ]);
            const { getByText } = render(<AddMoveScreen />);

            expect(getByText('Add Move')).toBeTruthy();
            fireEvent.press(getByText('Add Move'));

            expect(libraryStore.toggleMoveVisibility).toHaveBeenCalledWith('2');
            expect(router.back).toHaveBeenCalled();
        });
    });

    describe('AddSessionScreen', () => {
        it('renders empty state when no hidden sessions', () => {
            (libraryStore.getSessions as jest.Mock).mockReturnValue([
                { id: 's1', name: 'Session 1', isVisible: true }
            ]);
            const { getByText } = render(<AddSessionScreen />);
            expect(getByText('所有课程已添加')).toBeTruthy();
        });

        it('renders list and handles add interaction', () => {
            (libraryStore.getSessions as jest.Mock).mockReturnValue([
                { id: 's2', name: 'Session 2', isVisible: false }
            ]);
            const { getByText } = render(<AddSessionScreen />);

            expect(getByText('Add Session')).toBeTruthy();
            fireEvent.press(getByText('Add Session'));

            expect(libraryStore.toggleSessionVisibility).toHaveBeenCalledWith('s2');
            expect(router.back).toHaveBeenCalled();
        });
    });

    it('ModalScreen renders', () => {
        const { getByText } = render(<ModalScreen />);
        expect(getByText('This is a modal')).toBeTruthy();
    });
});
