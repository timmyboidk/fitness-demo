import { View, Text, TouchableOpacity } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AddItemScreen() {
    return (
        <View className="flex-1 bg-[#121212] p-6 justify-end pb-20">
            <Stack.Screen options={{ presentation: 'modal', headerShown: false }} />

            <Text className="text-white text-3xl font-black mb-8 text-center">创建新内容</Text>

            <View className="space-y-4">
                <Option title="创建新动作" subtitle="录制或上传单个动作" icon="body-outline" />
                <Option title="创建训练计划" subtitle="组合多个动作" icon="list-outline" />
                <Option title="发布动态" subtitle="分享你的训练成果" icon="camera-outline" />
            </View>

            <TouchableOpacity onPress={() => router.back()} className="mt-8 items-center">
                <View className="w-12 h-12 rounded-full bg-gray-800 items-center justify-center">
                    <Ionicons name="close" size={24} color="white" />
                </View>
            </TouchableOpacity>
        </View>
    );
}

function Option({ title, subtitle, icon }: any) {
    return (
        <TouchableOpacity className="bg-[#1E1E1E] p-6 rounded-2xl flex-row items-center border border-gray-800 active:bg-gray-800">
            <View className="w-12 h-12 bg-[#CCFF00]/20 rounded-full items-center justify-center mr-4">
                <Ionicons name={icon} size={24} color="#CCFF00" />
            </View>
            <View>
                <Text className="text-white font-bold text-lg">{title}</Text>
                <Text className="text-gray-400 text-sm">{subtitle}</Text>
            </View>
        </TouchableOpacity>
    );
}