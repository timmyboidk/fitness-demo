import { View, Text, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { useSharedValue } from 'react-native-worklets-core';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

export default function WorkoutSession() {
    const { id } = useLocalSearchParams();
    const device = useCameraDevice('front');
    const [hasPermission, setHasPermission] = useState(false);

    // 1. ONNX 模型状态共享
    // const poseData = useSharedValue(null);

    useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission();
            setHasPermission(status === 'granted');
        })();
    }, []);

    // 2. 帧处理器 (Worklet) - 这里是未来放入 ONNX 逻辑的地方
    const frameProcessor = useFrameProcessor((frame) => {
        'worklet';
        // console.log("Frame processed:", frame.width, frame.height);
        // const result = OnnxModel.run(frame);
        // poseData.value = result;
    }, []);

    if (!hasPermission) return <View className="flex-1 bg-black justify-center items-center"><Text className="text-white">Requesting Permissions...</Text></View>;
    if (!device) return <View className="flex-1 bg-black justify-center items-center"><Text className="text-white">No Camera Device</Text></View>;

    return (
        <View className="flex-1 bg-black">
            <Camera
                style={{ flex: 1 }}
                device={device}
                isActive={true}
                frameProcessor={frameProcessor}
                pixelFormat="yuv" // ONNX 常用格式
            />

            {/* UI Overlay */}
            <View className="absolute top-0 left-0 w-full h-full safe-area p-6 flex justify-between">
                {/* Header */}
                <View className="flex-row justify-between mt-4">
                    <View className="bg-black/60 px-3 py-1 rounded-lg border border-neon/30">
                        <Text className="text-neon font-bold">AI TRACKING: ACTIVE</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.back()} className="bg-black/50 p-2 rounded-full">
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Center Guide (Placeholder for 3D Model) */}
                <View className="items-center opacity-50">
                    {/*  */}
                    <Ionicons name="body-outline" size={300} color="white" />
                </View>

                {/* Bottom Stats */}
                <View className="bg-black/70 rounded-3xl p-6 flex-row justify-between items-center">
                    <View>
                        <Text className="text-gray-400 text-xs">REPS</Text>
                        <Text className="text-white text-3xl font-black">0/12</Text>
                    </View>
                    <View>
                        <Text className="text-gray-400 text-xs">FORM</Text>
                        <Text className="text-neon text-3xl font-black">98%</Text>
                    </View>
                    <View>
                        <Text className="text-gray-400 text-xs">TIME</Text>
                        <Text className="text-white text-3xl font-black">00:45</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}