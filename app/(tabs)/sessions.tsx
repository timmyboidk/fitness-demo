import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SESSIONS = [
    { id: 's1', name: 'HIIT Cardio', time: '20 min', moves: 12 },
    { id: 's2', name: 'Leg Destruction', time: '45 min', moves: 8 },
    { id: 's3', name: 'Morning Yoga', time: '15 min', moves: 5 },
];

export default function SessionsScreen() {
    return (
        <View className="flex-1 bg-matte pt-16 px-4">
            <Text className="text-white text-4xl font-black mb-6 tracking-tighter">SESSIONS</Text>
            <FlatList
                data={SESSIONS}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => router.push(`/workout/${item.id}?mode=session`)}
                        className="w-full bg-surface mb-4 p-6 rounded-2xl flex-row justify-between items-center border-l-4 border-neon"
                    >
                        <View>
                            <Text className="text-white font-bold text-xl mb-1">{item.name}</Text>
                            <Text className="text-gray-400 text-sm">{item.time} • {item.moves} Moves</Text>
                        </View>
                        <Ionicons name="play-circle" size={48} color="#CCFF00" />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}