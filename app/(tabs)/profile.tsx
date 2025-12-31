import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const MENU_ITEMS = [
    { icon: 'settings-outline', label: '设置', route: '/profile/settings' },
    { icon: 'trophy-outline', label: '排行榜', route: '/profile/leaderboard' },
    { icon: 'share-social-outline', label: '社交账号', route: '/profile/social' },
    { icon: 'help-circle-outline', label: '帮助中心', route: '/profile/settings' },
];

export default function ProfileScreen() {
    // 2. 新增状态和副作用：读取本地存储的用户信息
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // 页面加载时读取用户信息
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
    }, []);

    // 默认头像 (如果用户没登录或没头像)
    const avatarUrl = user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop';
    const nickname = user?.nickname || '未登录用户';
    const userId = user?._id ? `ID: ${user._id.slice(-6).toUpperCase()}` : '点击登录';

    return (
        <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* 顶部 Header */}
                <View className="pt-4 px-6 pb-8 flex-row justify-between items-center">
                    <Text className="text-white text-3xl font-black italic">个人中心</Text>
                    <TouchableOpacity onPress={() => router.push('/profile/settings')}>
                        <Ionicons name="create-outline" size={28} color="white" />
                    </TouchableOpacity>
                </View>

                {/* 用户信息卡片 */}
                <TouchableOpacity
                    onPress={() => !user && router.push('/(auth)/login')} // 如果没登录，点击头像去登录
                    className="px-6 mb-8 flex-row items-center"
                >
                    {/* 3. 修改头像区域：使用动态数据 */}
                    <View className="w-24 h-24 rounded-full bg-gray-700 border-2 border-[#CCFF00] overflow-hidden mr-5 justify-center items-center">
                        <Image
                            source={{ uri: avatarUrl }}
                            className="w-full h-full"
                        />
                    </View>
                    <View>
                        <Text className="text-white text-2xl font-bold mb-1">{nickname}</Text>
                        <Text className="text-gray-400">{userId}</Text>
                        <View className="bg-[#CCFF00]/20 px-3 py-1 rounded-full self-start mt-2">
                            <Text className="text-[#CCFF00] text-xs font-bold">PRO 会员</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* 4. 修改统计卡片：添加点击跳转事件 */}
                <TouchableOpacity onPress={() => router.push('/profile/stats')}>
                    <View className="mx-6 p-6 bg-[#1E1E1E] rounded-3xl border border-gray-800 mb-8 flex-row justify-between">
                        <StatItem value={user?.stats?.totalWorkouts || "0"} label="累计训练" />
                        <View className="w-[1px] bg-gray-800 h-full" />
                        <StatItem value={user?.stats?.accuracyAvg ? `${user.stats.accuracyAvg}%` : "-"} label="动作评分" />
                        <View className="w-[1px] bg-gray-800 h-full" />
                        <StatItem value={user?.stats?.activeDays || "0"} label="活跃天数" />

                        {/* 右上角的小箭头提示可以点击 */}
                        <View className="absolute right-4 top-4 opacity-50">
                            <Ionicons name="chevron-forward" size={16} color="gray" />
                        </View>
                    </View>
                </TouchableOpacity>

                {/* 菜单列表 */}
                <View className="px-6">
                    <Text className="text-gray-400 mb-4 font-bold ml-2">常用功能</Text>
                    <View className="bg-[#1E1E1E] rounded-3xl overflow-hidden">
                        {MENU_ITEMS.map((item, index) => (
                            <TouchableOpacity
                                key={item.label}
                                onPress={() => router.push(item.route as any)}
                                className={`flex-row items-center p-5 ${index < MENU_ITEMS.length - 1 ? 'border-b border-gray-800' : ''}`}
                            >
                                <View className="w-10 h-10 bg-[#2C2C2C] rounded-full items-center justify-center mr-4">
                                    <Ionicons name={item.icon as any} size={20} color="#CCFF00" />
                                </View>
                                <Text className="text-white font-bold text-lg flex-1">{item.label}</Text>
                                <Ionicons name="chevron-forward" size={20} color="#555" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function StatItem({ value, label }: { value: string, label: string }) {
    return (
        <View className="items-center flex-1">
            <Text className="text-[#CCFF00] text-2xl font-black mb-1 italic">{value}</Text>
            <Text className="text-gray-400 text-xs">{label}</Text>
        </View>
    );
}