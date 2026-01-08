import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelpScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* 统一的带返回键 Header */}
            <View className="flex-row items-center px-4 py-4">
                <TouchableOpacity onPress={() => {
                    console.log("Hook: Help Back Pressed");
                    router.back();
                }} className="mr-4 w-10 h-10 items-center justify-center bg-gray-100 dark:bg-[#1C1C1E] rounded-full">
                    <Ionicons name="arrow-back" size={24} color={isDark ? "white" : "black"} />
                </TouchableOpacity>
                <Text className="text-black dark:text-white text-xl font-bold">帮助中心</Text>
            </View>

            <ScrollView className="p-4">
                {/* 联系客服 */}
                <View className="bg-gray-50 dark:bg-[#1C1C1E] rounded-2xl overflow-hidden mb-6">
                    <TouchableOpacity onPress={() => console.log("Hook: Help - Contact Service")} className="flex-row items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
                        <View className="flex-row items-center">
                            <Ionicons name="chatbubbles-outline" size={22} color={isDark ? "#CCFF00" : "#16a34a"} style={{ marginRight: 12 }} />
                            <Text className="text-black dark:text-white text-base font-bold">联系在线客服</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log("Hook: Help - Feedback")} className="flex-row items-center justify-between p-5">
                        <View className="flex-row items-center">
                            <Ionicons name="mail-outline" size={22} color={isDark ? "#CCFF00" : "#16a34a"} style={{ marginRight: 12 }} />
                            <Text className="text-black dark:text-white text-base font-bold">意见反馈</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* 协议 */}
                <View className="bg-gray-50 dark:bg-[#1C1C1E] rounded-2xl overflow-hidden mb-6">
                    <TouchableOpacity onPress={() => console.log("Hook: Help - User Agreement")} className="flex-row items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
                        <Text className="text-black dark:text-white text-base">用户协议</Text>
                        <Ionicons name="chevron-forward" size={18} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log("Hook: Help - Privacy Policy")} className="flex-row items-center justify-between p-5">
                        <Text className="text-black dark:text-white text-base">隐私政策</Text>
                        <Ionicons name="chevron-forward" size={18} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* 版本号 */}
                <View className="items-center mt-10">
                    <Text className="text-[#16a34a] dark:text-[#CCFF00] font-black text-2xl italic mb-1">FITBODY</Text>
                    <Text className="text-gray-500 dark:text-gray-600 text-sm">Version 1.0.0 (Build 20240101)</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}