import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { libraryStore } from '../../store/library';
import AddMoveScreen from '../add-move';

jest.mock('../../components/GenericSelectionScreen', () => {
    const React = require('react');
    const { Text } = require('react-native');

    return {
        GenericSelectionScreen: ({ data, renderItem }: any) => (
            <>
                <Text>{data.length} items</Text>
                {data.map((item: any) => <React.Fragment key={item.id}>{renderItem({ item })}</React.Fragment>)}
            </>
        )
    };
});

jest.mock('../../store/library', () => ({
    libraryStore: {
        getMoves: jest.fn(() => []),
        toggleMoveVisibility: jest.fn()
    }
}));

const mockCheckLimit = jest.fn();
jest.mock('../../hooks/useFeatureLimit', () => ({
    useFeatureLimit: jest.fn(() => ({
        checkLimit: mockCheckLimit
    }))
}));
jest.mock('../../components/MoveItem', () => {
    const React = require('react');
    const { Button } = require('react-native');
    return {
        MoveItem: ({ onAdd }: any) => <Button title="Add" onPress={onAdd} testID="add-btn" />
    };
});

describe('AddMoveScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockCheckLimit.mockReset();
        (libraryStore.toggleMoveVisibility as jest.Mock).mockClear();
    });

    it('should render invisible moves', () => {
        (libraryStore.getMoves as jest.Mock).mockReturnValue([
            { id: '1', isVisible: true },
            { id: '2', isVisible: false }
        ]);

        const { getByText } = render(<AddMoveScreen />);

        expect(getByText('1 items')).toBeTruthy();
    });

    it('should handle add interaction', async () => {
        (libraryStore.getMoves as jest.Mock).mockReturnValue([
            { id: '2', isVisible: false }
        ]);
        mockCheckLimit.mockResolvedValue(true);

        const { getByTestId } = render(<AddMoveScreen />);

        fireEvent.press(getByTestId('add-btn'));

        expect(mockCheckLimit).toHaveBeenCalledWith('move', expect.any(Number));
        await Promise.resolve();
        expect(libraryStore.toggleMoveVisibility).toHaveBeenCalledWith('2');
        expect(router.back).toHaveBeenCalled();
    });

    it('should not add if limit reached', async () => {
        (libraryStore.getMoves as jest.Mock).mockReturnValue([
            { id: '2', isVisible: false }
        ]);
        mockCheckLimit.mockResolvedValue(false);

        const { getByTestId } = render(<AddMoveScreen />);

        fireEvent.press(getByTestId('add-btn'));

        await Promise.resolve();
        expect(libraryStore.toggleMoveVisibility).not.toHaveBeenCalled();
    });
});
