import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Button } from '../../components/ui/Button';

// 菜单配置
const MENU_ITEMS = [
    { icon: 'settings-outline', label: '设置', route: '/profile/settings' },
    { icon: 'trophy-outline', label: '排行榜', route: '/profile/leaderboard' },
    { icon: 'share-social-outline', label: '社交账号', route: '/profile/social' },
    { icon: 'help-circle-outline', label: '帮助中心', route: '/profile/settings' }, // 暂时复用
];

export default function ProfileScreen() {
    return (
        <ScrollView className="flex-1 bg-[#121212]" contentContainerStyle={{ paddingBottom: 100 }}>
            {/* 顶部 Header */}
            <View className="pt-16 px-6 pb-8 flex-row justify-between items-center">
                <Text className="text-white text-3xl font-black italic">个人中心</Text>
                <TouchableOpacity onPress={() => router.push('/profile/settings')}>
                    <Ionicons name="create-outline" size={28} color="white" />
                </TouchableOpacity>
            </View>

            {/* 用户信息卡片 */}
            <View className="px-6 mb-8 flex-row items-center">
                <View className="w-24 h-24 rounded-full bg-gray-700 border-2 border-[#CCFF00] overflow-hidden mr-5 justify-center items-center">
                    {/* 这里可以使用真实的头像 URL */}
                    <Ionicons name="person" size={50} color="#666" />
                </View>
                <View>
                    <Text className="text-white text-2xl font-bold mb-1">健身达人</Text>
                    <Text className="text-gray-400">ID: 888888</Text>
                    <View className="bg-[#CCFF00]/20 px-3 py-1 rounded-full self-start mt-2">
                        <Text className="text-[#CCFF00] text-xs font-bold">PRO 会员</Text>
                    </View>
                </View>
            </View>

            {/* 数据统计 - 保持不变 */}
            <View className="mx-6 p-6 bg-[#1E1E1E] rounded-3xl border border-gray-800 mb-8 flex-row justify-between">
                <StatItem value="24" label="累计训练" />
                <View className="w-[1px] bg-gray-800 h-full" />
                <StatItem value="85%" label="动作评分" />
                <View className="w-[1px] bg-gray-800 h-full" />
                <StatItem value="12" label="活跃天数" />
            </View>

            {/* 菜单列表 - 点击跳转到真实页面 */}
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