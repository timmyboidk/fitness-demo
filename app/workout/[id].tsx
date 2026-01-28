/**
 * @file WorkoutSession.tsx
 * @description 训练会话主页面。
 * 负责处理摄像头实时预览、AI姿态检测、动作评分以及训练流程控制。
 * 支持单个动作练习模式和完整课程训练模式。
 */

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, Switch, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PoseDetectorCamera } from '../../components/PoseDetectorCamera';
import { Button } from '../../components/ui/Button';
import { aiScoringService } from '../../services/AIScoringService';
import { Collector } from '../../services/analytics/DataCollector';
import { libraryStore } from '../../store/library';

/**
 * 训练会话组件
 * 核心功能：
 * 1. 管理摄像头权限和状态
 * 2. 协调AI评分服务
 * 3. 维护当前训练进度(动作序列)
 * 4. 展示实时反馈UI
 */
export default function WorkoutSession() {
    // 获取路由参数: id(动作或课程ID), mode(模式: 'session' | 'single')
    const { id, mode } = useLocalSearchParams();
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<'front' | 'back'>('front');

    // 性能优化：当屏幕失去焦点时暂停相机
    const isFocused = useIsFocused();

    //  获取安全区域距离 (刘海屏/Home条高度)
    const insets = useSafeAreaInsets();

    // ... rest of state ...
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({ sound: true, mirror: true, aiGuide: true });

    // 训练序列执行逻辑
    const [sequence, setSequence] = useState<any[]>([]);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [isSessionComplete, setIsSessionComplete] = useState(false);

    // 播放状态
    const [isPlaying, setIsPlaying] = useState(false);

    // AI评分状态管理
    const [lastScore, setLastScore] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<string[]>([]);
    const [latestKeypoints, setLatestKeypoints] = useState<any[]>([]);

    /**
     * 对当前动作进行评分
     * 收集当前帧的关键点数据，发送给后端AI服务进行评估
     */
    const scoreCurrentMove = async () => {
        if (!sequence[currentMoveIndex]) return;

        try {
            const userStr = await AsyncStorage.getItem('user');
            const userId = userStr ? JSON.parse(userStr).id : 'anonymous';

            const response = await aiScoringService.scoreMove({
                moveId: sequence[currentMoveIndex].id,
                data: {
                    keypoints: latestKeypoints.length > 0 ? latestKeypoints : [
                        { x: 0.5, y: 0.5, score: 0.9 } // Fallback mock
                    ],
                    userId: userId
                }
            });

            if (response.success) {
                setLastScore(response.score);
                setFeedback(response.feedback);

                // 采集数据用于分析
                Collector.track('score', {
                    moveId: sequence[currentMoveIndex].id,
                    score: response.score,
                    feedback: response.feedback
                });
            }
        } catch (error) {
            console.error("AI 评分失败:", error);
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
    /**
     * 处理播放/暂停按钮点击
     * 暂停时停止评分，播放时触发评分逻辑
     */
    const handlePlayPause = () => {
        const nextState = !isPlaying;
        setIsPlaying(nextState);
        if (nextState) {
            // 开始评分循环或触发单次评分
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
    const progressText = mode === 'session' ? `动作 ${currentMoveIndex + 1}/${sequence.length}` : '单项练习';

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
                    {/* 姿态检测相机组件: 负责实时捕捉并计算骨架关键点 */}
                    <PoseDetectorCamera
                        onInferenceResult={(res) => {
                            if (res && res.keypoints) {
                                setLatestKeypoints(res.keypoints);
                            }
                        }}
                        modelUrl="https://github.com/onnx/models/raw/main/vision/body_analysis/ultraface/models/version-RFB-320.onnx" // Mock URL
                        facing={facing}
                    />
                </View>
            )}

            {/* UI 覆盖层容器 - 安全区域 */}
            <View
                className="absolute top-0 left-0 w-full h-full flex justify-between"
                style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
                pointerEvents="box-none"
            >
                {/* 顶部区域: 头部 + 信息 */}
                <View className="z-50" pointerEvents="box-none">
                    {/* 状态栏 */}
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
                            testID="close-button"
                            className="bg-black/50 w-10 h-10 rounded-full items-center justify-center border border-white/10"
                            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        >
                            <Ionicons name="close" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* 动作信息 */}
                    <View className="items-center mt-6">
                        <Text className="text-white font-black text-3xl shadow-black shadow-lg">
                            {currentMove?.name || '加载中...'}
                        </Text>
                        <Text className="text-[#CCFF00] font-bold text-lg shadow-black shadow-lg">
                            {currentMove?.level}
                        </Text>
                    </View>
                </View>

                {/* 中间区域: 取景框引导 */}
                {/* Flex-1 确保它占用可用空间，但在空间紧张时不强制重叠 */}
                {settings.aiGuide && (
                    <View className="flex-1 justify-center items-center pointer-events-none z-0 px-8 py-4">
                        {/* 框架 */}
                        <View className="w-full aspect-[3/4] max-h-[70%] relative opacity-80 border-white/0">
                            {/* 左上 */}
                            <View className="absolute top-0 left-0 w-10 h-10 border-t-[6px] border-l-[6px] border-white rounded-tl-3xl shadow-sm" />
                            {/* 右上 */}
                            <View className="absolute top-0 right-0 w-10 h-10 border-t-[6px] border-r-[6px] border-white rounded-tr-3xl shadow-sm" />
                            {/* 左下 */}
                            <View className="absolute bottom-0 left-0 w-10 h-10 border-b-[6px] border-l-[6px] border-white rounded-bl-3xl shadow-sm" />
                            {/* 右下 */}
                            <View className="absolute bottom-0 right-0 w-10 h-10 border-b-[6px] border-r-[6px] border-white rounded-br-3xl shadow-sm" />
                        </View>

                        {/* 文字提示 - 相对于 flex 容器布局，确保其向下推或位于下方 */}
                        <Text className="text-white font-bold bg-black/40 px-6 py-3 rounded-full overflow-hidden text-base tracking-widest mt-6">
                            请将身体对准框线
                        </Text>
                    </View>
                )}

                {/* 底部区域: 控制按钮 */}
                <View className="w-full px-6 pb-4">
                    <View className="bg-black/80 rounded-3xl p-5 flex-row justify-between items-center mb-6 backdrop-blur-md border border-gray-800">
                        <StatItem label="次数" value="0" />
                        <StatItem label="标准度" value={lastScore ? `${lastScore}%` : "--%"} color="#CCFF00" />
                        <StatItem label="耗时" value="00:00" />
                    </View>

                    {feedback.length > 0 && (
                        <View className="bg-[#CCFF00] rounded-2xl p-4 mb-6">
                            <Text className="text-black font-bold text-base">
                                {feedback[0]}
                            </Text>
                        </View>
                    )}

                    <View className="flex-row justify-around items-center">
                        <ControlButton testID="camera-reverse-outline" icon="camera-reverse-outline" onPress={handleReverseCamera} />

                        {/* Play/Pause Button */}
                        <TouchableOpacity
                            onPress={handlePlayPause}
                            testID="play-pause-button"
                            className="w-20 h-20 bg-[#CCFF00] rounded-full items-center justify-center shadow-lg shadow-[#CCFF00]/40"
                        >
                            <Ionicons name={isPlaying ? "pause" : "play"} size={36} color="black" />
                        </TouchableOpacity>

                        <ControlButton testID="settings-button" icon="settings-outline" onPress={handleSettingsPress} />
                    </View>
                </View>
            </View>

            {/* 设置模态框 - 位于 UI 容器外部以覆盖所有内容 */}
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

const ControlButton = ({ icon, onPress, testID }: any) => (
    <TouchableOpacity testID={testID} onPress={onPress} className="w-14 h-14 bg-gray-800/80 rounded-full items-center justify-center border border-gray-700">
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
