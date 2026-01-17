import { render, screen } from '@testing-library/react-native';
import * as React from 'react';

import { ThemedText } from '../themed-text';

// 验证默认渲染
it(`renders correctly`, () => {
    const tree = render(<ThemedText>Snapshot test!</ThemedText>).toJSON();
    expect(tree).toMatchSnapshot();
});

// 验证标题样式渲染
it(`renders title correctly`, () => {
    render(<ThemedText type="title">Title text</ThemedText>);
    const text = screen.getByText('Title text');
    expect(text).toBeTruthy();
});
