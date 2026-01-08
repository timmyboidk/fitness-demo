import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, useColorScheme } from 'react-native';
import 'react-native-reanimated';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <View className="flex-1 bg-white dark:bg-matte" style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#FFFFFF' }}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Stack screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: isDark ? '#121212' : '#FFFFFF' }
            }}>
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