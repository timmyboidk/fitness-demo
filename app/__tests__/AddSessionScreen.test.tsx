import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { useFeatureLimit } from '../../hooks/useFeatureLimit';
import { libraryStore } from '../../store/library';
import AddSessionScreen from '../add-session';

jest.mock('../../components/GenericSelectionScreen', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return {
        GenericSelectionScreen: ({ data, renderItem }: any) => (
            <>
                <Text>{data.length} items</Text>
                {data.map((item: any) => renderItem({ item }))}
            </>
        )
    };
});

jest.mock('../../store/library', () => ({
    libraryStore: {
        getSessions: jest.fn(() => []),
        toggleSessionVisibility: jest.fn()
    }
}));

jest.mock('../../hooks/useFeatureLimit');
jest.mock('../../components/SessionItem', () => {
    const React = require('react');
    const { Button } = require('react-native');
    return {
        SessionItem: ({ onAdd }: any) => <Button title="Add" onPress={onAdd} testID="add-btn" />
    };
});

describe('AddSessionScreen', () => {
    const mockCheckLimit = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useFeatureLimit as jest.Mock).mockReturnValue({ checkLimit: mockCheckLimit });
    });

    it('should render invisible sessions', () => {
        (libraryStore.getSessions as jest.Mock).mockReturnValue([
            { id: '1', isVisible: true },
            { id: '2', isVisible: false }
        ]);

        const { getByText } = render(<AddSessionScreen />);

        expect(getByText('1 items')).toBeTruthy();
    });

    it('should handle add interaction', async () => {
        (libraryStore.getSessions as jest.Mock).mockReturnValue([
            { id: '2', isVisible: false }
        ]);
        mockCheckLimit.mockResolvedValue(true);

        const { getByTestId } = render(<AddSessionScreen />);

        fireEvent.press(getByTestId('add-btn'));

        expect(mockCheckLimit).toHaveBeenCalledWith('session', expect.any(Number));
        await Promise.resolve();
        expect(libraryStore.toggleSessionVisibility).toHaveBeenCalledWith('2');
        expect(router.back).toHaveBeenCalled();
    });
});
