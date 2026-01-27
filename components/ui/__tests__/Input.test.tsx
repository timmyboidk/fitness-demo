import { render } from '@testing-library/react-native';
import React from 'react';
import { Input } from '../Input';

describe('Input Component - Branch Expansion', () => {
    it('renders with all prop variations', () => {
        const { getByPlaceholderText, rerender } = render(
            <Input placeholder="Test" icon="person" error="Error message" />
        );
        expect(getByPlaceholderText('Test')).toBeTruthy();

        rerender(<Input placeholder="Pass" secureTextEntry={true} />);
        expect(getByPlaceholderText('Pass')).toBeTruthy();

        rerender(<Input placeholder="Num" keyboardType="numeric" />);
        expect(getByPlaceholderText('Num')).toBeTruthy();
    });
});
