/**
 * @file MoveItem.tsx
 * @description 训练动作卡片组件。
 * 用于在列表中展示单个动作的详细信息 (图标、名称、难度)。
 * 支持点击交互以及可选的添加/移除按钮。
 */

import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Move } from '../store/library';

/**
 * 动作列表项属性接口
 * @property item 动作数据对象
 * @property onPress (可选) 点击卡片时的回调，默认跳转到动作详情页
 * @property showAddButton 是否显示添加按钮 (用于添加到计划)
 * @property onAdd 添加按钮点击回调
 * @property showRemoveButton 是否显示移除按钮 (用于从列表隐藏)
 * @property onRemove 移除按钮点击回调
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
 * 动作卡片组件
 */
export function MoveItem({ item, onPress, showAddButton, onAdd, showRemoveButton, onRemove }: MoveItemProps) {
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
                {/* SF Symbol implementation */}
                <SymbolView name={item.icon as any} size={60} tintColor={tintColor} fallback="body" />
            </View>

            <View className="p-3">
                <Text className="text-black dark:text-white font-bold text-lg mb-1">{item.name}</Text>
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-[#16a34a] dark:bg-[#CCFF00] mr-2" />
                        <Text className="text-gray-500 dark:text-gray-400 text-xs">{item.level}</Text>
                    </View>

                    {showAddButton && (
                        <TouchableOpacity onPress={onAdd}>
                            <SymbolView name={"plus.circle.fill" as any} size={24} tintColor={highlightColor} />
                        </TouchableOpacity>
                    )}

                    {showRemoveButton && (
                        <TouchableOpacity onPress={onRemove}>
                            <SymbolView name={"minus.circle.fill" as any} size={24} tintColor="#FF3B30" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}
