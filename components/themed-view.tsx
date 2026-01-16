/**
 * @file themed-view.tsx
 * @description 主题感知视图容器。
 * 自动根据系统亮/暗模式切换背景色。
 */

import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

/**
 * 主题视图属性
 * @property lightColor (可选) 亮色模式下的背景色覆盖
 * @property darkColor (可选) 暗色模式下的背景色覆盖
 */
export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

/**
 * 主题视图组件
 */
export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
