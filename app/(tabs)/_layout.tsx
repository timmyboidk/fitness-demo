/**
 * @file _layout.tsx
 * @description 主 Tab 导航布局。
 * 使用 Material Top Tabs 实现可滑动的底部导航栏效果。
 * 自定义了 TabBar 和全局 Header 逻辑，集成暗黑模式适配。
 */

import { Ionicons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { router, usePathname, withLayoutContext } from 'expo-router';
import { useEffect } from 'react';
import { Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { libraryStore } from '../../store/library';

// 1. 创建支持滑动的 Tab 导航器实例
const { Navigator } = createMaterialTopTabNavigator();
// 暴露给 expo-router 使用
export const MaterialTopTabs = withLayoutContext(Navigator);

/**
 * 自定义底部 Tab Bar 组件
 * 替代默认的 Material Top Tab Bar，放置在屏幕底部
 */
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // 动态配色方案
    const bgColor = isDark ? '#121212' : '#FFFFFF';
    const borderColor = isDark ? '#333' : '#E5E5E5';
    const activeColor = isDark ? '#CCFF00' : '#16a34a'; // 高亮色: 暗色模式下为荧光绿，亮色模式下为深绿
    const inactiveColor = isDark ? '#666' : '#999';
    const textColor = isDark ? '#888' : '#666';

    return (
        <View style={{ backgroundColor: bgColor }}>
            <SafeAreaView edges={['bottom']}>
                <View className="flex-row h-[60px] border-t items-center" style={{ backgroundColor: bgColor, borderColor: borderColor }}>
                    {state.routes.map((route: any, index: number) => {
                        const { options } = descriptors[route.key];
                        // 优先使用 tabBarLabel，其次 title，最后 name
                        const label = options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                        // 判断当前 Tab 是否激活
                        const isFocused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name, route.params);
                            }
                        };

                        // 图标选择逻辑: 根据 Tab 名称和激活状态切换 icon
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
                                <Text style={{ fontSize: 10, marginTop: 4, color: isFocused ? activeColor : textColor }}>
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
 * Tab 布局入口组件
 */
export default function TabLayout() {
    const pathname = usePathname();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const bgColor = isDark ? '#121212' : '#FFFFFF';
    const primaryTextColor = isDark ? '#FFFFFF' : '#000000';
    const iconColor = isDark ? '#CCFF00' : '#16a34a';

    useEffect(() => {
        // App 启动/Tab 加载时同步最新的库数据
        libraryStore.sync();
    }, []);

    // 动态 Header 配置逻辑
    // 根据当前路由路径 (pathname) 动态决定 Header 的标题和右侧按钮
    // 这种方式比在每个Screen里单独配Header更灵活，尤其是在自定义TabLayout的情况下

    let headerTitle = '';
    let showHeader = true;
    let HeaderRight = null;

    if (pathname === '/' || pathname === '/index') {
        headerTitle = '训练动作';
        // eslint-disable-next-line react/display-name
        HeaderRight = () => (
            <TouchableOpacity onPress={() => router.push('/add-move')} className="mr-4">
                <Ionicons name="add-circle" size={32} color={iconColor} />
            </TouchableOpacity>
        );
    } else if (pathname === '/sessions') {
        headerTitle = '课程计划';
        // eslint-disable-next-line react/display-name
        HeaderRight = () => (
            <TouchableOpacity onPress={() => router.push('/add-session')} className="mr-4">
                <Ionicons name="add-circle" size={32} color={iconColor} />
            </TouchableOpacity>
        );
    } else if (pathname === '/profile') {
        headerTitle = '个人中心';
    }

    return (
        <View className="flex-1" style={{ backgroundColor: bgColor }}>
            {/* 全局自定义 Header */}
            {showHeader && (
                <SafeAreaView edges={['top']} style={{ backgroundColor: bgColor, zIndex: 10 }}>
                    <View className="h-[50px] flex-row items-center justify-between px-4" style={{ backgroundColor: bgColor }}>
                        <Text className="text-2xl font-black italic tracking-wider" style={{ color: primaryTextColor }}>{headerTitle}</Text>
                        {HeaderRight && <HeaderRight />}
                    </View>
                </SafeAreaView>
            )}

            {/* Tab 导航容器 */}
            <MaterialTopTabs
                tabBarPosition="bottom"
                tabBar={(props) => <CustomTabBar {...props} />}
                screenOptions={{
                    swipeEnabled: true, // 允许左右滑动切换 Tab
                    animationEnabled: true,
                    tabBarStyle: { display: 'none' }, // 隐藏默认 TabBar (使用自定义的)
                }}
            >
                <MaterialTopTabs.Screen name="index" options={{ tabBarLabel: '动作' }} />
                <MaterialTopTabs.Screen name="sessions" options={{ tabBarLabel: '课程' }} />
                <MaterialTopTabs.Screen name="profile" options={{ tabBarLabel: '我的' }} />
            </MaterialTopTabs>
        </View>
    );
}