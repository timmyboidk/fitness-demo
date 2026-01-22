/**
 * @file MovesScreen.tsx
 * @description 动作库主页 (Tab页)。
 * 展示所有可见的训练动作，允许用户浏览和管理动作列表。
 * 集成了全局状态管理，实时响应数据变化。
 */

import { router } from 'expo-router';
import { useEffect, useState } from 'react';
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
            renderItem={({ item }) => (
                <MoveItem
                    item={item}
                    showRemoveButton={true}
                    onRemove={() => libraryStore.toggleMoveVisibility(item.id)}
                />
            )}
        />
    );
}