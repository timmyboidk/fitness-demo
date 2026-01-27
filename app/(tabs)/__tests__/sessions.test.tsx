/**
 * @file sessions.test.tsx
 * @description Unit tests for Sessions screen
 */

import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { libraryStore } from '../../../store/library';
import SessionsScreen from '../sessions';

// Mock expo-router
jest.mock('expo-router', () => ({
    router: {
        push: jest.fn(),
    },
}));

// Mock store
jest.mock('../../../store/library', () => ({
    libraryStore: {
        getSessions: jest.fn(() => []),
        subscribe: jest.fn(() => jest.fn()),
        toggleSessionVisibility: jest.fn()
    }
}));

// Mock components
jest.mock('../../../components/ResourceListScreen', () => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');
    return {
        ResourceListScreen: ({ data, onAddPress, renderItem }: any) => (
            <View>
                <Text>{data.length} sessions</Text>
                <TouchableOpacity testID="add-button" onPress={onAddPress} />
                {data.map((item: any) => renderItem({ item }))}
            </View>
        )
    };
});

jest.mock('../../../components/SessionItem', () => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');
    return {
        SessionItem: ({ item, onRemove }: any) => (
            <View testID={`session-${item.id}`}>
                <Text>{item.name}</Text>
                <TouchableOpacity testID={`remove-${item.id}`} onPress={onRemove} />
            </View>
        )
    };
});

describe('SessionsScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render sessions list', () => {
        (libraryStore.getSessions as jest.Mock).mockReturnValue([
            { id: 's1', name: 'Session 1', isVisible: true },
            { id: 's2', name: 'Session 2', isVisible: false }
        ]);

        const { getByText } = render(<SessionsScreen />);

        // Should only show visible items (1 item)
        expect(getByText('1 sessions')).toBeTruthy();
        expect(getByText('Session 1')).toBeTruthy();
    });

    it('should navigate to add session', () => {
        const { getByTestId } = render(<SessionsScreen />);
        fireEvent.press(getByTestId('add-button'));
        expect(router.push).toHaveBeenCalledWith('/add-session');
    });

    it('should toggle visibility when onRemove is called', () => {
        (libraryStore.getSessions as jest.Mock).mockReturnValue([
            { id: 's1', name: 'Session 1', isVisible: true }
        ]);

        const { getByTestId } = render(<SessionsScreen />);
        fireEvent.press(getByTestId('remove-s1'));

        expect(libraryStore.toggleSessionVisibility).toHaveBeenCalledWith('s1');
    });
});
