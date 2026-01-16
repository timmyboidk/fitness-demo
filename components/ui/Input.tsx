/**
 * @file Input.tsx
 * @description 通用输入框组件。
 * 封装 React Native TextInput，集成标签、图标和错误提示。
 * 支持暗黑模式自动适配和 Tailwind 样式覆盖。
 */

import { Ionicons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { Text, TextInput, TextInputProps, useColorScheme, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
    return twMerge(clsx(inputs));
}

/**
 * 输入框属性接口
 * @property label (可选) 上方标签文本
 * @property error (可选) 下方错误提示文本
 * @property icon (可选) 左侧图标名称 (Ionicons)
 */
interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: keyof typeof Ionicons.glyphMap;
}

/**
 * 输入框组件
 */
export function Input({ label, error, icon, className, ...props }: InputProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const placeholderColor = isDark ? '#666' : '#999';
    const iconColor = isDark ? '#666' : '#999';

    return (
        <View className="mb-4 space-y-2 w-full">
            {label && <Text className="text-gray-500 dark:text-gray-400 text-sm ml-1">{label}</Text>}

            {/* 输入框容器：负责背景和边框 */}
            <View className={cn(
                "flex-row items-center bg-gray-50 dark:bg-[#1C1C1E] h-14 px-5 rounded-2xl border border-gray-200 dark:border-transparent focus:border-[#16a34a] dark:focus:border-[#CCFF00]",
                error && "border-red-500",
                className
            )}>
                {/* 如果有图标，显示图标 */}
                {icon && (
                    <Ionicons name={icon} size={20} color={iconColor} style={{ marginRight: 10 }} />
                )}

                {/* TextInput 填满剩余空间 */}
                <TextInput
                    placeholderTextColor={placeholderColor}
                    className="flex-1 text-black dark:text-white h-full"
                    {...props}
                />
            </View>

            {error && <Text className="text-red-500 text-xs ml-1">{error}</Text>}
        </View>
    );
}