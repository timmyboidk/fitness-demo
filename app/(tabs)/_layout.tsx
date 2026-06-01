/**
 * @file _layout.tsx
 * @description Main Tab navigation layout.
 * Uses Material Top Tabs for swipeable navigation.
 * Custom TabBar with haptic feedback and premium accent colors.
 */

import { Ionicons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as Haptics from 'expo-haptics';
import { usePathname, withLayoutContext } from 'expo-router';
import { useEffect } from 'react';
import { Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { libraryStore } from '../../store/library';
import { FontFamily } from '../../constants/theme';

// 1. Create swipeable Tab navigator
const { Navigator } = createMaterialTopTabNavigator();
export const MaterialTopTabs = withLayoutContext(Navigator);

/**
 * Custom bottom Tab Bar with haptic feedback on tab switch.
 */
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const bgColor = isDark ? '#1C1C1E' : '#FFFFFF';
    const borderColor = isDark ? '#38383A' : '#E5E5EA';
    const activeColor = isDark ? '#FFFFFF' : '#000000';
    const inactiveColor = isDark ? '#636366' : '#AEAEB2';
    const textColor = isDark ? '#636366' : '#AEAEB2';

    return (
        <View style={{ backgroundColor: bgColor }}>
            <SafeAreaView edges={['bottom']}>
                <View className="flex-row h-[60px] border-t items-center" style={{ backgroundColor: bgColor, borderColor: borderColor }}>
                    {state.routes.map((route: any, index: number) => {
                        const { options } = descriptors[route.key];
                        const label = options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                        const isFocused = state.index === index;

                        const onPress = () => {
                            Haptics.selectionAsync();
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name, route.params);
                            }
                        };

                        let iconName: any = 'help';
                        if (route.name === 'index') iconName = isFocused ? 'barbell' : 'barbell-outline';
                        else if (route.name === 'sessions') iconName = isFocused ? 'timer' : 'timer-outline';
                        else if (route.name === 'profile') iconName = isFocused ? 'person' : 'person-outline';

                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={onPress}
                                testID={`tab-button-${route.name}`}
                                className="flex-1 items-center justify-center h-full"
                                activeOpacity={0.7}
                            >
                                <Ionicons name={iconName} size={26} color={isFocused ? activeColor : inactiveColor} />
                                <Text style={{
                                    fontSize: 10,
                                    marginTop: 4,
                                    color: isFocused ? activeColor : textColor,
                                    fontFamily: isFocused ? FontFamily.semiBold : FontFamily.regular,
                                }}>
                                    {label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </SafeAreaView>
        </View>
    );
};

/**
 * Tab Layout entry component
 */
export default function TabLayout() {
    const pathname = usePathname();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const bgColor = isDark ? '#000000' : '#F2F2F7';

    useEffect(() => {
        libraryStore.sync();
    }, []);

    return (
        <View className="flex-1" style={{ backgroundColor: bgColor }}>
            <MaterialTopTabs
                tabBarPosition="bottom"
                tabBar={(props) => <CustomTabBar {...props} />}
                screenOptions={{
                    swipeEnabled: true,
                    animationEnabled: true,
                    tabBarStyle: { display: 'none' },
                }}
            >
                <MaterialTopTabs.Screen name="index" options={{ tabBarLabel: '动作' }} />
                <MaterialTopTabs.Screen name="sessions" options={{ tabBarLabel: '课程' }} />
                <MaterialTopTabs.Screen name="profile" options={{ tabBarLabel: '我的' }} />
            </MaterialTopTabs>
        </View>
    );
}