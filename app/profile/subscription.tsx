/**
 * @file subscription.tsx
 * @description 订阅页面 / 会员中心。
 * 展示 VIP 会员权益、价格方案，以及与免费版的对比。
 * 提供升级支付入口 (集成 Apple IAP)。
 */

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as InAppPurchases from 'expo-in-app-purchases';
import { router, Stack } from 'expo-router';
import { memo, useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { iapService } from '../../services/IAPService';

// Fluorescent Green for Light Mode, optimized for visibility
const FLUORESCENT_GREEN = '#CCFF00'; // Fluorescent Green
const DARK_GREEN_BG = '#16a34a';

export default function SubscriptionScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<InAppPurchases.IAPItemDetails[]>([]);

    useEffect(() => {
        let isMounted = true;

        const initIAP = async () => {
            try {
                // Eliminate Waterfall: Connect and check user in parallel could be risky if connect fails,
                // but for fetching products we can start early.
                // Actually, IAP connection is global.
                // We'll run connection and fetching in parallel with any other initialization if needed.
                // Since this page depends on IAP products, we prioritize that.

                await iapService.connect();
                // Parallelize fetching products and any user state if needed (user state is usually global or fast async storage)
                // For now, we just fetch products.
                const items = await iapService.getProducts();
                if (isMounted) {
                    setProducts(items.sort((a, b) => (a.priceAmountMicros || 0) - (b.priceAmountMicros || 0)));
                }
            } catch (e) {
                console.error("IAP Init failed", e);
                // Fallback to static plans or show error?
                // For demo purpose, we might keep static plans if IAP fails or just show empty?
                // The original code had static plans. We should probably map IAP products to UI.
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        initIAP();

        // Setup listener
        iapService.setPurchaseListener((purchase) => {
            // Verification logic would go here ideally on server side using purchase.transactionReceipt
            Alert.alert("恭喜", "您已成功升级为 VIP 会员！", [
                { text: "OK", onPress: () => router.back() }
            ]);
        });

        return () => {
            isMounted = false;
            iapService.disconnect();
        };
    }, []);


    /**
     * 处理订阅升级
     */
    const handleUpgrade = async (productId: string) => {
        setLoading(true);
        try {
            // Early Return pattern
            const userStr = await AsyncStorage.getItem('user');
            if (!userStr) {
                Alert.alert("提示", "请先登录");
                router.push('/(auth)/login');
                return;
            }

            // Initiate purchase
            await iapService.purchase(productId);
            // Note: The result is handled in the listener set in useEffect

        } catch (e: any) {
            if (e.message !== 'User canceled the transaction') {
                Alert.alert("支付失败", "无法完成支付，请重试");
            }
        } finally {
            setLoading(false);
        }
    };

    // Fallback plans if no IAP products loaded (for Simulator/Dev without IAP config)
    const displayPlans = products.length > 0 ? products.map(p => ({
        id: p.productId,
        price: p.price,
        period: p.productId.includes('year') ? '/年' : (p.productId.includes('quarter') ? '/3个月' : '/月'),
        label: p.title.replace(/\s*\(.*\)/, ''), // Simple cleanup
        recommended: p.productId.includes('year')
    })) : [
        { id: 'monthly', price: '$5.99', period: '/月', label: '月度会员' },
        { id: 'quarterly', price: '$17.99', period: '/3个月', label: '季度会员' },
        { id: 'yearly', price: '$59.99', period: '/年', label: '年度会员 (省20%)', recommended: true },
    ];

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* 统一的带返回键 Header */}
            <View className="flex-row items-center px-4 py-4">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 w-10 h-10 items-center justify-center bg-gray-100 dark:bg-[#1C1C1E] rounded-full">
                    <Ionicons name="arrow-back" size={24} color={isDark ? "white" : "black"} />
                </TouchableOpacity>
                <Text className="text-black dark:text-white text-xl font-bold">会员中心</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}>
                {/* 顶部 Banner - Fluorescent Green applied */}
                <View className="relative h-60 items-center justify-center rounded-[32px] mx-4 mb-8 overflow-hidden"
                    style={{ backgroundColor: isDark ? FLUORESCENT_GREEN : DARK_GREEN_BG }}>
                    {/* 背景装饰图案 */}
                    <View className="absolute w-80 h-80 bg-white/10 rounded-full -top-10 -right-20" />
                    <View className="absolute w-40 h-40 bg-white/10 rounded-full bottom-10 -left-10" />

                    <Text className={`text-4xl font-black mb-2 ${isDark ? 'text-black' : 'text-white'}`}>PRO 会员</Text>
                    <Text className={`text-lg font-medium ${isDark ? 'text-black/70' : 'text-white/80'}`}>解锁无限可能</Text>
                </View>

                {/* 权益对比表格 */}
                <View className="px-6 mb-10">
                    <Text className="text-black dark:text-white text-xl font-bold mb-6 text-center">会员权益对比</Text>

                    {/* 表头 */}
                    <View className="flex-row mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
                        <View className="flex-1"></View>
                        <View className="w-20 items-center"><Text className="text-gray-400 font-bold">免费版</Text></View>
                        <View className="w-20 items-center">
                            <Text className={`font-black`} style={{ color: isDark ? FLUORESCENT_GREEN : DARK_GREEN_BG }}>PRO</Text>
                        </View>
                    </View>

                    {/* 权益项 */}
                    <FeatureRow label="动作库数量" free="10个" vip="无限" isDark={isDark} />
                    <FeatureRow label="训练课程数" free="3个/月" vip="无限" isDark={isDark} />
                    <FeatureRow label="私人教练指导" free="-" vip="支持" highlight isDark={isDark} />
                    <FeatureRow label="24h 客服支持" free="-" vip="支持" highlight isDark={isDark} />
                </View>

                {/* 价格选择卡片区域 */}
                <View className="px-4 space-y-4">
                    {displayPlans.map((plan) => (
                        <TouchableOpacity
                            key={plan.id}
                            disabled={loading}
                            onPress={() => handleUpgrade(plan.id)}
                            className={`flex-row items-center p-5 rounded-3xl border-2`}
                            style={{
                                borderColor: plan.recommended ? (isDark ? FLUORESCENT_GREEN : DARK_GREEN_BG) : (isDark ? '#1F2937' : '#F3F4F6'), // gray-800 : gray-100
                                backgroundColor: plan.recommended
                                    ? (isDark ? 'rgba(204, 255, 0, 0.1)' : 'rgba(22, 163, 74, 0.05)')
                                    : (isDark ? '#111827' : '#FFFFFF'), // gray-900 : white
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

// 辅助组件：权益行 - Memoized to reduce re-renders
const FeatureRow = memo(({ label, free, vip, highlight, isDark }: { label: string, free: string, vip: string, highlight?: boolean, isDark: boolean }) => {
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
});
