/**
 * @file themed-text.test.tsx
 * @description Unit tests for ThemedText component
 */

import { render } from '@testing-library/react-native';
import React from 'react';

// Mock the theme hook
jest.mock('@/hooks/use-theme-color', () => ({
    useThemeColor: jest.fn(() => '#000000'),
}));

import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '../themed-text';

describe('ThemedText', () => {
    beforeEach(() => {
        (useThemeColor as jest.Mock).mockReturnValue('#000000');
    });

    it('should render text with default style', () => {
        const { getByText } = render(<ThemedText>Hello World</ThemedText>);

        const text = getByText('Hello World');
        expect(text).toBeTruthy();
    });

    it('should apply theme color', () => {
        (useThemeColor as jest.Mock).mockReturnValue('#FF0000');

        const { getByText } = render(<ThemedText>Colored</ThemedText>);
        const text = getByText('Colored');

        // Check that the color is applied in the style array
        const flatStyle = text.props.style.flat ? text.props.style.flat() : text.props.style;
        expect(flatStyle).toContainEqual(expect.objectContaining({ color: '#FF0000' }));
    });

    it('should render with title type', () => {
        const { getByText } = render(<ThemedText type="title">Title</ThemedText>);
        const text = getByText('Title');

        // Title style should have fontSize: 32
        const flatStyle = text.props.style.flat ? text.props.style.flat() : text.props.style;
        expect(flatStyle).toContainEqual(expect.objectContaining({ fontSize: 32 }));
    });

    it('should render with subtitle type', () => {
        const { getByText } = render(<ThemedText type="subtitle">Subtitle</ThemedText>);
        const text = getByText('Subtitle');

        const flatStyle = text.props.style.flat ? text.props.style.flat() : text.props.style;
        expect(flatStyle).toContainEqual(expect.objectContaining({ fontSize: 20 }));
    });

    it('should render with defaultSemiBold type', () => {
        const { getByText } = render(<ThemedText type="defaultSemiBold">Bold</ThemedText>);
        const text = getByText('Bold');

        const flatStyle = text.props.style.flat ? text.props.style.flat() : text.props.style;
        expect(flatStyle).toContainEqual(expect.objectContaining({ fontWeight: '600' }));
    });

    it('should render with link type', () => {
        const { getByText } = render(<ThemedText type="link">Link</ThemedText>);
        const text = getByText('Link');

        const flatStyle = text.props.style.flat ? text.props.style.flat() : text.props.style;
        expect(flatStyle).toContainEqual(expect.objectContaining({ color: '#16a34a' }));
    });

    it('should pass lightColor and darkColor to useThemeColor', () => {
        render(
            <ThemedText lightColor="#AAA" darkColor="#BBB">
                Custom Colors
            </ThemedText>
        );

        expect(useThemeColor).toHaveBeenCalledWith(
            { light: '#AAA', dark: '#BBB' },
            'text'
        );
    });

    it('should apply custom style', () => {
        const { getByText } = render(
            <ThemedText style={{ marginTop: 20 }}>Styled</ThemedText>
        );
        const text = getByText('Styled');

        const flatStyle = text.props.style.flat ? text.props.style.flat() : text.props.style;
        expect(flatStyle).toContainEqual(expect.objectContaining({ marginTop: 20 }));
    });
});
