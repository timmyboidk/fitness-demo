import { render } from '@testing-library/react-native';
import React from 'react';
import { IconSymbol } from '../icon-symbol';

describe('IconSymbol', () => {
    it('renders correctly', () => {
        const { getByTestId } = render(
            <IconSymbol name="house.fill" color="red" size={30} />
        );

        // precise mapping depends on implementation (iOS vs default)
        // If it's iOS (using SymbolView mock):
        // If it's default (using MaterialIcons mock):

        // To make it robust, we check if *something* rendered.
        // Based on our mocks:
        // iOS/Symbols -> testID="symbol-house.fill"
        // Default/Material -> testID="icon-home" (mapped from house.fill)

        try {
            expect(getByTestId('symbol-house.fill')).toBeTruthy();
        } catch (e) {
            expect(getByTestId('icon-home')).toBeTruthy();
        }
    });
});
