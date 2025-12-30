import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const MOVES = [
  { id: 'm1', name: 'Push Up', level: 'Beginner' },
  { id: 'm2', name: 'Squat', level: 'Intermediate' },
  { id: 'm3', name: 'Lunges', level: 'Beginner' },
  { id: 'm4', name: 'Plank', level: 'All Levels' },
];

export default function MovesScreen() {
  return (
      <View className="flex-1 bg-matte pt-16 px-4">
        <Text className="text-white text-4xl font-black mb-6 tracking-tighter">MOVES</Text>
        <FlatList
            data={MOVES}
            numColumns={2}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => router.push(`/workout/${item.id}?mode=move`)}
                    className="flex-1 bg-surface m-2 p-4 rounded-2xl h-40 justify-between border border-gray-800"
                >
                  <View className="w-8 h-8 rounded-full bg-neon/20 items-center justify-center">
                    <Text className="text-neon font-bold">{item.name[0]}</Text>
                  </View>
                  <View>
                    <Text className="text-white font-bold text-lg">{item.name}</Text>
                    <Text className="text-gray-500 text-xs uppercase">{item.level}</Text>
                  </View>
                </TouchableOpacity>
            )}
        />
      </View>
  );
}