import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StatsScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex-row items-center px-4 py-4 border-b border-gray-200 dark:border-[#333]">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color={isDark ? "white" : "black"} />
                </TouchableOpacity>
                <Text className="text-black dark:text-white text-xl font-bold">训练数据详情</Text>
            </View>

            <ScrollView className="p-4">
                {/* 顶部大卡片 */}
                <View className="bg-gray-50 dark:bg-[#1C1C1E] p-6 rounded-3xl mb-4 border border-gray-200 dark:border-gray-800">
                    <Text className="text-gray-500 dark:text-gray-400 mb-2">本周运动时长</Text>
                    <View className="flex-row items-baseline">
                        <Text className="text-black dark:text-white text-5xl font-black">128</Text>
                        <Text className="text-[#0a7ea4] dark:text-[#CCFF00] ml-2 font-bold">分钟</Text>
                    </View>
                    <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-4 overflow-hidden">
                        <View className="h-full bg-[#0a7ea4] dark:bg-[#CCFF00] w-[60%]" />
                    </View>
                </View>

                {/* 修复：使用 justify-between 和 宽度控制，确保间距充足 */}
                <View className="flex-row justify-between mb-4">
                    <View style={{ width: '48%' }}>
                        <InfoCard title="累计消耗" value="2,400" unit="千卡" icon="flame" color="#FF3B30" />
                    </View>
                    <View style={{ width: '48%' }}>
                        <InfoCard title="动作达标率" value="88" unit="%" icon="checkmark-circle" color="#30D158" />
                    </View>
                </View>

                <Text className="text-black dark:text-white font-bold text-lg mb-4 mt-2">最近记录</Text>
                {[1, 2, 3].map(i => (
                    <View key={i} className="bg-gray-50 dark:bg-[#1C1C1E] p-4 rounded-2xl mb-3 flex-row justify-between items-center">
                        <View>
                            <Text className="text-black dark:text-white font-bold">全身燃脂初级</Text>
                            <Text className="text-gray-500 text-xs">昨天 19:30</Text>
                        </View>
                        <Text className="text-[#0a7ea4] dark:text-[#CCFF00] font-bold">15 min</Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const InfoCard = ({ title, value, unit, icon, color }: any) => (
    <View className="bg-gray-50 dark:bg-[#1C1C1E] p-4 rounded-3xl border border-gray-200 dark:border-gray-800 w-full">
        <Ionicons name={icon} size={24} color={color} style={{ marginBottom: 8 }} />
        <Text className="text-gray-500 dark:text-gray-400 text-xs">{title}</Text>
        <View className="flex-row items-baseline mt-1">
            <Text className="text-black dark:text-white text-2xl font-black">{value}</Text>
            <Text className="text-gray-500 dark:text-gray-400 text-xs ml-1">{unit}</Text>
        </View>
    </View>
);