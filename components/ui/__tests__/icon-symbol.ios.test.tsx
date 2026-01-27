/**
 * @file icon-symbol.ios.test.tsx
 * @description Unit tests for IconSymbol iOS component (SF Symbols)
 */

import { render } from '@testing-library/react-native';
import React from 'react';

// Mock expo-symbols
jest.mock('expo-symbols', () => ({
    SymbolView: function MockSymbolView({ name, tintColor, weight, style }: any) {
        const { View, Text } = require('react-native');
        return (
            <View testID={`symbol-${name}`} style={style}>
                <Text>{`${name}-${tintColor}-${weight}`}</Text>
            </View>
        );
    },
}));

// Import the iOS version explicitly
const { IconSymbol } = require('../icon-symbol.ios');

describe('IconSymbol (iOS)', () => {
    it('should render SymbolView with name', () => {
        const { getByTestId } = render(
            <IconSymbol name="house.fill" size={24} color="#000" />
        );

        expect(getByTestId('symbol-house.fill')).toBeTruthy();
    });

    it('should apply size as width and height', () => {
        const { getByTestId } = render(
            <IconSymbol name="gear" size={32} color="#000" />
        );

        const symbol = getByTestId('symbol-gear');
        const flatStyle = Array.isArray(symbol.props.style)
            ? symbol.props.style.flat()
            : [symbol.props.style];
        expect(flatStyle).toContainEqual(expect.objectContaining({ width: 32, height: 32 }));
    });

    it('should use default size of 24', () => {
        const { getByTestId } = render(
            <IconSymbol name="star" color="#000" />
        );

        const symbol = getByTestId('symbol-star');
        const flatStyle = Array.isArray(symbol.props.style)
            ? symbol.props.style.flat()
            : [symbol.props.style];
        expect(flatStyle).toContainEqual(expect.objectContaining({ width: 24, height: 24 }));
    });

    it('should use default weight of regular', () => {
        const { getByText } = render(
            <IconSymbol name="heart" size={24} color="#FF0000" />
        );

        expect(getByText('heart-#FF0000-regular')).toBeTruthy();
    });

    it('should apply custom weight', () => {
        const { getByText } = render(
            <IconSymbol name="heart" size={24} color="#FF0000" weight="bold" />
        );

        expect(getByText('heart-#FF0000-bold')).toBeTruthy();
    });

    it('should apply custom style', () => {
        const { getByTestId } = render(
            <IconSymbol
                name="plus"
                size={24}
                color="#000"
                style={{ transform: [{ rotate: '45deg' }] }}
            />
        );

        const symbol = getByTestId('symbol-plus');
        const flatStyle = Array.isArray(symbol.props.style)
            ? symbol.props.style.flat()
            : [symbol.props.style];
        expect(flatStyle).toContainEqual(
            expect.objectContaining({ transform: [{ rotate: '45deg' }] })
        );
    });
});
