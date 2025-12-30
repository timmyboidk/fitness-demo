import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';

const MENU_ITEMS = [
    { icon: 'settings-outline', label: 'Settings' },
    { icon: 'notifications-outline', label: 'Notifications' },
    { icon: 'shield-checkmark-outline', label: 'Privacy Policy' },
    { icon: 'help-circle-outline', label: 'Help Center' },
];

export default function ProfileScreen() {
    return (
        <ScrollView className="flex-1 bg-matte" contentContainerStyle={{ paddingBottom: 100 }}>
            {/* 顶部 Header */}
            <View className="pt-16 px-6 pb-8 flex-row justify-between items-center">
                <Text className="text-white text-3xl font-black">Profile</Text>
                <TouchableOpacity>
                    <Ionicons name="create-outline" size={28} color="white" />
                </TouchableOpacity>
            </View>

            {/* 用户信息卡片 */}
            <View className="px-6 mb-8 flex-row items-center">
                <View className="w-24 h-24 rounded-full bg-gray-700 border-2 border-neon overflow-hidden mr-5">
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/300' }}
                        className="w-full h-full"
                    />
                </View>
                <View>
                    <Text className="text-white text-2xl font-bold mb-1">Alex Johnson</Text>
                    <Text className="text-gray-400">Fitness Enthusiast</Text>
                    <View className="bg-neon/20 px-3 py-1 rounded-full self-start mt-2">
                        <Text className="text-neon text-xs font-bold">PRO MEMBER</Text>
                    </View>
                </View>
            </View>

            {/* 数据统计 - 对应 PDF 的大卡片 */}
            <View className="mx-6 p-6 bg-surface rounded-3xl border border-gray-800 mb-8 flex-row justify-between">
                <StatItem value="24" label="Workouts" />
                <View className="w-[1px] bg-gray-800 h-full" />
                <StatItem value="85%" label="Accuracy" />
                <View className="w-[1px] bg-gray-800 h-full" />
                <StatItem value="12" label="Active Days" />
            </View>

            {/* 菜单列表 */}
            <View className="px-6">
                <Text className="text-gray-400 mb-4 font-bold">GENERAL</Text>
                <View className="bg-surface rounded-3xl overflow-hidden">
                    {MENU_ITEMS.map((item, index) => (
                        <TouchableOpacity
                            key={item.label}
                            className={`flex-row items-center p-5 ${index < MENU_ITEMS.length - 1 ? 'border-b border-gray-800' : ''}`}
                        >
                            <View className="w-10 h-10 bg-gray-800 rounded-full items-center justify-center mr-4">
                                <Ionicons name={item.icon as any} size={22} color="#CCFF00" />
                            </View>
                            <Text className="text-white font-bold text-lg flex-1">{item.label}</Text>
                            <Ionicons name="chevron-forward" size={20} color="gray" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* 登出按钮 */}
                <Button
                    label="Log Out"
                    variant="outline"
                    className="mt-8 border-red-500/50"
                    textStyle="text-red-500"
                />
            </View>
        </ScrollView>
    );
}

function StatItem({ value, label }: { value: string, label: string }) {
    return (
        <View className="items-center flex-1">
            <Text className="text-neon text-3xl font-black mb-1">{value}</Text>
            <Text className="text-gray-400 text-xs uppercase">{label}</Text>
        </View>
    );
}