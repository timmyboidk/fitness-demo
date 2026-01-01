import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
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
        <View className="flex-1 bg-[#121212] px-4 pt-4">
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
                            // Disable navigation on press in add mode, or keep it to preview? 
                            // Requirements say "place in add interface", implies act of adding.
                            // I'll make the whole card trigger add? Or better, use specific button.
                            // The component has showAddButton prop.
                            onPress={() => { }}
                            showAddButton={true}
                            onAdd={() => handleAdd(item.id)}
                        />
                    )}
                />
            )}
        </View>
    );
}
