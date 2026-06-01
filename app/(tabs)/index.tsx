/**
 * @file MovesScreen.tsx
 * @description 动作库主标签屏幕。
 * 展示所有可见的训练动作，带有错开入场动画。
 * 集成全局状态管理以实现实时数据更新。
 */

import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MoveItem } from '../../components/MoveItem';
import { ResourceListScreen } from '../../components/ResourceListScreen';
import { libraryStore, Move } from '../../store/library';

export default function MovesScreen() {
    const [moves, setMoves] = useState<Move[]>([]);

    useEffect(() => {
        setMoves(libraryStore.getMoves().filter(m => m.isVisible));

        const unsubscribe = libraryStore.subscribe(() => {
            setMoves(libraryStore.getMoves().filter(m => m.isVisible));
        });

        return unsubscribe;
    }, []);

    return (
        <ResourceListScreen
            testID="moves-list"
            title="训练动作"
            data={moves}
            numColumns={2}
            onAddPress={() => router.push('/add-move')}
            renderItem={({ item, index }) => (
                <Animated.View
                    entering={FadeInDown.delay((index ?? 0) * 80).duration(400).springify()}
                    style={{ width: '100%' }}
                >
                    <MoveItem
                        item={item}
                        showRemoveButton={true}
                        onRemove={() => libraryStore.toggleMoveVisibility(item.id)}
                    />
                </Animated.View>
            )}
        />
    );
}