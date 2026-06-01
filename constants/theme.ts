/**
 * @file theme.ts
 * @description Design token system — grayscale (Apple HIG).
 *
 * Color palette:
 *   – Pure black & white with Apple HIG system gray scale
 *   – Follows iOS label / secondaryLabel / systemBackground semantics
 *
 * Typography:
 *   – Inter font family loaded via @expo-google-fonts/inter
 */

import { Gray, SystemColors, SurfaceGray, TextGray } from './grayscale-theme';

// ─────────────────────────────────────────────
//  Font Family
// ─────────────────────────────────────────────

export const FontFamily = {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    black: 'Inter_900Black',
} as const;

// ─────────────────────────────────────────────
//  Grayscale Palette
// ─────────────────────────────────────────────

export const Palette = {
    cyan: Gray[900],
    violet: Gray[600],
    lime: Gray[300],
    red: Gray[300],
    gold: Gray[250],
    deepBlack: Gray[900],
    surface: Gray[750],
    card: Gray[700],
    cardBorder: Gray[650],
    offWhite: SurfaceGray.grouped.light,
    warmGray: Gray[100],
    charcoal: Gray[900],
    mutedDark: Gray[300],
    mutedLight: Gray[250],
} as const;

// ─────────────────────────────────────────────
//  Theme Colors (Light / Dark)
// ─────────────────────────────────────────────

export const Colors = {
    light: {
        text: SystemColors.light.label,
        textSecondary: SystemColors.light.secondaryLabel,
        background: SystemColors.light.systemBackground,
        surface: SystemColors.light.secondarySystemBackground,
        card: '#FFFFFF',
        cardBorder: SystemColors.light.separator,
        tint: SystemColors.light.tint,
        accent: SystemColors.light.tint,
        accentSecondary: SystemColors.light.secondaryLabel,
        icon: SystemColors.light.secondaryLabel,
        tabIconDefault: SystemColors.light.tertiaryLabel,
        tabIconSelected: SystemColors.light.tint,
        success: SystemColors.light.success,
        error: SystemColors.light.error,
        warning: SystemColors.light.warning,
    },
    dark: {
        text: SystemColors.dark.label,
        textSecondary: SystemColors.dark.secondaryLabel,
        background: SystemColors.dark.systemBackground,
        surface: SystemColors.dark.secondarySystemBackground,
        card: SystemColors.dark.tertiarySystemBackground,
        cardBorder: SystemColors.dark.separator,
        tint: SystemColors.dark.tint,
        accent: SystemColors.dark.tint,
        accentSecondary: SystemColors.dark.secondaryLabel,
        icon: SystemColors.dark.secondaryLabel,
        tabIconDefault: SystemColors.dark.tertiaryLabel,
        tabIconSelected: SystemColors.dark.tint,
        success: SystemColors.dark.success,
        error: SystemColors.dark.error,
        warning: SystemColors.dark.warning,
    },
};

// ─────────────────────────────────────────────
//  Legacy Fonts (fallbacks for web/non-Inter contexts)
// ─────────────────────────────────────────────

import { Platform } from 'react-native';

export const Fonts = Platform.select({
    ios: {
        sans: FontFamily.regular,
        serif: 'ui-serif',
        rounded: 'ui-rounded',
        mono: 'ui-monospace',
    },
    default: {
        sans: FontFamily.regular,
        serif: 'serif',
        rounded: FontFamily.regular,
        mono: 'monospace',
    },
    web: {
        sans: `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
        serif: "Georgia, 'Times New Roman', serif",
        rounded: `'Inter', 'SF Pro Rounded', sans-serif`,
        mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
});
