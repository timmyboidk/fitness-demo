/**
 * @file SessionItem.tsx
 * @description 训练课程卡片组件。
 * 用于展示训练课程的摘要信息 (名称、耗时、动作数量)。
 * 包含装饰性的颜色条和快捷操作按钮。
 */

import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Session } from '../store/library';

/**
 * 课程列表项属性接口
 * @property item 课程数据对象
 * @property onPress (可选) 点击回调
 * @property showAddButton 是否显示添加按钮
 * @property onAdd 添加回调
 * @property showRemoveButton 是否显示移除按钮
 * @property onRemove 移除回调
 */
interface SessionItemProps {
    item: Session;
    onPress?: () => void;
    showAddButton?: boolean;
    onAdd?: () => void;
    showRemoveButton?: boolean;
    onRemove?: () => void;
}

/**
 * 课程卡片组件
 */
export function SessionItem({ item, onPress, showAddButton, onAdd, showRemoveButton, onRemove }: SessionItemProps) {
    const handlePress = onPress || (() => router.push(`/workout/${item.id}?mode=session`));
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const highlightColor = isDark ? "#CCFF00" : "#16a34a";

    return (
        <TouchableOpacity
            onPress={handlePress}
            className="w-full bg-gray-50 dark:bg-[#1C1C1E] mb-4 p-5 rounded-3xl flex-row justify-between items-center border border-gray-200 dark:border-transparent"
        >
            <View className="flex-row items-center flex-1">
                {/* Left Decoration Bar */}
                <View className="w-1 h-12 rounded-full mr-4" style={{ backgroundColor: item.color }} />

                <View>
                    <Text className="text-black dark:text-white font-bold text-xl mb-2">{item.name}</Text>
                    <View className="flex-row space-x-4">
                        <View className="flex-row items-center">
                            <SymbolView name={"clock" as any} size={14} tintColor="#888" style={{ marginRight: 4 }} />
                            <Text className="text-gray-500 dark:text-gray-400 text-xs">{item.time}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <SymbolView name={"square.stack.3d.up" as any} size={14} tintColor="#888" style={{ marginRight: 4 }} />
                            <Text className="text-gray-500 dark:text-gray-400 text-xs">{item.count}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Action Buttons Area */}
            {showAddButton && (
                <TouchableOpacity onPress={onAdd}>
                    <SymbolView name={"plus.circle.fill" as any} size={30} tintColor={highlightColor} />
                </TouchableOpacity>
            )}

            {showRemoveButton && (
                <TouchableOpacity onPress={onRemove}>
                    <SymbolView name={"minus.circle.fill" as any} size={30} tintColor="#FF3B30" />
                </TouchableOpacity>
            )}

            {!showAddButton && !showRemoveButton && (
                <View className="w-12 h-12 rounded-full bg-black/10 dark:bg-white/10 items-center justify-center">
                    <SymbolView name={"play.fill" as any} size={24} tintColor={item.color} style={{ marginLeft: 4 }} />
                </View>
            )}
        </TouchableOpacity>
    );
}
