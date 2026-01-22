import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { Animated, TouchableOpacity, View, useColorScheme } from 'react-native';
import { LargeTitle } from './LargeTitle';
import { StickyHeader } from './StickyHeader';

interface ResourceListScreenProps<T> {
    title: string;
    data: T[];
    renderItem: ({ item }: { item: T }) => React.ReactElement;
    onAddPress: () => void;
    numColumns?: number;
    testID?: string;
}

export function ResourceListScreen<T extends { id: string }>({
    title,
    data,
    renderItem,
    onAddPress,
    numColumns = 1,
    testID,
}: ResourceListScreenProps<T>) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const iconColor = isDark ? '#CCFF00' : '#16a34a';

    const scrollY = useRef(new Animated.Value(0)).current;

    const RightAddButton = (
        <TouchableOpacity onPress={onAddPress}>
            <Ionicons name="add-circle" size={28} color={iconColor} />
        </TouchableOpacity>
    );

    const LargeRightAddButton = (
        <TouchableOpacity onPress={onAddPress} className="mb-1">
            <Ionicons name="add-circle" size={36} color={iconColor} />
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <StickyHeader
                scrollY={scrollY}
                title={title}
                rightElement={RightAddButton}
            />

            <Animated.FlatList
                testID={testID}
                data={data as any}
                numColumns={numColumns}
                keyExtractor={item => item.id}
                columnWrapperStyle={numColumns > 1 ? { justifyContent: 'space-between' } : undefined}
                contentContainerStyle={{ paddingTop: 60, paddingBottom: 100, paddingHorizontal: 16 }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                ListHeaderComponent={() => (
                    <LargeTitle
                        title={title}
                        rightElement={LargeRightAddButton}
                    />
                )}
                renderItem={renderItem}
            />
        </View>
    );
}
