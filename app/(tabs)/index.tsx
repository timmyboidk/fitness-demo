import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// 火柴人风格数据 (Stick Figure Style Data)
const MOVES = [
    { id: 'm1', name: '标准俯卧撑', level: '初级', icon: 'body' },
    { id: 'm2', name: '深蹲', level: '中级', icon: 'accessibility' }, // Accessibility 图标很像站立的人
    { id: 'm3', name: '弓步蹲', level: '初级', icon: 'walk' },        // Walk 图标像弓步
    { id: 'm4', name: '平板支撑', level: '全等级', icon: 'fitness' },
    { id: 'm5', name: '开合跳', level: '有氧', icon: 'happy' },       // 模拟跳跃
    { id: 'm6', name: '高抬腿', level: '高强度', icon: 'bicycle' },
];

export default function MovesScreen() {
    return (
        <View className="flex-1 bg-[#121212] px-4 pt-4">
            <FlatList
                data={MOVES}
                numColumns={2}
                keyExtractor={item => item.id}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => router.push(`/workout/${item.id}?mode=move`)}
                        className="w-[48%] bg-[#1E1E1E] mb-4 rounded-2xl overflow-hidden border border-gray-800"
                    >
                        {/* 模拟火柴人图片的区域 */}
                        <View className="h-32 items-center justify-center bg-[#252525]">
                            <Ionicons name={item.icon as any} size={60} color="white" />
                        </View>

                        <View className="p-3">
                            <Text className="text-white font-bold text-lg mb-1">{item.name}</Text>
                            <View className="flex-row items-center">
                                <View className="w-2 h-2 rounded-full bg-[#CCFF00] mr-2" />
                                <Text className="text-gray-400 text-xs">{item.level}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}