/**
 * @file _layout.tsx
 * @description 应用根布局 (Root Layout)。
 * 定义全局导航结构 (Stack)、状态栏样式和全局背景色。
 * 包含 Tabs 主路由、认证组和全屏模态页面的配置。
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogBox, View, useColorScheme } from 'react-native';
import 'react-native-reanimated';

// 在演示环境中屏蔽所有警告
LogBox.ignoreAllLogs(true);

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <View className="flex-1 bg-white dark:bg-black" style={{ flex: 1, backgroundColor: isDark ? '#000000' : '#FFFFFF' }}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Stack screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: isDark ? '#000000' : '#FFFFFF' }
            }}>
                {/* 登录/注册页组 (无需 Layout 包裹) */}
                {/* (auth) 目录下的页面将作为平级 Stack Screen 呈现 */}

                {/* 主程序 Tabs 导航 */}
                <Stack.Screen name="(tabs)" />

                {/* 核心 AI 训练页 (全屏模态展示，沉浸式体验) */}
                <Stack.Screen name="workout/[id]" options={{ presentation: 'fullScreenModal' }} />
            </Stack>
        </View>
    );
}