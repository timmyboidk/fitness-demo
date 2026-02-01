/**
 * @file subscription.tsx
 * @description 订阅页面 / 会员中心。
 * 展示 VIP 会员权益、价格方案，以及与免费版的对比。
 * 提供升级支付入口 (集成 Apple IAP)。
 */

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Stack } from 'expo-router';
import { memo, useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { iapService } from '../../services/IAPService';

// 浅色模式下的荧光绿，针对可见性进行了优化
const FLUORESCENT_GREEN = '#CCFF00'; // 荧光绿
const DARK_GREEN_BG = '#16a34a';

export default function SubscriptionScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        let isMounted = true;

        const initIAP = async () => {
            try {
                await iapService.connect();
                const items = await iapService.getProducts();
                if (isMounted) {
                    setProducts(items.sort((a, b) => (a.priceAmountMicros || 0) - (b.priceAmountMicros || 0)));
                }
            } catch (e) {
                console.error("IAP 初始化失败", e);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        initIAP();


        return () => {
            isMounted = false;
            iapService.disconnect();
        };
    }, []);


    /**
     * 处理订阅升级动作
     */
    const handleUpgrade = async (productId: string) => {
        setLoading(true);
        try {
            const userStr = await AsyncStorage.getItem('user');
            if (!userStr) {
                Alert.alert("提示", "请先登录");
                router.push('/(auth)/login');
                return;
            }

            // 发起 Apple Store 购买流程
            await iapService.purchase(productId);
            // 结果将由 useEffect 中的监听器处理 (Apple Store -> 确认 -> 回调)
        } catch (e: any) {
            if (e.message !== '用户取消了交易') {
                Alert.alert("支付失败", "无法完成支付，请重试");
            }
        } finally {
            setLoading(false);
        }
    };

    // 如果未加载到产品（如模拟器），使用静态计划列表
    const displayPlans = products.length > 0 ? products.map(p => ({
        id: p.productId,
        price: p.price,
        period: p.productId.includes('year') ? '/年' : (p.productId.includes('quarter') ? '/3个月' : '/月'),
        label: p.title.replace(/\s*\(.*\)/, ''),
        recommended: p.productId.includes('year')
    })) : [
        { id: 'monthly', price: '$5.99', period: '/月', label: '月度会员' },
        { id: 'quarterly', price: '$17.99', period: '/3个月', label: '季度会员' },
        { id: 'yearly', price: '$59.99', period: '/年', label: '年度会员 (省20%)', recommended: true },
    ];

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex-row items-center px-4 py-4">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 w-10 h-10 items-center justify-center bg-gray-100 dark:bg-[#1C1C1E] rounded-full">
                    <Ionicons name="arrow-back" size={24} color={isDark ? "white" : "black"} />
                </TouchableOpacity>
                <Text className="text-black dark:text-white text-xl font-bold">会员中心</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}>
                <View className="relative h-60 items-center justify-center rounded-[32px] mx-4 mb-8 overflow-hidden"
                    style={{ backgroundColor: isDark ? FLUORESCENT_GREEN : DARK_GREEN_BG }}>
                    <View className="absolute w-80 h-80 bg-white/10 rounded-full -top-10 -right-20" />
                    <View className="absolute w-40 h-40 bg-white/10 rounded-full bottom-10 -left-10" />

                    <Text className={`text-4xl font-black mb-2 ${isDark ? 'text-black' : 'text-white'}`}>PRO 会员</Text>
                    <Text className={`text-lg font-medium ${isDark ? 'text-black/70' : 'text-white/80'}`}>解锁无限可能</Text>
                </View>

                <View className="px-6 mb-10">
                    <Text className="text-black dark:text-white text-xl font-bold mb-6 text-center">会员权益对比</Text>
                    <View className="flex-row mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
                        <View className="flex-1"></View>
                        <View className="w-20 items-center"><Text className="text-gray-400 font-bold">免费版</Text></View>
                        <View className="w-20 items-center">
                            <Text className={`font-black`} style={{ color: isDark ? FLUORESCENT_GREEN : DARK_GREEN_BG }}>PRO</Text>
                        </View>
                    </View>
                    <FeatureRow label="动作库数量" free="10个" vip="无限" isDark={isDark} />
                    <FeatureRow label="训练课程数" free="3个/月" vip="无限" isDark={isDark} />
                    <FeatureRow label="私人教练指导" free="-" vip="支持" highlight isDark={isDark} />
                    <FeatureRow label="24h 客服支持" free="-" vip="支持" highlight isDark={isDark} />
                </View>

                <View className="px-4 space-y-4">
                    {displayPlans.map((plan) => (
                        <TouchableOpacity
                            key={plan.id}
                            disabled={loading}
                            onPress={() => handleUpgrade(plan.id)}
                            className={`flex-row items-center p-5 rounded-3xl border-2 mb-4`}
                            style={{
                                borderColor: plan.recommended ? (isDark ? FLUORESCENT_GREEN : DARK_GREEN_BG) : (isDark ? '#1F2937' : '#F3F4F6'),
                                backgroundColor: plan.recommended
                                    ? (isDark ? 'rgba(204, 255, 0, 0.1)' : 'rgba(22, 163, 74, 0.05)')
                                    : (isDark ? '#111827' : '#FFFFFF'),
                            }}
                        >
                            <View className="flex-1">
                                {plan.recommended && (
                                    <View className="self-start px-2 py-0.5 rounded-md mb-2" style={{ backgroundColor: isDark ? FLUORESCENT_GREEN : DARK_GREEN_BG }}>
                                        <Text className={`text-[10px] font-bold ${isDark ? 'text-black' : 'text-white'}`}>推荐</Text>
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

const FeatureRow = memo(({ label, free, vip, highlight, isDark }: { label: string, free: string, vip: string, highlight?: boolean, isDark: boolean }) => {
    return (
        <View className="flex-row items-center py-3 border-b border-gray-50 dark:border-gray-900">
            <Text className="flex-1 text-gray-600 dark:text-gray-300 font-medium">{label}</Text>
            <View className="w-20 items-center">
                <Text className="text-gray-400 text-sm">{free}</Text>
            </View>
            <View className="w-20 items-center">
                <View className="flex-row items-center">
                    {highlight && <MaterialCommunityIcons name="star" size={12} color="#EAB308" style={{ marginRight: 2 }} />}
                    <Text className="text-black dark:text-white font-bold text-sm">{vip}</Text>
                </View>
            </View>
        </View>
    )
});
