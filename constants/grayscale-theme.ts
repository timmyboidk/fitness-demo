/**
 * @file grayscale-theme.ts
 * @description Apple HIG 灰度设计 Token 系统。
 * 纯黑白 + 灰度层次，遵循 iOS 人机界面指南的系统色语义。
 *
 * 参考：
 *   – iOS 13+ System Colors (label, secondaryLabel, systemBackground, etc.)
 *   – SF Symbols 单色 tint 行为
 *   – 系统 Separator / Fill 层级
 */

// ─────────────────────────────────────────────
//  绝对灰度色板 (50–900)
// ─────────────────────────────────────────────

export const Gray = {
  50: '#F9F9F9',
  75: '#F2F2F7',
  100: '#E5E5EA',
  150: '#D1D1D6',
  200: '#C7C7CC',
  250: '#AEAEB2',
  300: '#8E8E93',
  400: '#636366',
  500: '#48484A',
  600: '#3C3C43',
  650: '#38383A',
  700: '#2C2C2E',
  750: '#1C1C1E',
  800: '#111111',
  850: '#0A0A0A',
  900: '#000000',
} as const;

// ─────────────────────────────────────────────
//  Apple HIG 系统色语义 (Light / Dark)
// ─────────────────────────────────────────────

export const SystemColors = {
  light: {
    label: Gray[900],
    secondaryLabel: Gray[600],
    tertiaryLabel: Gray[250],
    quaternaryLabel: Gray[150],

    systemBackground: '#FFFFFF',
    secondarySystemBackground: Gray[75],
    tertiarySystemBackground: '#FFFFFF',

    groupedBackground: Gray[75],
    secondaryGroupedBackground: '#FFFFFF',
    tertiaryGroupedBackground: Gray[75],

    separator: Gray[150],
    opaqueSeparator: Gray[150],

    tint: Gray[900],
    tintSecondary: Gray[600],

    error: Gray[300],
    success: Gray[600],
    warning: Gray[250],
  },
  dark: {
    label: '#FFFFFF',
    secondaryLabel: Gray[100],
    tertiaryLabel: Gray[300],
    quaternaryLabel: Gray[500],

    systemBackground: Gray[900],
    secondarySystemBackground: Gray[750],
    tertiarySystemBackground: Gray[700],

    groupedBackground: Gray[900],
    secondaryGroupedBackground: Gray[750],
    tertiaryGroupedBackground: Gray[700],

    separator: Gray[650],
    opaqueSeparator: Gray[650],

    tint: '#FFFFFF',
    tintSecondary: Gray[100],

    error: Gray[300],
    success: Gray[100],
    warning: Gray[500],
  },
} as const;

// ─────────────────────────────────────────────
// 卡片 & 表面灰度层级
// ─────────────────────────────────────────────

export const SurfaceGray = {
  /** 最底层背景 */
  background: { light: '#FFFFFF', dark: Gray[900] },
  /** 第二层表面 (分组列表背景) */
  grouped: { light: Gray[75], dark: Gray[900] },
  /** 第三层表面 (卡片) */
  card: { light: '#FFFFFF', dark: Gray[700] },
  /** 卡片边框 */
  cardBorder: { light: Gray[150], dark: Gray[650] },
  /** 悬浮/模态背景 */
  elevated: { light: '#FFFFFF', dark: Gray[750] },
} as const;

// ─────────────────────────────────────────────
// 文字灰度层级
// ─────────────────────────────────────────────

export const TextGray = {
  primary: { light: Gray[900], dark: '#FFFFFF' },
  secondary: { light: Gray[600], dark: Gray[100] },
  tertiary: { light: Gray[250], dark: Gray[300] },
  quaternary: { light: Gray[150], dark: Gray[500] },
  /** 反色文字 (在深色背景上) */
  inverted: { light: '#FFFFFF', dark: Gray[900] },
} as const;
