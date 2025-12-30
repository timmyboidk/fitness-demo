import { TouchableOpacity, Text, TouchableOpacityProps, View } from 'react-native';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends TouchableOpacityProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'default' | 'sm' | 'lg';
    label: string;
    icon?: React.ReactNode;
    textStyle?: string; // <--- 新增这行
}

export function Button({ className, variant = 'primary', size = 'default', label, icon, textStyle, ...props }: ButtonProps) {
    const baseStyles = "flex-row items-center justify-center rounded-full active:opacity-80";

    const variants = {
        primary: "bg-[#CCFF00] text-black",
        secondary: "bg-[#1E1E1E] border border-gray-700",
        outline: "border border-gray-600 bg-transparent",
        ghost: "bg-transparent"
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
            <Text className={cn(textStyles[variant], textStyle)}>{label}</Text>
        </TouchableOpacity>
    );
}