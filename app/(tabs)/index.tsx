/**
 * @file MovesScreen.tsx
 * @description 动作库主页 (Tab页)。
 * 展示所有可见的训练动作，允许用户浏览和管理动作列表。
 * 集成了全局状态管理，实时响应数据变化。
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, TouchableOpacity, useColorScheme, View } from 'react-native';
import { LargeTitle } from '../../components/LargeTitle';
import { MoveItem } from '../../components/MoveItem';
import { StickyHeader } from '../../components/StickyHeader';
import { libraryStore, Move } from '../../store/library';

/**
 * 动作库展示屏幕组件
 */
export default function MovesScreen() {
    // 本地状态用于驱动UI更新
    const [moves, setMoves] = useState<Move[]>([]);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const iconColor = isDark ? '#CCFF00' : '#16a34a'; // 高亮色

    // 动画值：滚动偏移量
    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // 初始化加载: 获取动作列表并过滤掉隐藏项
        setMoves(libraryStore.getMoves().filter(m => m.isVisible));

        // 订阅Store变更: 当底层数据变化时(如添加/删除/更新)，自动刷新列表
        const unsubscribe = libraryStore.subscribe(() => {
            setMoves(libraryStore.getMoves().filter(m => m.isVisible));
        });

        // 组件卸载时清理订阅，防止内存泄漏
        return unsubscribe;
    }, []);

    const RightAddButton = (
        <TouchableOpacity onPress={() => router.push('/add-move')}>
            <Ionicons name="add-circle" size={28} color={iconColor} />
        </TouchableOpacity>
    );

    const LargeRightAddButton = (
        <TouchableOpacity onPress={() => router.push('/add-move')} className="mb-1">
            <Ionicons name="add-circle" size={36} color={iconColor} />
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <StickyHeader
                scrollY={scrollY}
                title="训练动作"
                rightElement={RightAddButton}
            />

            <Animated.FlatList
                testID="moves-list"
                data={moves}
                numColumns={2}
                keyExtractor={item => item.id}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                // Note: paddingTop is moved to contentContainerStyle to ensure header doesn't overlap excessively 
                // but StickyHeader is absolute.
                contentContainerStyle={{ paddingTop: 60, paddingBottom: 100, paddingHorizontal: 16 }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                // Large Title Header Component
                ListHeaderComponent={() => (
                    <LargeTitle
                        title="训练动作"
                        rightElement={LargeRightAddButton}
                    />
                )}
                renderItem={({ item }) => (
                    <MoveItem
                        item={item}
                        showRemoveButton={true}
                        // 点击移除按钮时，通过Store切换可见性（软删除）
                        onRemove={() => libraryStore.toggleMoveVisibility(item.id)}
                    />
                )}
            />
        </View>
    );
}