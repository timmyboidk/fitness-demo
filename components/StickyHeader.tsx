import React from 'react';
import { Animated, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface StickyHeaderProps {
    scrollY: Animated.Value;
    title: string;
    rightElement?: React.ReactNode;
}

export function StickyHeader({ scrollY, title, rightElement }: StickyHeaderProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const textColor = isDark ? '#FFFFFF' : '#000000';
    const bgColor = isDark ? '#000000' : '#FFFFFF';

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    return (
        <View className="absolute top-0 left-0 right-0 z-10">
            <SafeAreaView edges={['top']} style={{ backgroundColor: bgColor }}>
                <Animated.View style={{ opacity: headerOpacity }} className="h-[44px] flex-row items-center justify-between px-4 border-b border-gray-100 dark:border-gray-900">
                    <Text className="text-lg font-bold" style={{ color: textColor }}>{title}</Text>
                    {rightElement}
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}
