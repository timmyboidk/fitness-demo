/**
 * @file use-theme-color.ts
 * @description 主题颜色获取 Hook。
 * 根据当前系统主题 (亮/暗) 自动返回对应的颜色值。
 * 支持从 props 中覆盖默认的主题色。
 *
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * 获取主题色
 * @param props 包含 light 和 dark 颜色定义的属性对象
 * @param colorName 缺省情况下使用的 Colors 中定义的颜色名
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
