/**
 * @file MovesScreen.tsx
 * @description 动作库主页 (Tab页)。
 * 展示所有可见的训练动作，允许用户浏览和管理动作列表。
 * 集成了全局状态管理，实时响应数据变化。
 */

import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { MoveItem } from '../../components/MoveItem';
import { libraryStore, Move } from '../../store/library';

/**
 * 动作库展示屏幕组件
 */
export default function MovesScreen() {
    // 本地状态用于驱动UI更新
    const [moves, setMoves] = useState<Move[]>([]);

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

    return (
        <View className="flex-1 bg-white dark:bg-black px-4 pt-4">
            <FlatList
                testID="moves-list"
                data={moves}
                numColumns={2}
                keyExtractor={item => item.id}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
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