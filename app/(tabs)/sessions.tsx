/**
 * @file sessions.tsx
 * @description 课程计划列表页 (Tab)。
 * 展示所有预置的或用户添加的训练计划 (Sessions)。
 * 类似于动作库主页，该页面也集成全局 Store 进行状态管理。
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SessionItem } from '../../components/SessionItem';
import { libraryStore, Session } from '../../store/library';

/**
 * 训练课程列表屏幕
 */
export default function SessionsScreen() {
    // 课程列表状态
    const [sessions, setSessions] = useState<Session[]>([]);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const textColor = isDark ? '#FFFFFF' : '#000000';
    const iconColor = isDark ? '#CCFF00' : '#16a34a';
    const bgColor = isDark ? '#000000' : '#FFFFFF';

    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // 初始化加载: 获取所有可见的课程
        setSessions(libraryStore.getSessions().filter(s => s.isVisible));

        // 订阅数据变更: 当课程添加/删除/修改时自动刷新
        const unsubscribe = libraryStore.subscribe(() => {
            setSessions(libraryStore.getSessions().filter(s => s.isVisible));
        });

        // 卸载时取消订阅
        return unsubscribe;
    }, []);

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    return (
        <View className="flex-1 bg-white dark:bg-black">
            {/* Sticky Header */}
            <View className="absolute top-0 left-0 right-0 z-10">
                <SafeAreaView edges={['top']} style={{ backgroundColor: bgColor }}>
                    <Animated.View style={{ opacity: headerOpacity }} className="h-[44px] flex-row items-center justify-between px-4 border-b border-gray-100 dark:border-gray-900">
                        <Text className="text-lg font-bold" style={{ color: textColor }}>课程计划</Text>
                        <TouchableOpacity onPress={() => router.push('/add-session')}>
                            <Ionicons name="add-circle" size={28} color={iconColor} />
                        </TouchableOpacity>
                    </Animated.View>
                </SafeAreaView>
            </View>

            <Animated.FlatList
                data={sessions}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingTop: 60, paddingBottom: 100, paddingHorizontal: 16 }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                ListHeaderComponent={() => (
                    <View className="mb-6 mt-8 flex-row justify-between items-end">
                        <Text className="text-4xl font-black italic tracking-wider" style={{ color: textColor }}>课程计划</Text>
                        <TouchableOpacity onPress={() => router.push('/add-session')} className="mb-1">
                            <Ionicons name="add-circle" size={36} color={iconColor} />
                        </TouchableOpacity>
                    </View>
                )}
                renderItem={({ item }) => (
                    <SessionItem
                        item={item}
                        showRemoveButton={true}
                        // 点击移除按钮时隐藏该课程
                        onRemove={() => libraryStore.toggleSessionVisibility(item.id)}
                    />
                )}
            />
        </View>
    );
}