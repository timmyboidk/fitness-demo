/**
 * @file add-session.tsx
 * @description 添加课程页面。
 * 列出 Global Store 中所有尚未“可见”的课程，供用户添加到个人计划中。
 */

import { router } from 'expo-router';
import { useState } from 'react';
import { GenericSelectionScreen } from '../components/GenericSelectionScreen';
import { SessionItem } from '../components/SessionItem';
import { useFeatureLimit } from '../hooks/useFeatureLimit';
import { libraryStore, Session } from '../store/library';

export default function AddSessionScreen() {
    const [sessions] = useState<Session[]>(libraryStore.getSessions().filter(s => !s.isVisible));
    const { checkLimit } = useFeatureLimit();

    const handleAdd = async (id: string) => {
        const mySessionsCount = libraryStore.getSessions().filter(s => s.isVisible).length;
        const allowed = await checkLimit('session', mySessionsCount);

        if (!allowed) return;

        libraryStore.toggleSessionVisibility(id);
        router.back();
    };

    return (
        <GenericSelectionScreen
            title="添加课程"
            data={sessions}
            emptyMessage="所有课程已添加"
            renderItem={({ item }) => (
                <SessionItem
                    item={item}
                    onPress={() => { }}
                    showAddButton={true}
                    onAdd={() => handleAdd(item.id)}
                />
            )}
        />
    );
}
