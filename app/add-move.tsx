/**
 * @file add-move.tsx
 * @description 添加动作页面。
 * 列出 Global Store 中所有尚未“可见”的动作，供用户选择添加到个人库。
 * 类似于动作商店或资源中心。
 */

import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { FlatList, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MoveItem } from '../components/MoveItem';
import { useFeatureLimit } from '../hooks/useFeatureLimit';
import { libraryStore, Move } from '../store/library';

export default function AddMoveScreen() {
    // 状态初始化：仅获取当前不可见的动作 (isVisible: false)
    const [moves, setMoves] = useState<Move[]>(libraryStore.getMoves().filter(m => !m.isVisible));
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { checkLimit } = useFeatureLimit();

    /**
     * 处理添加动作
     * @param id - 动作 ID
     */

    // 限制逻辑
    const handleAdd = async (id: string) => {
        const myMovesCount = libraryStore.getMoves().filter(m => m.isVisible).length;
        const allowed = await checkLimit('move', myMovesCount);

        if (!allowed) return;

        // 更新 Store 状态，将动作设为可见
        libraryStore.toggleMoveVisibility(id);
        // 返回上一页
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
            <View className="flex-1 px-4 pt-4">
                <Stack.Screen options={{
                    headerTitle: '添加动作',
                    headerStyle: { backgroundColor: isDark ? '#000000' : '#ffffff' },
                    headerTintColor: isDark ? '#fff' : '#000',
                    headerBackTitle: "返回",
                    headerRight: () => null // 不显示额外的按钮
                }} />

                {moves.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-gray-500 text-lg">所有动作已添加</Text>
                    </View>
                ) : (
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={moves}
                            numColumns={2}
                            keyExtractor={item => item.id}
                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            renderItem={({ item }) => (
                                <MoveItem
                                    item={item}
                                    showAddButton={true}
                                    // 点击加号时触发
                                    onAdd={() => handleAdd(item.id)}
                                />
                            )}
                        />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}
