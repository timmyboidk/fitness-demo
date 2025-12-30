import { TextInput, View, Text, TextInputProps } from 'react-native';
import { clsx } from 'clsx';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
    return (
        <View className="mb-4 space-y-2">
            {label && <Text className="text-gray-400 text-sm ml-1">{label}</Text>}
            <TextInput
                placeholderTextColor="#666"
                className={clsx(
                    "bg-surface text-white h-14 px-4 rounded-xl border border-gray-800 focus:border-neon",
                    error && "border-red-500",
                    className
                )}
                {...props}
            />
            {error && <Text className="text-red-500 text-xs ml-1">{error}</Text>}
        </View>
    );
}