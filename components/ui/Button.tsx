import { TouchableOpacity, Text, TouchableOpacityProps, View } from 'react-native';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 工具函数：合并 Tailwind 类名
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends TouchableOpacityProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'default' | 'sm' | 'lg';
    label: string;
    icon?: React.ReactNode;
}

export function Button({ className, variant = 'primary', size = 'default', label, icon, ...props }: ButtonProps) {
    const baseStyles = "flex-row items-center justify-center rounded-full font-bold active:opacity-80";

    const variants = {
        primary: "bg-neon text-black", // 对应 Main Button (实心)
        secondary: "bg-surface text-white",
        outline: "border border-gray-600 bg-transparent text-white", // 对应 Filter Button
        ghost: "bg-transparent text-gray-400"
    };

    const sizes = {
        default: "h-14 px-6",
        sm: "h-10 px-4",
        lg: "h-16 px-8"
    };

    const textStyles = {
        primary: "text-black font-bold text-lg",
        secondary: "text-white font-bold text-lg",
        outline: "text-white font-medium",
        ghost: "text-gray-400 font-medium"
    };

    return (
        <TouchableOpacity
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {icon && <View className="mr-2">{icon}</View>}
            <Text className={cn(textStyles[variant])}>{label}</Text>
        </TouchableOpacity>
    );
}