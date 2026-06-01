/**
 * @file _layout.tsx
 * @description 应用根布局。
 * 通过 expo-font 加载 Inter 字体族，在字体加载完成后渲染，
 * 并定义全局导航结构（Stack）。
 */

import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
    useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { LogBox, View, useColorScheme } from 'react-native';
import 'react-native-reanimated';

import { Colors } from '../constants/theme';

// 在字体加载期间保持启动屏幕可见
SplashScreen.preventAutoHideAsync();

// 在演示中抑制所有警告
LogBox.ignoreAllLogs(true);

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        Inter_900Black,
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    const bg = isDark ? Colors.dark.background : Colors.light.background;

    return (
        <View style={{ flex: 1, backgroundColor: bg }}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Stack screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: bg },
            }}>
                {/* 认证屏幕（(auth)目录中的平面堆栈屏幕）*/}

                {/* 主标签导航 */}
                <Stack.Screen name="(tabs)" />

                {/* AI 训练（全屏沉浸式模态）*/}
                <Stack.Screen name="workout/[id]" options={{ presentation: 'fullScreenModal' }} />
            </Stack>
        </View>
    );
}