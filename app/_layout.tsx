import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';

export default function RootLayout() {
    return (
        <View style={{ flex: 1, backgroundColor: '#121212' }}>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#121212' } }}>
                {/* 登录页组 */}
                {/* 登录页组 - (auth) is a group without layout, so we don't list it as a screen */}

                {/* 主程序 Tabs */}
                <Stack.Screen name="(tabs)" />
                {/* 核心 AI 训练页 (全屏模态) */}
                <Stack.Screen name="workout/[id]" options={{ presentation: 'fullScreenModal' }} />
            </Stack>
        </View>
    );
}