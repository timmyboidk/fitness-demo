/**
 * @file add-session.tsx
 * @description 添加课程页面。
 * 列出 Global Store 中所有尚未“可见”的课程，供用户添加到个人计划中。
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SessionItem } from '../components/SessionItem';
import { libraryStore, Session } from '../store/library';

export default function AddSessionScreen() {
    // 初始化：仅获取当前不可见的课程
    const [sessions, setSessions] = useState<Session[]>(libraryStore.getSessions().filter(s => !s.isVisible));
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    /**
     * 处理添加课程
     * @param id - 课程 ID
     */
    const handleAdd = async (id: string) => {
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            const mySessionsCount = libraryStore.getSessions().filter(s => s.isVisible).length;

            // 免费用户限制: 最多 3 个课程
            if (!user.isVip && mySessionsCount >= 3) {
                Alert.alert(
                    "达到限制",
                    "免费版每月限 3 个课程。升级到 VIP 解锁无限训练计划。",
                    [
                        { text: "取消", style: "cancel" },
                        { text: "去升级", onPress: () => router.push('/profile/subscription' as any) }
                    ]
                );
                return;
            }
        }

        libraryStore.toggleSessionVisibility(id);
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
            <View className="flex-1 px-4 pt-4">
                <Stack.Screen options={{
                    headerTitle: '添加课程',
                    headerStyle: { backgroundColor: isDark ? '#000000' : '#ffffff' },
                    headerTintColor: isDark ? '#fff' : '#000',
                    headerBackTitle: "返回",
                    headerRight: () => null
                }} />

                {sessions.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-gray-500 text-lg">所有课程已添加</Text>
                    </View>
                ) : (
                    <FlatList
                        data={sessions}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <SessionItem
                                item={item}
                                onPress={() => { }} // 列表模式下暂时禁用点击详情
                                showAddButton={true}
                                onAdd={() => handleAdd(item.id)}
                            />
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
