import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { SessionItem } from '../../components/SessionItem';
import { libraryStore, Session } from '../../store/library';

export default function SessionsScreen() {
    const [sessions, setSessions] = useState<Session[]>([]);

    useEffect(() => {
        // Initial load
        setSessions(libraryStore.getSessions().filter(s => s.isVisible));

        // Subscribe to changes
        const unsubscribe = libraryStore.subscribe(() => {
            setSessions(libraryStore.getSessions().filter(s => s.isVisible));
        });

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
                        onRemove={() => libraryStore.toggleSessionVisibility(item.id)}
                    />
                )}
            />
        </View>
    );
}