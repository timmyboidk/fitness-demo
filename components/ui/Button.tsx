/**
 * @file Button.tsx
 * @description 通用按钮组件。
 * 支持多种预设样式 (Primary, Secondary, Outline, Ghost) 和尺寸。
 * 自动适配暗黑模式，并支持自定义图标和文本样式。
 */

import { clsx, type ClassValue } from 'clsx';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * 按钮属性接口
 * @property variant 按钮变体样式 'primary' | 'secondary' | 'outline' | 'ghost'
 * @property size 按钮尺寸 'default' | 'sm' | 'lg'
 * @property label 按钮文本
 * @property icon (可选) 左侧图标组件
 * @property textStyle (可选) 自定义文本样式类名
 */
interface ButtonProps extends TouchableOpacityProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'default' | 'sm' | 'lg';
    label: string;
    icon?: React.ReactNode;
    textStyle?: string;
}

/**
 * 按钮组件
 */
export function Button({ className, variant = 'primary', size = 'default', label, icon, textStyle, ...props }: ButtonProps) {
    const baseStyles = "flex-row items-center justify-center rounded-full active:opacity-80";

    const variants = {
        primary: "bg-black dark:bg-white",
        secondary: "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
        outline: "border border-gray-300 dark:border-gray-500 bg-transparent",
        ghost: "bg-transparent"
    };

    const sizes = {
        default: "h-14 px-6",
        sm: "h-10 px-4",
        lg: "h-16 px-8"
    };

    const textStyles = {
        primary: "text-white dark:text-black font-bold text-lg",
        secondary: "text-black dark:text-white font-bold text-lg",
        outline: "text-black dark:text-white font-medium",
        ghost: "text-gray-400 dark:text-gray-300 font-medium"
    };

    return (
        <TouchableOpacity
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {icon && <View className="mr-2">{icon}</View>}
            <Text className={cn(textStyles[variant], textStyle)}>{label}</Text>
        </TouchableOpacity>
    );
}