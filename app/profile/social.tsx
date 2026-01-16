/**
 * @file social.tsx
 * @description 社交账号绑定页面。
 * 展示并管理第三方账号（微信、Apple、Instagram）的绑定状态。
 */

import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SocialScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* 统一的带返回键 Header */}
            <View className="flex-row items-center px-4 py-4">
                <TouchableOpacity onPress={() => {
                    console.log("Hook: Social Back Pressed");
                    router.back();
                }} className="mr-4 w-10 h-10 items-center justify-center bg-gray-100 dark:bg-[#1C1C1E] rounded-full">
                    <Ionicons name="arrow-back" size={24} color={isDark ? "white" : "black"} />
                </TouchableOpacity>
                <Text className="text-black dark:text-white text-xl font-bold">社交账号绑定</Text>
            </View>

            <View className="p-4">
                <SocialItem icon="logo-wechat" name="微信" status="已连接" color="#07C160" onPress={() => console.log("Hook: Social Link - WeChat")} />
                <SocialItem icon="logo-apple" name="Apple ID" status="未连接" color={isDark ? "#fff" : "#000"} onPress={() => console.log("Hook: Social Link - Apple")} />
                <SocialItem icon="logo-instagram" name="Instagram" status="未连接" color="#E1306C" onPress={() => console.log("Hook: Social Link - Instagram")} />
            </View>
        </SafeAreaView>
    );
}

/**
 * 社交账号列表项组件
 */
function SocialItem({ icon, name, status, color, onPress }: any) {
    return (
        <TouchableOpacity onPress={onPress} className="flex-row items-center justify-between bg-gray-50 dark:bg-[#1C1C1E] p-5 rounded-2xl mb-4">
            <View className="flex-row items-center">
                <Ionicons name={icon} size={28} color={color} style={{ marginRight: 16 }} />
                <Text className="text-black dark:text-white font-bold text-lg">{name}</Text>
            </View>
            <Text className={status === '已连接' ? 'text-[#07C160]' : 'text-gray-500'}>{status}</Text>
        </TouchableOpacity>
    );
}