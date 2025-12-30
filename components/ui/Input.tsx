import { TextInput, View, Text, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // <--- 新增引入
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: keyof typeof Ionicons.glyphMap; // <--- 新增图标属性
}

export function Input({ label, error, icon, className, ...props }: InputProps) {
    return (
        <View className="mb-4 space-y-2 w-full">
            {label && <Text className="text-gray-400 text-sm ml-1">{label}</Text>}

            {/* 输入框容器：负责背景和边框 */}
            <View className={cn(
                "flex-row items-center bg-[#1E1E1E] h-14 px-4 rounded-xl border border-gray-800 focus:border-[#CCFF00]",
                error && "border-red-500",
                className
            )}>
                {/* 如果有图标，显示图标 */}
                {icon && (
                    <Ionicons name={icon} size={20} color="#666" style={{ marginRight: 10 }} />
                )}

                {/* TextInput 填满剩余空间 */}
                <TextInput
                    placeholderTextColor="#666"
                    className="flex-1 text-white h-full"
                    {...props}
                />
            </View>

            {error && <Text className="text-red-500 text-xs ml-1">{error}</Text>}
        </View>
    );
}