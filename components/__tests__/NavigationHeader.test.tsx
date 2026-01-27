import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { NavigationHeader } from '../NavigationHeader';

describe('NavigationHeader', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders title', () => {
        const { getByText } = render(<NavigationHeader title="Test Title" />);
        expect(getByText('Test Title')).toBeTruthy();
    });

    it('handles default back navigation', () => {
        const { getByTestId } = render(<NavigationHeader title="Title" />);
        fireEvent.press(getByTestId('header-back-button'));
        expect(router.back).toHaveBeenCalled();
    });
});
