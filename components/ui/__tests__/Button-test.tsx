import { fireEvent, render, screen } from '@testing-library/react-native';
import * as React from 'react';
import { Button } from '../Button';

describe('Button', () => {
    it('renders with label', () => {
        render(<Button label="Click Me" />);
        expect(screen.getByText('Click Me')).toBeTruthy();
    });

    it('fires onPress when clicked', () => {
        const onPress = jest.fn();
        render(<Button label="Click Me" onPress={onPress} />);

        fireEvent.press(screen.getByText('Click Me'));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('renders correct variant styles generally', () => {
        // Just checking it renders without error for different variants
        render(<Button label="Primary" variant="primary" />);
        render(<Button label="Secondary" variant="secondary" />);
        render(<Button label="Outline" variant="outline" />);
        render(<Button label="Ghost" variant="ghost" />);
    });
});
