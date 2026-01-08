import { Ionicons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { router, usePathname, withLayoutContext } from 'expo-router';
import { Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 1. 创建支持滑动的 Tab 导航器
const { Navigator } = createMaterialTopTabNavigator();
export const MaterialTopTabs = withLayoutContext(Navigator);

// 2. 自定义底部 Tab Bar 指示器
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Dynamic Colors
    const bgColor = isDark ? '#121212' : '#FFFFFF';
    const borderColor = isDark ? '#333' : '#E5E5E5';
    const activeColor = isDark ? '#CCFF00' : '#0a7ea4'; // Match theme.ts tint if possible, or keep neon for dark
    const inactiveColor = isDark ? '#666' : '#999';
    const textColor = isDark ? '#888' : '#666';

    return (
        <View style={{ backgroundColor: bgColor }}>
            <SafeAreaView edges={['bottom']}>
                <View className="flex-row h-[60px] border-t items-center" style={{ backgroundColor: bgColor, borderColor: borderColor }}>
                    {state.routes.map((route: any, index: number) => {
                        const { options } = descriptors[route.key];
                        // 优先使用 tabBarLabel
                        const label = options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

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

                        // 图标逻辑
                        let iconName: any = 'help';
                        if (route.name === 'index') iconName = isFocused ? 'barbell' : 'barbell-outline';
                        else if (route.name === 'sessions') iconName = isFocused ? 'timer' : 'timer-outline';
                        else if (route.name === 'profile') iconName = isFocused ? 'person' : 'person-outline';

                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={onPress}
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

export default function TabLayout() {
    const pathname = usePathname();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const bgColor = isDark ? '#121212' : '#FFFFFF';
    const primaryTextColor = isDark ? '#FFFFFF' : '#000000';
    const iconColor = isDark ? '#CCFF00' : '#0a7ea4';

    // 动态 Header 配置 logic
    // 注意：我们将 Header 放在 Tab Navigator 之外，这样 Tab 切换时 Header 会更新，但 Navigator 本身如果不卸载，就能保持状态。
    // 之前的问题可能是 CustomTabBar 每次都是新函数导致 TabBar 重新挂载，进而导致 Tab view 异常。
    // 现在 CustomTabBar 是外部静态组件，应该没问题。

    let headerTitle = '';
    let showHeader = true;
    let HeaderRight = null;

    if (pathname === '/' || pathname === '/index') {
        headerTitle = '训练动作';
        HeaderRight = () => (
            <TouchableOpacity onPress={() => router.push('/add-move')} className="mr-4">
                <Ionicons name="add-circle" size={32} color={iconColor} />
            </TouchableOpacity>
        );
    } else if (pathname === '/sessions') {
        headerTitle = '课程计划';
        HeaderRight = () => (
            <TouchableOpacity onPress={() => router.push('/add-session')} className="mr-4">
                <Ionicons name="add-circle" size={32} color={iconColor} />
            </TouchableOpacity>
        );
    } else if (pathname === '/profile') {
        headerTitle = '个人中心';
        // showHeader defaults to true, so we don't need to set it to false anymore
    }

    return (
        <View className="flex-1" style={{ backgroundColor: bgColor }}>
            {/* Header */}
            {showHeader && (
                <SafeAreaView edges={['top']} style={{ backgroundColor: bgColor, zIndex: 10 }}>
                    <View className="h-[50px] flex-row items-center justify-between px-4" style={{ backgroundColor: bgColor }}>
                        <Text className="text-2xl font-black italic tracking-wider" style={{ color: primaryTextColor }}>{headerTitle}</Text>
                        {HeaderRight && <HeaderRight />}
                    </View>
                </SafeAreaView>
            )}

            <MaterialTopTabs
                tabBarPosition="bottom"
                tabBar={(props) => <CustomTabBar {...props} />}
                screenOptions={{
                    swipeEnabled: true,
                    animationEnabled: true,
                    tabBarStyle: { display: 'none' }, // 这里的 style 其实被 CustomTabBar 取代了，但保留配置无害
                }}
            >
                <MaterialTopTabs.Screen name="index" options={{ tabBarLabel: '动作' }} />
                <MaterialTopTabs.Screen name="sessions" options={{ tabBarLabel: '课程' }} />
                <MaterialTopTabs.Screen name="profile" options={{ tabBarLabel: '我的' }} />
            </MaterialTopTabs>
        </View>
    );
}