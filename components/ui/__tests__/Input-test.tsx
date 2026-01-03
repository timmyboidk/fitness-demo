import { render } from '@testing-library/react-native';
import React from 'react';
import { Input } from '../Input';

describe('Input', () => {
    it('renders with label and icon', () => {
        const { getByText, getByTestId, getByPlaceholderText } = render(
            <Input label="Email" icon="mail" placeholder="Enter email" />
        );
        expect(getByText('Email')).toBeTruthy();
        expect(getByTestId('icon-mail')).toBeTruthy();
        expect(getByPlaceholderText('Enter email')).toBeTruthy();
    });

    it('displays error message', () => {
        const { getByText } = render(<Input label="pass" error="Too short" />);
        expect(getByText('Too short')).toBeTruthy();
    });

    it('passes props to TextInput', () => {
        const { getByPlaceholderText } = render(<Input placeholder="test" value="abc" />);
        const input = getByPlaceholderText('test');
        expect(input.props.value).toBe('abc');
    });
});
