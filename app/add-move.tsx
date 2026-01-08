import { FlashList } from '@shopify/flash-list';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MoveItem } from '../components/MoveItem';
import { libraryStore, Move } from '../store/library';

export default function AddMoveScreen() {
    // Only show items that are NOT visible
    const [moves, setMoves] = useState<Move[]>(libraryStore.getMoves().filter(m => !m.isVisible));
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const handleAdd = (id: string) => {
        libraryStore.toggleMoveVisibility(id);
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
            <View className="flex-1 px-4 pt-4">
                <Stack.Screen options={{
                    headerTitle: '添加动作',
                    headerStyle: { backgroundColor: isDark ? '#000000' : '#ffffff' },
                    headerTintColor: isDark ? '#fff' : '#000',
                    headerBackTitle: "返回",
                    headerRight: () => null // Ensure no + button here
                }} />

                {moves.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-gray-500 text-lg">所有动作已添加</Text>
                    </View>
                ) : (
                    <View style={{ flex: 1, minHeight: 2 }}>
                        <FlashList
                            data={moves}
                            numColumns={2}
                            keyExtractor={item => item.id}
                            estimatedItemSize={200}
                            renderItem={({ item }) => (
                                <View style={{ flex: 1, padding: 4 }}>
                                    <MoveItem
                                        item={item}
                                        onPress={() => { }}
                                        showAddButton={true}
                                        onAdd={() => handleAdd(item.id)}
                                    />
                                </View>
                            )}
                        />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}
