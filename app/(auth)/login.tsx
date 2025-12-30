import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
    return (
        <View className="flex-1 bg-matte justify-center items-center p-6">
            <View className="w-32 h-32 bg-surface rounded-full items-center justify-center mb-10 border-2 border-neon">
                <Ionicons name="fitness" size={60} color="#CCFF00" />
            </View>

            <Text className="text-white text-3xl font-bold mb-2">FITNESS AI</Text>
            <Text className="text-gray-400 mb-12">智能私教 • 姿态矫正</Text>

            {/* 模拟微信登录 */}
            <TouchableOpacity
                onPress={() => router.replace('/(tabs)')}
                className="w-full bg-[#07C160] p-4 rounded-xl flex-row justify-center items-center mb-4"
            >
                <Ionicons name="chatbubble-ellipses" size={24} color="white" style={{ marginRight: 10 }} />
                <Text className="text-white font-bold text-lg">WeChat Login</Text>
            </TouchableOpacity>

            <TouchableOpacity className="mt-4">
                <Text className="text-gray-500">手机号码登录</Text>
            </TouchableOpacity>
        </View>
    );
}