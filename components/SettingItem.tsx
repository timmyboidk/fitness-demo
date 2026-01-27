import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Switch, Text, TouchableOpacity, useColorScheme, View, ViewStyle } from 'react-native';

interface SettingItemProps {
    icon?: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: string | boolean;
    onValueChange?: (value: boolean) => void;
    isSwitch?: boolean;
    onPress?: () => void;
    style?: ViewStyle;
    showChevron?: boolean;
    testID?: string;
}

export function SettingItem({
    icon,
    label,
    value,
    onValueChange,
    isSwitch,
    onPress,
    style,
    showChevron = true,
    testID
}: SettingItemProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const Content = (
        <View className="flex-row items-center justify-between p-4 bg-gray-50 dark:bg-[#1C1C1E]" style={style}>
            <View className="flex-row items-center">
                {icon && <Ionicons name={icon} size={22} color={isDark ? "#999" : "#666"} style={{ marginRight: 12 }} />}
                <Text className="text-black dark:text-white text-base font-bold">{label}</Text>
            </View>
            {isSwitch ? (
                <Switch
                    value={value as boolean}
                    onValueChange={onValueChange}
                    trackColor={{ false: "#333", true: isDark ? "#CCFF00" : "#16a34a" }}
                    thumbColor={value ? (isDark ? "#000" : "#fff") : "#f4f3f4"}
                    testID={`${testID}-switch`}
                />
            ) : (
                <View className="flex-row items-center">
                    {typeof value === 'string' && <Text className="text-gray-500 mr-2">{value}</Text>}
                    {showChevron && <Ionicons name="chevron-forward" size={18} color="#666" />}
                </View>
            )}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} testID={testID}>
                {Content}
            </TouchableOpacity>
        );
    }

    return <View testID={testID}>{Content}</View>;
}
