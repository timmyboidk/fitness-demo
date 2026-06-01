/**
 * @file use-color-scheme.test.ts
 * @description use-color-scheme hook 的单元测试（重新导出测试）
 */

import { useColorScheme as rnUseColorScheme } from 'react-native';
import { useColorScheme as importedUseColorScheme } from '../use-color-scheme';

describe('use-color-scheme', () => {
    it('should re-export useColorScheme from react-native', () => {
        // 验证导出的函数与 React Native 的相同
        expect(importedUseColorScheme).toBe(rnUseColorScheme);
        const result = importedUseColorScheme();
        expect(result).toBeDefined(); // 标准模拟返回 'light' 或类似值
    });
});
