/**
 * @file use-color-scheme-test.ts
 * @description useColorScheme Hook 单元测试。
 * 验证 Hook 是否返回已被定义的颜色方案 (light/dark/undefined)。
 */

import { useColorScheme } from '@/hooks/use-color-scheme';
import { renderHook } from '@testing-library/react-native';

// React Native 的标准 useColorScheme 通常由 jest-expo 或预设进行 mock。
// 但我们希望测试我们的包装器。
// 我们的包装器可能只是导出：export { useColorScheme } from 'react-native';
// 如果只是重新导出，测试它实际上是在测试 react-native。
// 但让我们检查一下内容。

describe('useColorScheme', () => {
    it('returns color scheme', () => {
        const { result } = renderHook(() => useColorScheme());
        // Default mock value is usually 'light' or undefined
        expect(result.current).toBeDefined();
    });
});
