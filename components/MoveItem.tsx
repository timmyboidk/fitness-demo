import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Move } from '../store/library';

interface MoveItemProps {
    item: Move;
    onPress?: () => void;
    showAddButton?: boolean;
    onAdd?: () => void;
    showRemoveButton?: boolean;
    onRemove?: () => void;
}

export function MoveItem({ item, onPress, showAddButton, onAdd, showRemoveButton, onRemove }: MoveItemProps) {
    const handlePress = onPress || (() => router.push(`/workout/${item.id}?mode=move`));
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const tintColor = isDark ? "white" : "black";
    const highlightColor = isDark ? "#CCFF00" : "#0a7ea4";

    return (
        <TouchableOpacity
            onPress={handlePress}
            className="w-[48%] bg-gray-50 dark:bg-[#1E1E1E] mb-4 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
        >
            <View className="h-32 items-center justify-center bg-gray-200 dark:bg-[#252525]">
                {/* SF Symbol implementation */}
                <SymbolView name={item.icon as any} size={60} tintColor={tintColor} fallback="body" />
            </View>

            <View className="p-3">
                <Text className="text-black dark:text-white font-bold text-lg mb-1">{item.name}</Text>
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-[#0a7ea4] dark:bg-[#CCFF00] mr-2" />
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
