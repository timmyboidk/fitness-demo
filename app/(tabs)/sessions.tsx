import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SESSIONS = [
    { id: 's1', name: 'HIIT 燃脂核心', time: '20 分钟', count: '12 个动作', color: '#FF3B30' },
    { id: 's2', name: '腿部力量轰炸', time: '45 分钟', count: '8 个动作', color: '#CCFF00' },
    { id: 's3', name: '晨间唤醒瑜伽', time: '15 分钟', count: '5 个动作', color: '#5AC8FA' },
];

export default function SessionsScreen() {
    return (
        <View className="flex-1 bg-[#121212] px-4 pt-4">
            <FlatList
                data={SESSIONS}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => router.push(`/workout/${item.id}?mode=session`)}
                        className="w-full bg-[#1E1E1E] mb-4 p-5 rounded-3xl flex-row justify-between items-center border border-gray-800"
                    >
                        <View className="flex-row items-center flex-1">
                            {/* 左侧装饰条 */}
                            <View className="w-1 h-12 rounded-full mr-4" style={{ backgroundColor: item.color }} />

                            <View>
                                <Text className="text-white font-bold text-xl mb-2">{item.name}</Text>
                                <View className="flex-row space-x-4">
                                    <View className="flex-row items-center">
                                        <Ionicons name="time-outline" size={14} color="#888" style={{ marginRight: 4 }} />
                                        <Text className="text-gray-400 text-xs">{item.time}</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Ionicons name="layers-outline" size={14} color="#888" style={{ marginRight: 4 }} />
                                        <Text className="text-gray-400 text-xs">{item.count}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center">
                            <Ionicons name="play" size={24} color={item.color} style={{ marginLeft: 4 }} />
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}