/**
 * @file icon-symbol.tsx
 * @description 跨平台图标组件。
 * 在 iOS 上使用原生 SF Symbols，在 Android 和 Web 上回退到 Material Icons。
 * 确保跨平台外观一致性并优化资源使用。
 */

// Android 和 Web 端的 MaterialIcons 回退方案

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols 到 Material Icons 的映射表。
 * - Material Icons 参考: https://icons.expo.fyi
 * - SF Symbols 参考: https://developer.apple.com/sf-symbols/
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as IconMapping;

/**
 * 图标组件
 * 根据平台自动切换图标源 (SF Symbols vs Material Icons)。
 * 需要手动维护名称映射以确保一致性。
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
