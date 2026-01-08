import { clsx, type ClassValue } from 'clsx';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends TouchableOpacityProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'default' | 'sm' | 'lg';
    label: string;
    icon?: React.ReactNode;
    textStyle?: string;
}

export function Button({ className, variant = 'primary', size = 'default', label, icon, textStyle, ...props }: ButtonProps) {
    const baseStyles = "flex-row items-center justify-center rounded-full active:opacity-80";

    const variants = {
        primary: "bg-[#0a7ea4] dark:bg-[#CCFF00] text-white dark:text-black", // Brand color adaption
        secondary: "bg-gray-100 dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700",
        outline: "border border-gray-300 dark:border-gray-600 bg-transparent",
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
        ghost: "text-gray-500 dark:text-gray-400 font-medium"
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