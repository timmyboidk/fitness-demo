import React from 'react';
import { Text, View, useColorScheme } from 'react-native';

interface LargeTitleProps {
    title: string;
    rightElement?: React.ReactNode;
    style?: any;
}

export function LargeTitle({ title, rightElement, style }: LargeTitleProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const textColor = isDark ? '#FFFFFF' : '#000000';

    return (
        <View className="mb-6 mt-8 flex-row justify-between items-end" style={style}>
            <Text className="text-4xl font-black italic tracking-wider" style={{ color: textColor }}>{title}</Text>
            {rightElement}
        </View>
    );
}
