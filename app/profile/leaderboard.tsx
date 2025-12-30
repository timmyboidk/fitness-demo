import { View, Text, FlatList, Image } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const RANKINGS = [
    { id: '1', name: 'Alex Johnson', score: '12,400', rank: 1, avatar: 'https://i.pravatar.cc/100?img=1' },
    { id: '2', name: 'Sarah Lee', score: '11,250', rank: 2, avatar: 'https://i.pravatar.cc/100?img=5' },
    { id: '3', name: 'Mike Chen', score: '10,800', rank: 3, avatar: 'https://i.pravatar.cc/100?img=3' },
    { id: '4', name: 'You', score: '8,500', rank: 12, avatar: 'https://i.pravatar.cc/100?img=8' },
];

export default function LeaderboardScreen() {
    return (
        <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
            <Stack.Screen options={{
                title: "好友排行榜",
                headerStyle: { backgroundColor: '#121212' },
                headerTintColor: '#fff'
            }} />

            <View className="p-4 bg-[#1E1E1E] mb-2 flex-row justify-between items-center">
                <Text className="text-[#CCFF00] font-bold text-lg">本周排名</Text>
                <Text className="text-gray-400">距离上一名还差 200 分</Text>
            </View>

            <FlatList
                data={RANKINGS}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View className={`flex-row items-center p-4 mx-4 mb-3 rounded-2xl ${item.name === 'You' ? 'bg-[#CCFF00]/10 border border-[#CCFF00]' : 'bg-[#1E1E1E]'}`}>
                        <Text className={`text-xl font-black w-8 ${item.rank <= 3 ? 'text-[#CCFF00]' : 'text-gray-500'}`}>
                            #{item.rank}
                        </Text>
                        <Image source={{ uri: item.avatar }} className="w-10 h-10 rounded-full mx-3" />
                        <Text className="text-white font-bold flex-1">{item.name}</Text>
                        <Text className="text-[#CCFF00] font-black">{item.score}</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}