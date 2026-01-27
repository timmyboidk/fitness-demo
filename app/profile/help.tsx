/**
 * @file help.tsx
 * @description 帮助中心页面。
 * 提供联系客服、意见反馈入口，以及查看用户协议和隐私政策的功能。
 * 底部展示应用版本信息。
 */

import { Stack, router } from 'expo-router';
import { ScrollView, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NavigationHeader } from '../../components/NavigationHeader';
import { SettingItem } from '../../components/SettingItem';

export default function HelpScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* 统一的带返回键 Header */}
            <NavigationHeader
                title="帮助中心"
                onBack={() => {
                    console.log("Hook: Help Back Pressed");
                    router.back();
                }}
            />

            <ScrollView className="p-4">
                {/* 联系客服区域 */}
                <View className="bg-gray-50 dark:bg-[#1C1C1E] rounded-2xl overflow-hidden mb-6">
                    <SettingItem
                        icon="chatbubbles-outline"
                        label="联系在线客服"
                        onPress={() => console.log("Hook: Help - Contact Service")}
                        style={{ borderBottomWidth: 1, borderBottomColor: isDark ? '#333' : '#e5e5e5' }}
                    />
                    <SettingItem
                        icon="mail-outline"
                        label="意见反馈"
                        onPress={() => console.log("Hook: Help - Feedback")}
                    />
                </View>

                {/* 协议与政策 */}
                <View className="bg-gray-50 dark:bg-[#1C1C1E] rounded-2xl overflow-hidden mb-6">
                    <SettingItem
                        label="用户协议"
                        onPress={() => console.log("Hook: Help - User Agreement")}
                        style={{ borderBottomWidth: 1, borderBottomColor: isDark ? '#333' : '#e5e5e5' }}
                    />
                    <SettingItem
                        label="隐私政策"
                        onPress={() => console.log("Hook: Help - Privacy Policy")}
                    />
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