import { render, screen } from '@testing-library/react-native';
import * as React from 'react';

import { ThemedText } from '../themed-text';

it(`renders correctly`, () => {
    const tree = render(<ThemedText>Snapshot test!</ThemedText>).toJSON();
    expect(tree).toMatchSnapshot();
});

it(`renders title correctly`, () => {
    render(<ThemedText type="title">Title text</ThemedText>);
    const text = screen.getByText('Title text');
    expect(text).toBeTruthy();
});
