import React from 'react';
import { Text, View } from 'react-native';

interface LargeTitleProps {
    title: string;
    rightElement?: React.ReactNode;
    style?: any;
}

export function LargeTitle({ title, rightElement, style }: LargeTitleProps) {
    return (
        <View className="mb-6 mt-8 flex-row justify-between items-end" style={style}>
            <Text className="text-4xl font-black italic tracking-wider text-black dark:text-white">{title}</Text>
            {rightElement}
        </View>
    );
}
