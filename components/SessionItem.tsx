import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Text, TouchableOpacity, View } from 'react-native';
import { Session } from '../store/library';

interface SessionItemProps {
    item: Session;
    onPress?: () => void;
    showAddButton?: boolean;
    onAdd?: () => void;
    showRemoveButton?: boolean;
    onRemove?: () => void;
}

export function SessionItem({ item, onPress, showAddButton, onAdd, showRemoveButton, onRemove }: SessionItemProps) {
    const handlePress = onPress || (() => router.push(`/workout/${item.id}?mode=session`));

    return (
        <TouchableOpacity
            onPress={handlePress}
            className="w-full bg-[#1E1E1E] mb-4 p-5 rounded-3xl flex-row justify-between items-center border border-gray-800"
        >
            <View className="flex-row items-center flex-1">
                {/* Left Decoration Bar */}
                <View className="w-1 h-12 rounded-full mr-4" style={{ backgroundColor: item.color }} />

                <View>
                    <Text className="text-white font-bold text-xl mb-2">{item.name}</Text>
                    <View className="flex-row space-x-4">
                        <View className="flex-row items-center">
                            <SymbolView name={"clock" as any} size={14} tintColor="#888" style={{ marginRight: 4 }} />
                            <Text className="text-gray-400 text-xs">{item.time}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <SymbolView name={"square.stack.3d.up" as any} size={14} tintColor="#888" style={{ marginRight: 4 }} />
                            <Text className="text-gray-400 text-xs">{item.count}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Action Buttons Area */}
            {showAddButton && (
                <TouchableOpacity onPress={onAdd}>
                    <SymbolView name={"plus.circle.fill" as any} size={30} tintColor="#CCFF00" />
                </TouchableOpacity>
            )}

            {showRemoveButton && (
                <TouchableOpacity onPress={onRemove}>
                    <SymbolView name={"minus.circle.fill" as any} size={30} tintColor="#FF3B30" />
                </TouchableOpacity>
            )}

            {!showAddButton && !showRemoveButton && (
                <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center">
                    <SymbolView name={"play.fill" as any} size={24} tintColor={item.color} style={{ marginLeft: 4 }} />
                </View>
            )}
        </TouchableOpacity>
    );
}
