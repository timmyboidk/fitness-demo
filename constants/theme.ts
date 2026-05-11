/**
 * @file theme.ts
 * @description Premium design token system.
 *
 * Color palette:
 *   – Dark mode:  Deep black (#0A0A0F) + neon cyan (#00F0FF) accent
 *   – Light mode: Warm off-white (#F8F7F4) + deep charcoal (#1A1A2E) accent
 *   – Secondary accent: Electric violet (#B026FF)
 *   – Tertiary: Retained neon-lime (#CCFF00) for session highlights
 *
 * Typography:
 *   – Inter font family loaded via @expo-google-fonts/inter
 */

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
//  Color Palette
// ─────────────────────────────────────────────

export const Palette = {
    cyan: '#00F0FF',
    violet: '#B026FF',
    lime: '#CCFF00',
    red: '#FF3B30',
    gold: '#FFD700',
    deepBlack: '#0A0A0F',
    surface: '#121216',
    card: '#1A1A24',
    cardBorder: '#2A2A3A',
    offWhite: '#F8F7F4',
    warmGray: '#E8E6E1',
    charcoal: '#1A1A2E',
    mutedDark: '#6B6B80',
    mutedLight: '#9A9AB0',
} as const;

// ─────────────────────────────────────────────
//  Theme Colors (Light / Dark)
// ─────────────────────────────────────────────

export const Colors = {
    light: {
        text: '#1A1A2E',
        textSecondary: '#6B6B80',
        background: '#F8F7F4',
        surface: '#FFFFFF',
        card: '#FFFFFF',
        cardBorder: '#E8E6E1',
        tint: '#1A1A2E',
        accent: '#00F0FF',
        accentSecondary: '#B026FF',
        icon: '#6B6B80',
        tabIconDefault: '#9A9AB0',
        tabIconSelected: '#00F0FF',
        success: '#00F0FF',
        error: '#FF3B30',
        warning: '#FFD700',
    },
    dark: {
        text: '#ECEDEE',
        textSecondary: '#6B6B80',
        background: '#0A0A0F',
        surface: '#121216',
        card: '#1A1A24',
        cardBorder: '#2A2A3A',
        tint: '#00F0FF',
        accent: '#00F0FF',
        accentSecondary: '#B026FF',
        icon: '#6B6B80',
        tabIconDefault: '#6B6B80',
        tabIconSelected: '#00F0FF',
        success: '#00F0FF',
        error: '#FF3B30',
        warning: '#FFD700',
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
