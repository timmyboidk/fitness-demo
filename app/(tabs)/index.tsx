import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import { Button } from '../../components/ui/Button';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';

// 模拟 MongoDB API 调用 (在 Step 2 中定义的 /api/moves)
const fetchMoves = async () => {
    try {
        // 真实开发中: const res = await fetch('/api/moves'); return res.json();
        // 这里为了演示直接返回数据
        return [
            { id: '1', name: 'Push Up', level: 'Beginner', image: 'https://via.placeholder.com/150' },
            { id: '2', name: 'Squat', level: 'Intermediate', image: 'https://via.placeholder.com/150' },
            { id: '3', name: 'Lunges', level: 'Beginner', image: 'https://via.placeholder.com/150' },
            { id: '4', name: 'Plank', level: 'All Levels', image: 'https://via.placeholder.com/150' },
        ];
    } catch (e) {
        return [];
    }
};

export default function MovesScreen() {
    const [moves, setMoves] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMoves().then(data => {
            setMoves(data);
            setLoading(false);
        });
    }, []);

    return (
        <View className="flex-1 bg-matte pt-16 px-4">
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-white text-4xl font-black">MOVES</Text>
                {/* 对应 Filter Button */}
                <Button label="Filter" variant="outline" size="sm" />
            </View>

            {loading ? (
                <ActivityIndicator color="#CCFF00" />
            ) : (
                <FlatList
                    data={moves}
                    numColumns={2}
                    keyExtractor={item => item.id}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    renderItem={({ item }) => (
                        <View className="w-[48%] bg-surface rounded-2xl mb-4 overflow-hidden border border-gray-800">
                            <View className="h-32 bg-gray-700 items-center justify-center">
                                {/*  */}
                                <Text className="text-gray-500">IMG</Text>
                            </View>
                            <View className="p-3">
                                <Text className="text-white font-bold text-lg">{item.name}</Text>
                                <Text className="text-neon text-xs uppercase mb-3">{item.level}</Text>
                                <Button
                                    label="Train"
                                    size="sm"
                                    className="h-8"
                                    onPress={() => router.push(`/workout/${item.id}`)}
                                />
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}