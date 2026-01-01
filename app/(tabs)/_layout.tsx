import { Ionicons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { router, usePathname, withLayoutContext } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 1. 创建支持滑动的 Tab 导航器
const { Navigator } = createMaterialTopTabNavigator();
export const MaterialTopTabs = withLayoutContext(Navigator);

export default function TabLayout() {
    const pathname = usePathname();

    // 2. 自定义底部 Tab Bar
    const CustomTabBar = ({ state, descriptors, navigation }: any) => {
        return (
            <View style={{ backgroundColor: '#121212' }}>
                <SafeAreaView edges={['bottom']}>
                    <View className="flex-row h-[60px] border-t border-[#333] bg-[#121212] items-center">
                        {state.routes.map((route: any, index: number) => {
                            const { options } = descriptors[route.key];
                            const label = options.tabBarLabel;
                            const isFocused = state.index === index;

                            const onPress = () => {
                                const event = navigation.emit({
                                    type: 'tabPress',
                                    target: route.key,
                                    canPreventDefault: true,
                                });
                                if (!isFocused && !event.defaultPrevented) {
                                    navigation.navigate(route.name);
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
                                    <Ionicons name={iconName} size={26} color={isFocused ? '#CCFF00' : '#666'} />
                                    <Text style={{ fontSize: 10, marginTop: 4, color: isFocused ? '#CCFF00' : '#888' }}>
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

    // 右上角加号按钮
    const AddButton = () => (
        <TouchableOpacity onPress={() => router.push('/add-item')} className="mr-4">
            <Ionicons name="add-circle" size={32} color="#CCFF00" />
        </TouchableOpacity>
    );

    // 动态 Header 配置
    let headerTitle = '';
    let showHeader = true;
    let HeaderRight = null;

    if (pathname === '/' || pathname === '/index') {
        headerTitle = '训练动作';
        HeaderRight = () => (
            <TouchableOpacity onPress={() => router.push('/add-move')} className="mr-4">
                <Ionicons name="add-circle" size={32} color="#CCFF00" />
            </TouchableOpacity>
        );
    } else if (pathname === '/sessions') {
        headerTitle = '课程计划';
        HeaderRight = () => (
            <TouchableOpacity onPress={() => router.push('/add-session')} className="mr-4">
                <Ionicons name="add-circle" size={32} color="#CCFF00" />
            </TouchableOpacity>
        );
    } else if (pathname === '/profile') {
        showHeader = false; // 个人中心不显示这个 Header
    }

    return (
        <View className="flex-1 bg-[#121212]">
            {/* 自定义顶部 Header */}
            {showHeader && (
                <SafeAreaView edges={['top']} style={{ backgroundColor: '#121212', zIndex: 10 }}>
                    <View className="h-[50px] flex-row items-center justify-between px-4 bg-[#121212]">
                        <Text className="text-white text-2xl font-black italic tracking-wider">{headerTitle}</Text>
                        {HeaderRight && <HeaderRight />}
                    </View>
                </SafeAreaView>
            )}

            {/* 滑动 Tab 内容区 */}
            <MaterialTopTabs
                tabBarPosition="bottom"
                tabBar={(props) => <CustomTabBar {...props} />}
                screenOptions={{
                    swipeEnabled: true,      // 核心：开启滑动
                    animationEnabled: true,  // 核心：开启过渡动画
                    lazy: true,              // 性能优化：懒加载
                    tabBarStyle: { display: 'none' }, // 隐藏默认的 top tab bar
                }}
            >
                <MaterialTopTabs.Screen name="index" options={{ tabBarLabel: '动作' }} />
                <MaterialTopTabs.Screen name="sessions" options={{ tabBarLabel: '课程' }} />
                <MaterialTopTabs.Screen name="profile" options={{ tabBarLabel: '我的' }} />

                {/* 隐藏不需要的路由 */}
                <MaterialTopTabs.Screen name="explore" options={{ tabBarItemStyle: { display: 'none' } }} />
            </MaterialTopTabs>
        </View>
    );
}