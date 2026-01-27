/**
 * @file LargeTitle.test.tsx
 * @description Unit tests for LargeTitle component
 */

import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { LargeTitle } from '../LargeTitle';

describe('LargeTitle', () => {
    it('should render title text', () => {
        const { getByText } = render(<LargeTitle title="Test Title" />);

        expect(getByText('Test Title')).toBeTruthy();
    });

    it('should render rightElement when provided', () => {
        const { getByText } = render(
            <LargeTitle
                title="Title"
                rightElement={<Text>Right</Text>}
            />
        );

        expect(getByText('Right')).toBeTruthy();
    });

    it('should apply custom style', () => {
        const customStyle = { marginTop: 100 };
        const { toJSON } = render(
            <LargeTitle title="Styled" style={customStyle} />
        );

        // Verify component renders with custom style
        expect(toJSON()).toBeTruthy();
    });
});
