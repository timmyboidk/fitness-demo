/**
 * @file use-theme-color-test.ts
 * @description useThemeColor Hook 单元测试。
 * 验证在不同主题模式下的颜色返回值。
 * 测试 Props 覆盖和默认值逻辑。
 */

import { Colors } from '@/constants/theme';
import { renderHook } from '@testing-library/react-native';
import { useThemeColor } from '../use-theme-color';

// Mock useThemeColor 依赖的 hook。
// 我们 mock 具体使用的 import: import { useColorScheme } from '@/hooks/use-color-scheme';
jest.mock('@/hooks/use-color-scheme', () => ({
    useColorScheme: jest.fn(),
}));

// 获取 mock 对象以进行控制
const { useColorScheme } = require('@/hooks/use-color-scheme');

describe('useThemeColor', () => {
    it('returns light color from constants when theme is light', () => {
        useColorScheme.mockReturnValue('light');
        const { result } = renderHook(() => useThemeColor({}, 'text'));
        expect(result.current).toBe(Colors.light.text);
    });

    it('returns dark color from constants when theme is dark', () => {
        useColorScheme.mockReturnValue('dark');
        const { result } = renderHook(() => useThemeColor({}, 'text'));
        expect(result.current).toBe(Colors.dark.text);
    });

    it('returns override color if provided', () => {
        useColorScheme.mockReturnValue('light');
        const { result } = renderHook(() => useThemeColor({ light: '#123456' }, 'text'));
        expect(result.current).toBe('#123456');
    });

    it('defaults to light when theme is undefined', () => {
        useColorScheme.mockReturnValue(undefined);
        const { result } = renderHook(() => useThemeColor({}, 'text'));
        expect(result.current).toBe(Colors.light.text);
    });
});
