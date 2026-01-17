import { render } from '@testing-library/react-native';
import React from 'react';
import { IconSymbol } from '../icon-symbol';

describe('IconSymbol', () => {
    it('renders correctly', () => {
        const { getByTestId } = render(
            <IconSymbol name="house.fill" color="red" size={30} />
        );

        // 精确映射取决于具体实现（iOS vs 默认回退）
        // 如果是 iOS (使用 SymbolView mock):
        // 如果是默认 (使用 MaterialIcons mock):

        // 为了稳健性，我们检查 *是否* 有内容渲染。
        // 基于我们的 mocks:
        // iOS/Symbols -> testID="symbol-house.fill"
        // Default/Material -> testID="icon-home" (mapped from house.fill)

        try {
            expect(getByTestId('symbol-house.fill')).toBeTruthy();
        } catch (e) {
            expect(getByTestId('icon-home')).toBeTruthy();
        }
    });
});
