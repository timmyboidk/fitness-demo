/**
 * @file use-theme-color.test.ts
 * @description useThemeColor hook 的单元测试
 */

import { renderHook } from '@testing-library/react-native';

// 模拟颜色方案 hook
let mockColorScheme: 'light' | 'dark' | null = 'light';

jest.mock('@/hooks/use-color-scheme', () => ({
    useColorScheme: () => mockColorScheme,
}));

jest.mock('@/constants/theme', () => ({
    Colors: {
        light: {
            text: '#000000',
            background: '#ffffff',
            tint: '#2f95dc',
        },
        dark: {
            text: '#ffffff',
            background: '#000000',
            tint: '#fff',
        },
    },
}));

import { useThemeColor } from '../use-theme-color';

describe('useThemeColor', () => {
    beforeEach(() => {
        mockColorScheme = 'light';
    });

    it('should return light theme color from Colors', () => {
        const { result } = renderHook(() => useThemeColor({}, 'text'));

        expect(result.current).toBe('#000000');
    });

    it('should return dark theme color from Colors', () => {
        mockColorScheme = 'dark';

        const { result } = renderHook(() => useThemeColor({}, 'text'));

        expect(result.current).toBe('#ffffff');
    });

    it('should return color from props for light theme', () => {
        const { result } = renderHook(() =>
            useThemeColor({ light: '#custom-light', dark: '#custom-dark' }, 'text')
        );

        expect(result.current).toBe('#custom-light');
    });

    it('should return color from props for dark theme', () => {
        mockColorScheme = 'dark';

        const { result } = renderHook(() =>
            useThemeColor({ light: '#custom-light', dark: '#custom-dark' }, 'text')
        );

        expect(result.current).toBe('#custom-dark');
    });

    it('should fall back to light theme when colorScheme is null', () => {
        mockColorScheme = null;

        const { result } = renderHook(() => useThemeColor({}, 'text'));

        expect(result.current).toBe('#000000');
    });

    it('should return different colors for different color names', () => {
        const { result: textResult } = renderHook(() => useThemeColor({}, 'text'));
        const { result: bgResult } = renderHook(() => useThemeColor({}, 'background'));

        expect(textResult.current).toBe('#000000');
        expect(bgResult.current).toBe('#ffffff');
    });
});
