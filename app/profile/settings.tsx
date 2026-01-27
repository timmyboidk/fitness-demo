/**
 * @file settings.tsx
 * @description 应用设置页面。
 * 管理应用的全局配置，如通知推送、语音指导、语言和深色模式。
 * 提供退出登录功能，清理本地状态并重置路由。
 */

import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationHeader } from '../../components/NavigationHeader';
import { SettingItem } from '../../components/SettingItem';

export default function SettingsScreen() {
    // 设置项状态
    const [notifications, setNotifications] = useState(true);
    const [sound, setSound] = useState(true);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (

        <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* 统一的带返回键 Header */}
            <NavigationHeader title="设置" />

            <ScrollView className="p-4">
                {/* 常规设置组 */}
                <View className="bg-gray-50 dark:bg-[#1C1C1E] rounded-2xl overflow-hidden mb-6">
                    <SettingItem
                        icon="notifications-outline"
                        label="推送通知"
                        value={notifications}
                        onValueChange={(v: boolean) => {
                            setNotifications(v);
                        }}
                        isSwitch
                    />
                    <View className="h-[1px] bg-gray-200 dark:bg-gray-800 mx-4" />
                    <SettingItem
                        icon="volume-high-outline"
                        label="语音指导"
                        value={sound}
                        onValueChange={(v: boolean) => {
                            setSound(v);
                        }}
                        isSwitch
                    />
                </View>

                {/* 个性化设置组 */}
                <View className="bg-gray-50 dark:bg-[#1C1C1E] rounded-2xl overflow-hidden mb-6">
                    <SettingItem icon="language-outline" label="语言" value="简体中文" onPress={() => { }} />
                    <View className="h-[1px] bg-gray-200 dark:bg-gray-800 mx-4" />
                    <SettingItem icon="moon-outline" label="深色模式" value="已开启" onPress={() => { }} />
                </View>

                {/* 退出登录按钮 */}
                <TouchableOpacity
                    onPress={async () => {
                        // 1. 调用 Service 清除状态
                        await import('../../services/AuthService').then(m => m.authService.logout());

                        // 2. 导航回个人中心 (重置路由栈以防返回)
                        router.dismissAll();
                        router.replace('/(tabs)/profile');
                    }}
                    className="bg-gray-50 dark:bg-[#1C1C1E] rounded-2xl p-4 flex-row items-center justify-center mt-4"
                >
                    <Text className="text-red-500 font-bold text-lg">退出登录</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
