import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelpScreen() {
    return (
        <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* 统一的带返回键 Header */}
            <View className="flex-row items-center px-4 py-4 border-b border-[#333]">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 w-10 h-10 items-center justify-center bg-[#1E1E1E] rounded-full">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold">帮助中心</Text>
            </View>

            <ScrollView className="p-4">
                {/* 联系客服 */}
                <View className="bg-[#1E1E1E] rounded-2xl overflow-hidden mb-6">
                    <TouchableOpacity className="flex-row items-center justify-between p-5 border-b border-gray-800">
                        <View className="flex-row items-center">
                            <Ionicons name="chatbubbles-outline" size={22} color="#CCFF00" style={{ marginRight: 12 }} />
                            <Text className="text-white text-base font-bold">联系在线客服</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center justify-between p-5">
                        <View className="flex-row items-center">
                            <Ionicons name="mail-outline" size={22} color="#CCFF00" style={{ marginRight: 12 }} />
                            <Text className="text-white text-base font-bold">意见反馈</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* 协议 */}
                <View className="bg-[#1E1E1E] rounded-2xl overflow-hidden mb-6">
                    <TouchableOpacity className="flex-row items-center justify-between p-5 border-b border-gray-800">
                        <Text className="text-white text-base">用户协议</Text>
                        <Ionicons name="chevron-forward" size={18} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center justify-between p-5">
                        <Text className="text-white text-base">隐私政策</Text>
                        <Ionicons name="chevron-forward" size={18} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* 版本号 */}
                <View className="items-center mt-10">
                    <Text className="text-[#CCFF00] font-black text-2xl italic mb-1">FITBODY</Text>
                    <Text className="text-gray-600 text-sm">Version 1.0.0 (Build 20240101)</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}