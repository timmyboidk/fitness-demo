import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MoveItem } from '../components/MoveItem';
import { libraryStore, Move } from '../store/library';

export default function AddMoveScreen() {
    // Only show items that are NOT visible
    const [moves, setMoves] = useState<Move[]>(libraryStore.getMoves().filter(m => !m.isVisible));

    const handleAdd = (id: string) => {
        libraryStore.toggleMoveVisibility(id);
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
            <View className="flex-1 px-4 pt-4">
                <Stack.Screen options={{
                    headerTitle: '添加动作',
                    headerStyle: { backgroundColor: '#121212' },
                    headerTintColor: '#fff',
                    headerBackTitle: "返回",
                    headerRight: () => null // Ensure no + button here
                }} />

                {moves.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-gray-500 text-lg">所有动作已添加</Text>
                    </View>
                ) : (
                    <FlatList
                        data={moves}
                        numColumns={2}
                        keyExtractor={item => item.id}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        renderItem={({ item }) => (
                            <MoveItem
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
