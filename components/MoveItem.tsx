import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Text, TouchableOpacity, View } from 'react-native';
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

    return (
        <TouchableOpacity
            onPress={handlePress}
            className="w-[48%] bg-[#1E1E1E] mb-4 rounded-2xl overflow-hidden border border-gray-800"
        >
            <View className="h-32 items-center justify-center bg-[#252525]">
                {/* SF Symbol implementation */}
                <SymbolView name={item.icon as any} size={60} tintColor="white" fallback="body" />
            </View>

            <View className="p-3">
                <Text className="text-white font-bold text-lg mb-1">{item.name}</Text>
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-[#CCFF00] mr-2" />
                        <Text className="text-gray-400 text-xs">{item.level}</Text>
                    </View>

                    {showAddButton && (
                        <TouchableOpacity onPress={onAdd}>
                            <SymbolView name={"plus.circle.fill" as any} size={24} tintColor="#CCFF00" />
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
