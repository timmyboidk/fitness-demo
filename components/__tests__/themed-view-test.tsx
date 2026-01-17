import { render } from '@testing-library/react-native';
import React from 'react';
import { ThemedView } from '../themed-view';

// 我们 mock 钩子来控制颜色输出
jest.mock('@/hooks/use-theme-color', () => ({
    useThemeColor: jest.fn(({ light, dark }) => {
        // 简单的 mock 逻辑
        return light || dark || '#ffffff';
    }),
}));

describe('ThemedView', () => {
    it('renders with styles', () => {
        const { getByTestId } = render(
            <ThemedView testID="view" style={{ padding: 10 }} lightColor="#fff" darkColor="#000" />
        );
        const view = getByTestId('view');
        expect(view.props.style).toEqual(expect.arrayContaining([
            expect.objectContaining({ backgroundColor: '#fff' }),
            { padding: 10 }
        ]));
    });
});
