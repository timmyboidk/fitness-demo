import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
    return (
        <View className="flex-1 bg-matte pt-20 px-6">
            <View className="flex-row items-center mb-10">
                <View className="w-20 h-20 bg-gray-700 rounded-full mr-4 border-2 border-neon" />
                <View>
                    <Text className="text-white text-2xl font-bold">User Name</Text>
                    <Text className="text-gray-400">Fitness Enthusiast</Text>
                </View>
            </View>

            <View className="flex-row justify-between mb-8">
                <View className="bg-surface p-4 rounded-xl flex-1 mr-2 items-center">
                    <Text className="text-neon text-2xl font-bold">12</Text>
                    <Text className="text-gray-500 text-xs">WORKOUTS</Text>
                </View>
                <View className="bg-surface p-4 rounded-xl flex-1 ml-2 items-center">
                    <Text className="text-neon text-2xl font-bold">85%</Text>
                    <Text className="text-gray-500 text-xs">FORM SCORE</Text>
                </View>
            </View>
        </View>
    );
}