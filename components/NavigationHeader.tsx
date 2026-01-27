import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, useColorScheme, View, ViewStyle } from 'react-native';

interface NavigationHeaderProps {
    title: string;
    onBack?: () => void;
    rightElement?: React.ReactNode;
    style?: ViewStyle;
}

export function NavigationHeader({ title, onBack, rightElement, style }: NavigationHeaderProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    return (
        <View className="flex-row items-center justify-between px-4 py-4" style={style}>
            <View className="flex-row items-center">
                <TouchableOpacity
                    onPress={handleBack}
                    className="mr-4 w-10 h-10 items-center justify-center bg-gray-100 dark:bg-[#1C1C1E] rounded-full"
                    testID="header-back-button"
                >
                    <Ionicons name="arrow-back" size={24} color={isDark ? "white" : "black"} />
                </TouchableOpacity>
                <Text className="text-black dark:text-white text-xl font-bold">{title}</Text>
            </View>
            {rightElement}
        </View>
    );
}
