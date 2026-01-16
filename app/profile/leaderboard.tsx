/**
 * @file leaderboard.tsx
 * @description 好友排行榜页面。
 * 展示好友排名列表，突出显示当前用户的排名。
 * 支持头像、分数和排名的可视化展示。
 */

import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { FlatList, Image, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 模拟排行榜数据
const RANKINGS = [
    { id: '1', name: 'Alex Johnson', score: '12,400', rank: 1, avatar: 'https://i.pravatar.cc/100?img=1' },
    { id: '2', name: 'Sarah Lee', score: '11,250', rank: 2, avatar: 'https://i.pravatar.cc/100?img=5' },
    { id: '3', name: 'Mike Chen', score: '10,800', rank: 3, avatar: 'https://i.pravatar.cc/100?img=3' },
    { id: '4', name: 'You', score: '8,500', rank: 12, avatar: 'https://i.pravatar.cc/100?img=8' },
];

export default function LeaderboardScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* 统一的带返回键 Header */}
            <View className="flex-row items-center px-4 py-4">
                <TouchableOpacity onPress={() => {
                    console.log("Hook: Leaderboard Back Pressed");
                    router.back();
                }} className="mr-4 w-10 h-10 items-center justify-center bg-gray-100 dark:bg-[#1C1C1E] rounded-full">
                    <Ionicons name="arrow-back" size={24} color={useColorScheme() === 'dark' ? "white" : "black"} />
                </TouchableOpacity>
                <Text className="text-black dark:text-white text-xl font-bold">好友排行榜</Text>
            </View>

            {/* 顶部提示栏 */}
            <View className="p-4 bg-gray-50 dark:bg-[#1C1C1E] mb-2 flex-row justify-between items-center mx-4 rounded-2xl">
                <Text className="text-[#16a34a] dark:text-[#CCFF00] font-bold text-lg">本周排名</Text>
                <Text className="text-gray-500 dark:text-gray-400">距离上一名还差 200 分</Text>
            </View>

            <FlatList
                data={RANKINGS}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    // 当前用户高亮显示
                    <View className={`flex-row items-center p-4 mx-4 mb-3 rounded-2xl ${item.name === 'You' ? 'bg-[#16a34a]/10 dark:bg-[#CCFF00]/10 border border-[#16a34a] dark:border-[#CCFF00]' : 'bg-gray-50 dark:bg-[#1C1C1E]'}`}>
                        <Text className={`text-xl font-black w-8 ${item.rank <= 3 ? 'text-[#16a34a] dark:text-[#CCFF00]' : 'text-gray-500'}`}>
                            #{item.rank}
                        </Text>
                        <Image source={{ uri: item.avatar }} className="w-10 h-10 rounded-full mx-3" />
                        <Text className="text-black dark:text-white font-bold flex-1">{item.name}</Text>
                        <Text className="text-[#16a34a] dark:text-[#CCFF00] font-black">{item.score}</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}