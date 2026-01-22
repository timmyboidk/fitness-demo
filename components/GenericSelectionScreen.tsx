import { Stack } from 'expo-router';
import React from 'react';
import { FlatList, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface GenericSelectionScreenProps<T> {
    title: string;
    data: T[];
    renderItem: ({ item }: { item: T }) => React.ReactElement;
    numColumns?: number;
    emptyMessage: string;
}

export function GenericSelectionScreen<T extends { id: string }>({
    title,
    data,
    renderItem,
    numColumns = 1,
    emptyMessage,
}: GenericSelectionScreenProps<T>) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
            <View className="flex-1 px-4 pt-4">
                <Stack.Screen options={{
                    headerTitle: title,
                    headerStyle: { backgroundColor: isDark ? '#000000' : '#ffffff' },
                    headerTintColor: isDark ? '#fff' : '#000',
                    headerBackTitle: "返回",
                }} />

                {data.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-gray-500 text-lg">{emptyMessage}</Text>
                    </View>
                ) : (
                    <FlatList
                        data={data}
                        numColumns={numColumns}
                        keyExtractor={item => item.id}
                        columnWrapperStyle={numColumns > 1 ? { justifyContent: 'space-between' } : undefined}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        renderItem={renderItem}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
