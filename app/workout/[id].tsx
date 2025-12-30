import { View, Text, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera'; // 使用新版 CameraView
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function WorkoutScreen() {
    const { mode } = useLocalSearchParams();
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<'front' | 'back'>('front');

    if (!permission) return <View />;
    if (!permission.granted) {
        return (
            <View className="flex-1 bg-matte justify-center items-center p-6">
                <Text className="text-white text-center mb-4">我们需要相机权限来纠正你的动作。</Text>
                <TouchableOpacity onPress={requestPermission} className="bg-neon px-6 py-3 rounded-full">
                    <Text className="font-bold text-black">授权相机</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-black">
            <CameraView style={{ flex: 1 }} facing={facing}>
                {/* HUD 界面层 */}
                <View className="flex-1 safe-area p-6 justify-between">

                    {/* 顶部栏 */}
                    <View className="flex-row justify-between items-start mt-10">
                        <View>
                            <Text className="text-neon text-4xl font-black italic">00:24</Text>
                            <Text className="text-white font-bold bg-black/50 px-2 rounded">
                                {mode === 'session' ? 'SESSION PROGRESS' : 'SINGLE MOVE'}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => router.back()} className="bg-black/40 p-2 rounded-full">
                            <Ionicons name="close" size={28} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* 3D 骨骼模拟层 (居中) */}
                    <View className="items-center opacity-60">
                        <Ionicons name="body" size={250} color={mode === 'session' ? '#CCFF00' : '#ffffff'} />
                        {/* 模拟 AI 反馈 */}
                        <View className="bg-alert/80 px-4 py-2 rounded mt-4">
                            <Text className="text-white font-bold">KNEES INWARD DETECTED</Text>
                        </View>
                    </View>

                    {/* 底部控制 */}
                    <View className="flex-row justify-around items-center bg-black/60 p-4 rounded-3xl mb-4">
                        <TouchableOpacity onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}>
                            <Ionicons name="camera-reverse-outline" size={32} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-neon w-16 h-16 rounded-full items-center justify-center">
                            <Ionicons name="pause" size={32} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="settings-outline" size={32} color="white" />
                        </TouchableOpacity>
                    </View>

                </View>
            </CameraView>
        </View>
    );
}