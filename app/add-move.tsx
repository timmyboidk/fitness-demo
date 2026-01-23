/**
 * @file add-move.tsx
 * @description 添加动作页面。
 * 列出 Global Store 中所有尚未“可见”的动作，供用户选择添加到个人库。
 * 类似于动作商店或资源中心。
 */

import { router } from 'expo-router';
import { useState } from 'react';
import { GenericSelectionScreen } from '../components/GenericSelectionScreen';
import { MoveItem } from '../components/MoveItem';
import { useFeatureLimit } from '../hooks/useFeatureLimit';
import { libraryStore, Move } from '../store/library';

export default function AddMoveScreen() {
    const [moves] = useState<Move[]>(libraryStore.getMoves().filter(m => !m.isVisible));
    const { checkLimit } = useFeatureLimit();

    const handleAdd = async (id: string) => {
        const myMovesCount = libraryStore.getMoves().filter(m => m.isVisible).length;
        const allowed = await checkLimit('move', myMovesCount);
        if (!allowed) return;

        libraryStore.toggleMoveVisibility(id);
        router.back();
    };

    return (
        <GenericSelectionScreen
            title="添加动作"
            data={moves}
            numColumns={2}
            emptyMessage="所有动作已添加"
            renderItem={({ item }) => (
                <MoveItem
                    item={item}
                    showAddButton={true}
                    onAdd={() => handleAdd(item.id)}
                />
            )}
        />
    );
}
