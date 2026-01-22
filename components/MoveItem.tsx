import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { memo } from 'react';
import { Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Move } from '../store/library';

/**
 * 动作列表项属性接口
 */
interface MoveItemProps {
    item: Move;
    onPress?: () => void;
    showAddButton?: boolean;
    onAdd?: () => void;
    showRemoveButton?: boolean;
    onRemove?: () => void;
}

/**
 * 动作卡片组件 (Memoized)
 */
export const MoveItem = memo(({ item, onPress, showAddButton, onAdd, showRemoveButton, onRemove }: MoveItemProps) => {
    const handlePress = onPress || (() => router.push(`/workout/${item.id}?mode=move`));
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const tintColor = isDark ? "white" : "black";
    const highlightColor = isDark ? "#CCFF00" : "#16a34a";

    return (
        <TouchableOpacity
            onPress={handlePress}
            testID={`move-item-${item.id}`}
            className="w-[48%] bg-gray-50 dark:bg-[#1C1C1E] mb-4 rounded-2xl overflow-hidden border border-gray-200 dark:border-transparent"
        >
            <View className="h-32 items-center justify-center bg-gray-200 dark:bg-[#252525]">
                <SymbolView name={item.icon as any} size={60} tintColor={tintColor} fallback="body" />
            </View>

            <View className="p-3">
                <Text className="text-black dark:text-white font-bold text-lg mb-1">{item.name}</Text>
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-[#16a34a] dark:bg-[#CCFF00] mr-2" />
                        <Text className="text-gray-500 dark:text-gray-400 text-xs">{item.level}</Text>
                    </View>

                    {showAddButton ? (
                        <TouchableOpacity onPress={onAdd}>
                            <SymbolView name={"plus.circle.fill" as any} size={24} tintColor={highlightColor} />
                        </TouchableOpacity>
                    ) : null}

                    {showRemoveButton ? (
                        <TouchableOpacity onPress={onRemove}>
                            <SymbolView name={"minus.circle.fill" as any} size={24} tintColor="#FF3B30" />
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
        </TouchableOpacity>
    );
});
