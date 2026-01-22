/**
 * @file sessions.tsx
 * @description 课程计划列表页 (Tab)。
 * 展示所有预置的或用户添加的训练计划 (Sessions)。
 * 类似于动作库主页，该页面也集成全局 Store 进行状态管理。
 */

import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ResourceListScreen } from '../../components/ResourceListScreen';
import { SessionItem } from '../../components/SessionItem';
import { libraryStore, Session } from '../../store/library';

export default function SessionsScreen() {
    const [sessions, setSessions] = useState<Session[]>([]);

    useEffect(() => {
        setSessions(libraryStore.getSessions().filter(s => s.isVisible));

        const unsubscribe = libraryStore.subscribe(() => {
            setSessions(libraryStore.getSessions().filter(s => s.isVisible));
        });

        return unsubscribe;
    }, []);

    return (
        <ResourceListScreen
            title="课程计划"
            data={sessions}
            onAddPress={() => router.push('/add-session')}
            renderItem={({ item }) => (
                <SessionItem
                    item={item}
                    showRemoveButton={true}
                    onRemove={() => libraryStore.toggleSessionVisibility(item.id)}
                />
            )}
        />
    );
}