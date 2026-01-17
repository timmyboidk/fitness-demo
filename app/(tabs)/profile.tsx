/**
 * @file profile.tsx
 * @description 个人中心页面。
 * 展示用户信息、运动统计数据以及常用功能菜单。
 * 支持用户登录状态检查和数据自动加载。
 */

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Animated, Image, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { LargeTitle } from '../../components/LargeTitle';
import { StickyHeader } from '../../components/StickyHeader';

// 固定的菜单项配置，包含图标、标签和路由目标
const MENU_ITEMS = [
    { icon: 'fitness-outline', label: '健身基础', route: '/onboarding/difficulty' },
    // { icon: 'settings-outline', label: '设置', route: '/profile/settings' },
    // { icon: 'card-outline', label: '会员中心', route: '/profile/subscription' },
    { icon: 'trophy-outline', label: '排行榜', route: '/profile/leaderboard' },
    { icon: 'share-social-outline', label: '社交账号', route: '/profile/social' },
    { icon: 'help-circle-outline', label: '帮助中心', route: '/profile/help' },
];

/**
 * 个人中心屏幕组件
 */
export default function ProfileScreen() {
    // 本地状态：存储从 AsyncStorage 读取的用户信息
    const [user, setUser] = useState<any>(null);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const textColor = isDark ? '#FFFFFF' : '#000000';

    const scrollY = useRef(new Animated.Value(0)).current;

    useFocusEffect(
        useCallback(() => {
            // 页面获得焦点时，异步读取本地存储的用户数据
            // 这确保了从订阅页返回时，VIP状态能即时更新
            const loadUser = async () => {
                try {
                    const userStr = await AsyncStorage.getItem('user');
                    if (userStr) {
                        setUser(JSON.parse(userStr));
                    }
                } catch (e) {
                    console.error("Failed to load user", e);
                }
            };
            loadUser();
        }, [])
    );

    // 默认展示逻辑：如果用户未登录或无数据，展示默认占位图和文本
    const avatarUrl = user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop';
    const nickname = user?.nickname || '未登录用户';
    const userId = user?._id ? `ID: ${user._id.slice(-6).toUpperCase()}` : '点击登录';

    const RightSettingsButton = (
        <TouchableOpacity onPress={() => router.push('/profile/settings')}>
            <Ionicons name="settings-outline" size={24} color={textColor} />
        </TouchableOpacity>
    );

    const LargeRightSettingsButton = (
        <TouchableOpacity onPress={() => router.push('/profile/settings')} className="mb-1">
            <Ionicons name="settings-outline" size={30} color={textColor} />
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <StickyHeader
                scrollY={scrollY}
                title="个人中心"
                rightElement={RightSettingsButton}
            />

            <Animated.ScrollView
                contentContainerStyle={{ paddingTop: 60, paddingBottom: 100 }}
                contentInsetAdjustmentBehavior="never"
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
            >
                {/* Large Title with extra padding to match profile design */}
                <LargeTitle
                    title="个人中心"
                    rightElement={LargeRightSettingsButton}
                    style={{ paddingHorizontal: 24 }} // px-6 = 24px
                />

                {/* 用户信息卡片区：展示头像、昵称和会员状态 */}
                <TouchableOpacity
                    activeOpacity={user ? 1 : 0.7} // 如果不仅是登录状态，禁用点击透明度效果
                    onPress={() => {
                        // 如果未登录，点击整个区域跳转登录页
                        if (!user) router.push('/(auth)/login');
                    }}
                    className="px-6 mb-8 flex-row items-center"
                >
                    {/* 头像区域：圆角裁剪 + 边框 */}
                    <View className={`w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 border-2 overflow-hidden mr-5 justify-center items-center ${user?.isVip ? 'border-[#FFD700]' : 'border-[#16a34a] dark:border-[#CCFF00]'}`}>
                        <Image
                            source={{ uri: avatarUrl }}
                            className="w-full h-full"
                        />
                        {/* VIP 金色皇冠装饰 */}
                        {user?.isVip && (
                            <View className="absolute -top-4 -right-2">
                                <MaterialCommunityIcons name="crown" size={24} color="#FFD700" />
                            </View>
                        )}
                    </View>
                    <View>
                        <Text className="text-black dark:text-white text-2xl font-bold mb-1">{nickname}</Text>
                        <Text className="text-gray-500 dark:text-gray-400">{userId}</Text>

                        {user?.isVip ? (
                            <View className="bg-yellow-400 dark:bg-yellow-500 px-3 py-1 rounded-full self-start mt-2">
                                <Text className="text-black text-xs font-black">VIP 会员</Text>
                            </View>
                        ) : (
                            <TouchableOpacity
                                onPress={() => router.push('/profile/subscription' as any)}
                                className="bg-[#16a34a] dark:bg-[#CCFF00] px-3 py-1 rounded-full self-start mt-2 flex-row items-center"
                            >
                                <Text className="text-white dark:text-black text-xs font-bold mr-1">升级 PRO</Text>
                                <Ionicons name="arrow-forward" size={10} color={isDark ? "black" : "white"} />
                            </TouchableOpacity>
                        )}
                    </View>
                </TouchableOpacity>

                {/* 统计数据卡片：展示训练次数、评分和活跃天数 */}
                <TouchableOpacity onPress={() => {
                    router.push('/profile/stats');
                }}>
                    <View className="mx-6 p-6 bg-gray-50 dark:bg-[#1C1C1E] rounded-3xl border border-gray-200 dark:border-transparent mb-8 flex-row justify-between">
                        <StatItem value={user?.stats?.totalWorkouts || "0"} label="累计训练" />
                        <View className="w-[1px] bg-gray-300 dark:bg-gray-800 h-full" />
                        <StatItem value={user?.stats?.accuracyAvg ? `${user.stats.accuracyAvg}%` : "-"} label="动作评分" />
                        <View className="w-[1px] bg-gray-300 dark:bg-gray-800 h-full" />
                        <StatItem value={user?.stats?.activeDays || "0"} label="活跃天数" />

                        {/* 右上角箭头指示器 */}
                        <View className="absolute right-4 top-4 opacity-50">
                            <Ionicons name="chevron-forward" size={16} color={isDark ? "gray" : "#999"} />
                        </View>
                    </View>
                </TouchableOpacity>

                {/* 功能菜单列表 */}
                <View className="px-6">
                    <Text className="text-gray-500 dark:text-gray-400 mb-4 font-bold ml-2">常用功能</Text>
                    <View className="bg-gray-50 dark:bg-[#1C1C1E] rounded-3xl overflow-hidden">
                        {MENU_ITEMS.map((item, index) => (
                            <TouchableOpacity
                                key={item.label}
                                testID={`menu-item-${item.label}`}
                                onPress={() => {
                                    router.push(item.route as any);
                                }}
                                className={`flex-row items-center p-5 ${index < MENU_ITEMS.length - 1 ? 'border-b border-gray-200 dark:border-gray-800' : ''}`}
                            >
                                <View className="w-10 h-10 bg-gray-200 dark:bg-[#2C2C2C] rounded-full items-center justify-center mr-4">
                                    <Ionicons name={item.icon as any} size={20} color={isDark ? "#CCFF00" : "#16a34a"} />
                                </View>
                                <Text className="text-black dark:text-white font-bold text-lg flex-1">{item.label}</Text>
                                <Ionicons name="chevron-forward" size={20} color={isDark ? "#555" : "#ccc"} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Animated.ScrollView>
        </View>
    );
}

/**
 * 统计项子组件
 */
function StatItem({ value, label }: { value: string, label: string }) {
    return (
        <View className="items-center flex-1">
            <Text className="text-[#16a34a] dark:text-[#CCFF00] text-2xl font-black mb-1 italic">{value}</Text>
            <Text className="text-gray-500 dark:text-gray-400 text-xs">{label}</Text>
        </View>
    );
}