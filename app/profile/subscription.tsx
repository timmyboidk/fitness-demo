/**
 * @file subscription.tsx
 * @description 订阅页面 / 会员中心。
 * 展示 VIP 会员权益、价格方案，以及与免费版的对比。
 * 提供升级支付入口。
 */

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../../services/AuthService';

export default function SubscriptionScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [loading, setLoading] = useState(false);

    // 价格方案
    const PLANS = [
        { id: 'monthly', price: '$5.99', period: '/月', label: '月度会员' },
        { id: 'quarterly', price: '$17.99', period: '/3个月', label: '季度会员' },
        { id: 'yearly', price: '$59.99', period: '/年', label: '年度会员 (省20%)', recommended: true },
    ];

    /**
     * 处理订阅升级
     */
    const handleUpgrade = async (planId: string) => {
        setLoading(true);
        try {
            // 获取当前用户ID
            const userStr = await AsyncStorage.getItem('user');
            if (!userStr) {
                Alert.alert("提示", "请先登录");
                router.push('/(auth)/login');
                return;
            }
            const user = JSON.parse(userStr);

            // 调用 mock 升级接口
            const result = await authService.upgradeToVip(user.id, planId);

            if (result.success) {
                // 本地更新用户状态
                user.isVip = true;
                user.vipExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 简单模拟加30天
                await AsyncStorage.setItem('user', JSON.stringify(user));

                Alert.alert("恭喜", "您已成功升级为 VIP 会员！", [
                    { text: "OK", onPress: () => router.back() }
                ]);
            } else {
                Alert.alert("支付失败", result.error || "请重试");
            }
        } catch (e) {
            Alert.alert("错误", "发生未知错误");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* 统一的带返回键 Header */}
            <View className="flex-row items-center px-4 py-4">
                <TouchableOpacity onPress={() => {
                    router.back();
                }} className="mr-4 w-10 h-10 items-center justify-center bg-gray-100 dark:bg-[#1C1C1E] rounded-full">
                    <Ionicons name="arrow-back" size={24} color={isDark ? "white" : "black"} />
                </TouchableOpacity>
                <Text className="text-black dark:text-white text-xl font-bold">会员中心</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}>
                {/* 顶部 Banner */}
                <View className="relative h-60 bg-[#16a34a] dark:bg-[#CCFF00] items-center justify-center rounded-[32px] mx-4 mb-8 overflow-hidden">
                    {/* 背景装饰图案 */}
                    <View className="absolute w-80 h-80 bg-white/10 rounded-full -top-10 -right-20" />
                    <View className="absolute w-40 h-40 bg-white/10 rounded-full bottom-10 -left-10" />

                    <Text className="text-white dark:text-black text-4xl font-black mb-2">PRO 会员</Text>
                    <Text className="text-white/80 dark:text-black/70 text-lg font-medium">解锁无限可能</Text>
                </View>

                {/* 权益对比表格 */}
                <View className="px-6 mb-10">
                    <Text className="text-black dark:text-white text-xl font-bold mb-6 text-center">会员权益对比</Text>

                    {/* 表头 */}
                    <View className="flex-row mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
                        <View className="flex-1"></View>
                        <View className="w-20 items-center"><Text className="text-gray-400 font-bold">免费版</Text></View>
                        <View className="w-20 items-center"><Text className="text-[#16a34a] dark:text-[#CCFF00] font-black">PRO</Text></View>
                    </View>

                    {/* 权益项 */}
                    <FeatureRow label="动作库数量" free="10个" vip="无限" />
                    <FeatureRow label="训练课程数" free="3个/月" vip="无限" />
                    <FeatureRow label="私人教练指导" free="-" vip="支持" highlight />
                    <FeatureRow label="24h 客服支持" free="-" vip="支持" highlight />
                </View>

                {/* 价格选择卡片区域 */}
                <View className="px-4 space-y-4">
                    {PLANS.map((plan) => (
                        <TouchableOpacity
                            key={plan.id}
                            disabled={loading}
                            onPress={() => handleUpgrade(plan.id)}
                            className={`flex-row items-center p-5 rounded-3xl border-2 ${plan.recommended ? 'border-[#16a34a] dark:border-[#CCFF00] bg-[#16a34a]/5 dark:bg-[#CCFF00]/10' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900'}`}
                        >
                            <View className="flex-1">
                                {plan.recommended && (
                                    <View className="bg-[#16a34a] dark:bg-[#CCFF00] self-start px-2 py-0.5 rounded-md mb-2">
                                        <Text className="text-white dark:text-black text-[10px] font-bold">推荐</Text>
                                    </View>
                                )}
                                <Text className="text-black dark:text-white font-bold text-lg">{plan.label}</Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-black dark:text-white text-2xl font-black">{plan.price}</Text>
                                <Text className="text-gray-400 text-xs">{plan.period}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text className="text-center text-gray-400 text-xs mt-8 px-8">
                    确认购买即表示您同意我们的<Text className="text-blue-500">服务条款</Text>和<Text className="text-blue-500">隐私政策</Text>。
                    订阅将自动续费，除非在当前周期结束前取消。
                </Text>

            </ScrollView>
        </SafeAreaView>
    );
}

// 辅助组件：权益行
function FeatureRow({ label, free, vip, highlight }: { label: string, free: string, vip: string, highlight?: boolean }) {
    return (
        <View className="flex-row items-center py-3 border-b border-gray-50 dark:border-gray-900">
            <Text className="flex-1 text-gray-600 dark:text-gray-300 font-medium">{label}</Text>
            <View className="w-20 items-center">
                <Text className="text-gray-400 text-sm">{free}</Text>
            </View>
            <View className="w-20 items-center">
                {vip === '支持' || vip === '无限' ? (
                    <View className="flex-row items-center">
                        {highlight && <MaterialCommunityIcons name="star" size={12} color="#EAB308" style={{ marginRight: 2 }} />}
                        <Text className="text-black dark:text-white font-bold text-sm">{vip}</Text>
                    </View>
                ) : (
                    <Text className="text-black dark:text-white font-bold text-sm">{vip}</Text>
                )}
            </View>
        </View>
    )
}
