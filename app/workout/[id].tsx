import { View, Text, TouchableOpacity, Modal, Switch } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WorkoutSession() {
    const { id, mode } = useLocalSearchParams(); // mode: 'move' or 'session'
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<'front' | 'back'>('front');

    // 快捷设置状态
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({ sound: true, mirror: true, aiGuide: true });

    if (!permission) return <View className="flex-1 bg-black" />;
    if (!permission.granted) {
        return (
            <View className="flex-1 bg-black justify-center items-center p-6">
                <Text className="text-white text-center mb-4 text-lg">我们需要相机权限来分析您的动作标准度</Text>
                <Button label="授权访问" onPress={requestPermission} />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-black">
            <CameraView style={{ flex: 1 }} facing={facing} mirror={settings.mirror}>

                {/* 顶部 HUD */}
                <SafeAreaView className="absolute top-0 w-full flex-row justify-between items-center p-4 z-10">
                    <View className="bg-black/60 px-3 py-1 rounded-lg border border-[#CCFF00]/30">
                        <Text className="text-[#CCFF00] font-bold text-xs">AI 实时监控中</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.back()} className="bg-black/50 p-2 rounded-full">
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                </SafeAreaView>

                {/* 中间引导区 */}
                <View className="absolute top-1/3 w-full items-center opacity-70 pointer-events-none">
                    <Ionicons name="body-outline" size={200} color="white" />
                    <Text className="text-white font-bold mt-4 bg-black/40 px-4 py-2 rounded-full">
                        请将身体对准框线
                    </Text>
                </View>

                {/* 底部控制栏 */}
                <SafeAreaView className="absolute bottom-0 w-full p-6" edges={['bottom']}>
                    {/* 数据统计行 */}
                    <View className="bg-black/80 rounded-3xl p-5 flex-row justify-between items-center mb-6 backdrop-blur-md border border-gray-800">
                        <StatItem label="次数" value="0" />
                        <StatItem label="标准度" value="--%" color="#CCFF00" />
                        <StatItem label="耗时" value="00:00" />
                    </View>

                    {/* 按钮行 */}
                    <View className="flex-row justify-around items-center">
                        <ControlButton icon="camera-reverse-outline" onPress={() => setFacing(c => c === 'back' ? 'front' : 'back')} />

                        {/* 暂停/开始大按钮 */}
                        <TouchableOpacity className="w-20 h-20 bg-[#CCFF00] rounded-full items-center justify-center shadow-lg shadow-[#CCFF00]/40">
                            <Ionicons name="pause" size={36} color="black" />
                        </TouchableOpacity>

                        {/* 齿轮设置按钮：呼出新图层 */}
                        <ControlButton icon="settings-outline" onPress={() => setShowSettings(true)} />
                    </View>
                </SafeAreaView>
            </CameraView>

            {/* 快捷设置图层 (Layer) */}
            <Modal animationType="slide" transparent={true} visible={showSettings} onRequestClose={() => setShowSettings(false)}>
                <TouchableOpacity className="flex-1 bg-black/50" activeOpacity={1} onPress={() => setShowSettings(false)}>
                    <View className="absolute bottom-0 w-full bg-[#1E1E1E] rounded-t-[30px] p-6 pb-10" onStartShouldSetResponder={() => true}>
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-white text-xl font-bold">训练设置</Text>
                            <TouchableOpacity onPress={() => setShowSettings(false)}>
                                <Ionicons name="close-circle" size={28} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <SettingRow label="开启语音指导" value={settings.sound} onToggle={(v: any) => setSettings({...settings, sound: v})} />
                        <SettingRow label="前置摄像头镜像" value={settings.mirror} onToggle={(v: any) => setSettings({...settings, mirror: v})} />
                        <SettingRow label="显示 AI 骨架辅助" value={settings.aiGuide} onToggle={(v: any) => setSettings({...settings, aiGuide: v})} />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

// 辅助组件
const StatItem = ({ label, value, color = 'white' }: any) => (
    <View className="items-center">
        <Text className="text-gray-400 text-xs font-bold mb-1">{label}</Text>
        <Text className="text-2xl font-black" style={{ color }}>{value}</Text>
    </View>
);

const ControlButton = ({ icon, onPress }: any) => (
    <TouchableOpacity onPress={onPress} className="w-14 h-14 bg-gray-800/80 rounded-full items-center justify-center border border-gray-700">
        <Ionicons name={icon} size={24} color="white" />
    </TouchableOpacity>
);

const SettingRow = ({ label, value, onToggle }: any) => (
    <View className="flex-row justify-between items-center mb-6">
        <Text className="text-white text-lg font-medium">{label}</Text>
        <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: "#333", true: "#CCFF00" }}
            thumbColor={value ? "black" : "#f4f3f4"}
        />
    </View>
);

// 临时的 Button 组件，避免报错
const Button = ({ label, onPress }: any) => (
    <TouchableOpacity onPress={onPress} className="bg-[#CCFF00] px-6 py-3 rounded-full">
        <Text className="font-bold text-black">{label}</Text>
    </TouchableOpacity>
);