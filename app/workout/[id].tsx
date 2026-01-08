import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useCameraPermissions } from 'expo-camera'; // Keep valid permission hook or replace if totally removing expo-camera
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, Switch, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PoseDetectorCamera } from '../../components/PoseDetectorCamera';
import { Button } from '../../components/ui/Button';
import { aiScoringService } from '../../services/AIScoringService';
import { libraryStore } from '../../store/library';

export default function WorkoutSession() {
    const { id, mode } = useLocalSearchParams();
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<'front' | 'back'>('front');

    // Performance: Pause camera when screen is not focused
    const isFocused = useIsFocused();

    //  获取安全区域距离 (刘海屏/Home条高度)
    const insets = useSafeAreaInsets();

    // ... rest of state ...
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({ sound: true, mirror: true, aiGuide: true });

    // Session Execution Logic
    const [sequence, setSequence] = useState<any[]>([]);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [isSessionComplete, setIsSessionComplete] = useState(false);

    // Playback State
    const [isPlaying, setIsPlaying] = useState(false);

    // AI Scoring Hook (Mock integration)
    const scoreCurrentMove = async () => {
        if (!sequence[currentMoveIndex]) return;


        try {
            const response = await aiScoringService.scoreMove({
                moveId: sequence[currentMoveIndex].id,
                sessionId: mode === 'session' ? (id as string) : undefined,
                timestamp: Date.now(),
                data: {
                    frame: "mock_base64_frame_data"
                }
            });

            if (response.success) {

            }
        } catch (error) {
            console.error("AI Scoring failed", error);
        }
    };

    useEffect(() => {
        if (mode === 'session') {
            const moves = libraryStore.getSessionMoves(id as string);
            setSequence(moves);
        } else {
            const move = libraryStore.getMoves().find(m => m.id === id);
            if (move) setSequence([move]);
        }
    }, [id, mode]);

    // Hooks for buttons
    const handlePlayPause = () => {
        const nextState = !isPlaying;
        setIsPlaying(nextState);
        if (nextState) {
            // Start scoring loop or trigger single score
            scoreCurrentMove();
        }
    };



    const handleReverseCamera = () => {
        setFacing(c => c === 'back' ? 'front' : 'back');
    };

    const handleSettingsPress = () => {
        setShowSettings(true);
    };

    const currentMove = sequence[currentMoveIndex];
    const progressText = mode === 'session' ? `Move ${currentMoveIndex + 1}/${sequence.length}` : 'Single Move';

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
            {isFocused && (
                <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
                    <PoseDetectorCamera
                        onInferenceResult={(res) => console.log("Inference:", res)}
                        modelUrl="https://github.com/onnx/models/raw/main/vision/body_analysis/ultraface/models/version-RFB-320.onnx" // Mock URL
                        facing={facing}
                    />
                </View>
            )}

            {/* UI Overlay Container - Safe Area */}
            <View
                className="absolute top-0 left-0 w-full h-full flex justify-between"
                style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
                pointerEvents="box-none"
            >
                {/* Top Section: Header + Info */}
                <View className="z-50" pointerEvents="box-none">
                    {/* Header Bar */}
                    <View className="flex-row justify-between items-center px-4 pt-2">
                        <View className="bg-black/60 px-3 py-1 rounded-lg border border-[#CCFF00]/30">
                            <Text className="text-[#CCFF00] font-bold text-xs">AI 实时监控中</Text>
                        </View>

                        {mode === 'session' && (
                            <View className="bg-black/60 px-3 py-1 rounded-lg border border-white/20">
                                <Text className="text-white font-bold text-xs">{progressText}</Text>
                            </View>
                        )}

                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="bg-black/50 w-10 h-10 rounded-full items-center justify-center border border-white/10"
                            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        >
                            <Ionicons name="close" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Move Info */}
                    <View className="items-center mt-6">
                        <Text className="text-white font-black text-3xl shadow-black shadow-lg">
                            {currentMove?.name || 'Loading...'}
                        </Text>
                        <Text className="text-[#CCFF00] font-bold text-lg shadow-black shadow-lg">
                            {currentMove?.level}
                        </Text>
                    </View>
                </View>

                {/* Middle Section: Viewfinder Guide */}
                {/* Flex-1 ensures it takes available space but doesn't force overlap if space is tight */}
                {settings.aiGuide && (
                    <View className="flex-1 justify-center items-center pointer-events-none z-0 px-8 py-4">
                        {/* Frame */}
                        <View className="w-full aspect-[3/4] max-h-[70%] relative opacity-80 border-white/0">
                            {/* TL */}
                            <View className="absolute top-0 left-0 w-10 h-10 border-t-[6px] border-l-[6px] border-white rounded-tl-3xl shadow-sm" />
                            {/* TR */}
                            <View className="absolute top-0 right-0 w-10 h-10 border-t-[6px] border-r-[6px] border-white rounded-tr-3xl shadow-sm" />
                            {/* BL */}
                            <View className="absolute bottom-0 left-0 w-10 h-10 border-b-[6px] border-l-[6px] border-white rounded-bl-3xl shadow-sm" />
                            {/* BR */}
                            <View className="absolute bottom-0 right-0 w-10 h-10 border-b-[6px] border-r-[6px] border-white rounded-br-3xl shadow-sm" />
                        </View>

                        {/* Text Prompt - Positioned relative to the flex container, ensuring it pushes down or sits below */}
                        <Text className="text-white font-bold bg-black/40 px-6 py-3 rounded-full overflow-hidden text-base tracking-widest mt-6">
                            请将身体对准框线
                        </Text>
                    </View>
                )}

                {/* Bottom Section: Controls */}
                <View className="w-full px-6 pb-4">
                    <View className="bg-black/80 rounded-3xl p-5 flex-row justify-between items-center mb-6 backdrop-blur-md border border-gray-800">
                        <StatItem label="次数" value="0" />
                        <StatItem label="标准度" value="--%" color="#CCFF00" />
                        <StatItem label="耗时" value="00:00" />
                    </View>

                    <View className="flex-row justify-around items-center">
                        <ControlButton icon="camera-reverse-outline" onPress={handleReverseCamera} />

                        {/* Play/Pause Button */}
                        <TouchableOpacity
                            onPress={handlePlayPause}
                            className="w-20 h-20 bg-[#CCFF00] rounded-full items-center justify-center shadow-lg shadow-[#CCFF00]/40"
                        >
                            <Ionicons name={isPlaying ? "pause" : "play"} size={36} color="black" />
                        </TouchableOpacity>

                        <ControlButton icon="settings-outline" onPress={handleSettingsPress} />
                    </View>
                </View>
            </View>

            {/* Settings Modal - Outside UI container to overlay everything */}
            <Modal animationType="slide" transparent={true} visible={showSettings} onRequestClose={() => setShowSettings(false)}>
                <TouchableOpacity testID="modal-backdrop" className="flex-1 bg-black/60" activeOpacity={1} onPress={() => setShowSettings(false)}>
                    <View className="absolute bottom-0 w-full bg-white dark:bg-[#1C1C1E] rounded-t-[30px] p-6 pb-10" onStartShouldSetResponder={() => true}>
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-black dark:text-white text-xl font-bold">训练设置</Text>
                            <TouchableOpacity testID="close-modal-button" onPress={() => setShowSettings(false)} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
                                <Ionicons name="close-circle" size={28} color="#999" />
                            </TouchableOpacity>
                        </View>

                        <SettingRow label="开启语音指导" value={settings.sound} onToggle={(v: any) => setSettings({ ...settings, sound: v })} />
                        <SettingRow label="前置摄像头镜像" value={settings.mirror} onToggle={(v: any) => setSettings({ ...settings, mirror: v })} />
                        <SettingRow label="显示 AI 骨架辅助" value={settings.aiGuide} onToggle={(v: any) => setSettings({ ...settings, aiGuide: v })} />
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

const SettingRow = ({ label, value, onToggle }: any) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    return (
        <View className="flex-row justify-between items-center mb-6">
            <Text className="text-black dark:text-white text-lg font-medium">{label}</Text>
            <Switch
                testID={`switch-${label}`}
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: "#333", true: isDark ? "#CCFF00" : "#16a34a" }}
                thumbColor={value ? (isDark ? "black" : "white") : "#f4f3f4"}
            />
        </View>
    );
};
