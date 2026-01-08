import { Colors } from '@/constants/theme';
import { renderHook } from '@testing-library/react-native';
import { useThemeColor } from '../use-theme-color';

// Mock the hook that useThemeColor relies on. 
// We mock the specific import that useThemeColor uses: import { useColorScheme } from '@/hooks/use-color-scheme';
jest.mock('@/hooks/use-color-scheme', () => ({
    useColorScheme: jest.fn(),
}));

// Retrieve the mock to control it
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
