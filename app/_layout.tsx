/**
 * @file _layout.tsx
 * @description Application Root Layout.
 * Loads the Inter font family via expo-font, gates rendering behind font load,
 * and defines the global navigation structure (Stack).
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

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

// Suppress all warnings in demo
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
                {/* Auth screens (flat Stack Screens within (auth) dir) */}

                {/* Main Tab navigation */}
                <Stack.Screen name="(tabs)" />

                {/* AI Workout (fullscreen immersive modal) */}
                <Stack.Screen name="workout/[id]" options={{ presentation: 'fullScreenModal' }} />
            </Stack>
        </View>
    );
}