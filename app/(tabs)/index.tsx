import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { MoveItem } from '../../components/MoveItem';
import { libraryStore, Move } from '../../store/library';

export default function MovesScreen() {
    const [moves, setMoves] = useState<Move[]>([]);

    useEffect(() => {
        // Initial load
        setMoves(libraryStore.getMoves().filter(m => m.isVisible));

        // Subscribe to changes
        const unsubscribe = libraryStore.subscribe(() => {
            setMoves(libraryStore.getMoves().filter(m => m.isVisible));
        });

        return unsubscribe;
    }, []);

    return (
        <View className="flex-1 bg-white dark:bg-black px-4 pt-4">
            <FlatList
                testID="moves-list"
                data={moves}
                numColumns={2}
                keyExtractor={item => item.id}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                renderItem={({ item }) => (
                    <MoveItem
                        item={item}
                        showRemoveButton={true}
                        onRemove={() => libraryStore.toggleMoveVisibility(item.id)}
                    />
                )}
            />
        </View>
    );
}