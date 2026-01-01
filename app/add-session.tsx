import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SessionItem } from '../components/SessionItem';
import { libraryStore, Session } from '../store/library';

export default function AddSessionScreen() {
    // Only show items that are NOT visible
    const [sessions, setSessions] = useState<Session[]>(libraryStore.getSessions().filter(s => !s.isVisible));

    const handleAdd = (id: string) => {
        libraryStore.toggleSessionVisibility(id);
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
            <View className="flex-1 px-4 pt-4">
                <Stack.Screen options={{
                    headerTitle: '添加课程',
                    headerStyle: { backgroundColor: '#121212' },
                    headerTintColor: '#fff',
                    headerBackTitle: "返回",
                    headerRight: () => null
                }} />

                {sessions.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-gray-500 text-lg">所有课程已添加</Text>
                    </View>
                ) : (
                    <FlatList
                        data={sessions}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <SessionItem
                                item={item}
                                onPress={() => { }}
                                showAddButton={true}
                                onAdd={() => handleAdd(item.id)}
                            />
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
