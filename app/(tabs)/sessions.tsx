/**
 * @file sessions.tsx
 * @description 课程计划列表页 (Tab)。
 * 展示所有预置的或用户添加的训练计划 (Sessions)。
 * 类似于动作库主页，该页面也集成全局 Store 进行状态管理。
 */

import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { SessionItem } from '../../components/SessionItem';
import { libraryStore, Session } from '../../store/library';

/**
 * 训练课程列表屏幕
 */
export default function SessionsScreen() {
    // 课程列表状态
    const [sessions, setSessions] = useState<Session[]>([]);

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

    return (
        <View className="flex-1 bg-white dark:bg-black px-4 pt-4">
            <FlatList
                data={sessions}
                keyExtractor={item => item.id}
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