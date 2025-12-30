import { View, Text, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function WorkoutSession() {
    const { id } = useLocalSearchParams();
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<'front' | 'back'>('front');

    // 1. 处理权限状态
    if (!permission) {
        // 权限还在加载中
        return <View className="flex-1 bg-black" />;
    }

    if (!permission.granted) {
        // 权限被拒绝
        return (
            <View className="flex-1 bg-black justify-center items-center p-6">
                <Text className="text-white text-center mb-4 text-lg">We need camera access to track your workout form.</Text>
                <TouchableOpacity onPress={requestPermission} className="bg-[#CCFF00] px-6 py-3 rounded-full">
                    <Text className="font-bold text-black">Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // 2. 正常渲染相机
    return (
        <View className="flex-1 bg-black">
            {/* 使用 Expo 官方的 CameraView，支持直接在 Expo Go 中运行 */}
            <CameraView style={{ flex: 1 }} facing={facing}>

                {/* UI Overlay */}
                <View className="absolute top-0 left-0 w-full h-full safe-area p-6 flex justify-between">

                    {/* Header */}
                    <View className="flex-row justify-between mt-12 items-start">
                        <View className="bg-black/60 px-3 py-1 rounded-lg border border-[#CCFF00]/30">
                            <Text className="text-[#CCFF00] font-bold">LIVE TRACKING</Text>
                        </View>
                        <TouchableOpacity onPress={() => router.back()} className="bg-black/50 p-2 rounded-full">
                            <Ionicons name="close" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Center Visual (Placeholder for AI skeleton) */}
                    <View className="items-center opacity-60">
                        <Ionicons name="body-outline" size={300} color="white" />
                        <Text className="text-white font-bold mt-4 bg-black/40 px-4 py-2 rounded-full overflow-hidden">
                            Align your body
                        </Text>
                    </View>

                    {/* Bottom Controls & Stats */}
                    <View className="flex-col gap-4 mb-6">
                        {/* Stats Row */}
                        <View className="bg-black/70 rounded-3xl p-6 flex-row justify-between items-center backdrop-blur-md">
                            <View>
                                <Text className="text-gray-400 text-xs font-bold">REPS</Text>
                                <Text className="text-white text-3xl font-black">0</Text>
                            </View>
                            <View>
                                <Text className="text-gray-400 text-xs font-bold">ACCURACY</Text>
                                <Text className="text-[#CCFF00] text-3xl font-black">--%</Text>
                            </View>
                            <View>
                                <Text className="text-gray-400 text-xs font-bold">TIME</Text>
                                <Text className="text-white text-3xl font-black">00:00</Text>
                            </View>
                        </View>

                        {/* Control Buttons */}
                        <View className="flex-row justify-around items-center">
                            <TouchableOpacity
                                onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}
                                className="w-12 h-12 bg-gray-800 rounded-full items-center justify-center"
                            >
                                <Ionicons name="camera-reverse-outline" size={24} color="white" />
                            </TouchableOpacity>

                            <TouchableOpacity className="w-16 h-16 bg-[#CCFF00] rounded-full items-center justify-center shadow-lg shadow-[#CCFF00]/50">
                                <Ionicons name="pause" size={32} color="black" />
                            </TouchableOpacity>

                            <TouchableOpacity className="w-12 h-12 bg-gray-800 rounded-full items-center justify-center">
                                <Ionicons name="settings-outline" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </CameraView>
        </View>
    );
}