import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { libraryStore } from '../../store/library';

export default function WorkoutSession() {
    const { id, mode } = useLocalSearchParams();
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<'front' | 'back'>('front');

    //  获取安全区域距离 (刘海屏/Home条高度)
    const insets = useSafeAreaInsets();

    // 快捷设置状态
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({ sound: true, mirror: true, aiGuide: true });

    // Session Execution Logic
    const [sequence, setSequence] = useState<any[]>([]);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [isSessionComplete, setIsSessionComplete] = useState(false);

    useEffect(() => {
        if (mode === 'session') {
            const moves = libraryStore.getSessionMoves(id as string);
            setSequence(moves);
        } else {
            // Single move mode
            // For now, we mock a single sequence item if we can find it, or just rely on generic logic.
            // But since getSessionMoves returns Move[], let's stick to that pattern.
            // Ideally we'd fetch the single move.
            const move = libraryStore.getMoves().find(m => m.id === id);
            if (move) setSequence([move]);
        }
    }, [id, mode]);

    const handleNext = () => {
        if (currentMoveIndex < sequence.length - 1) {
            setCurrentMoveIndex(prev => prev + 1);
        } else {
            setIsSessionComplete(true);
            // Optionally auto-exit or show summary
            router.back();
        }
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
            <CameraView style={{ flex: 1 }} facing={facing} mirror={settings.mirror}>

                {/*
                   - 改用 View + style padding
                   - insets.top 避开刘海
                   - +10 增加额外呼吸空间
                */}
                <View
                    className="absolute top-0 w-full flex-row justify-between items-center px-4 z-50"
                    style={{ paddingTop: insets.top + 10 }}
                >
                    <View className="bg-black/60 px-3 py-1 rounded-lg border border-[#CCFF00]/30">
                        <Text className="text-[#CCFF00] font-bold text-xs">AI 实时监控中</Text>
                    </View>

                    {/* Progress Indicator for Session */}
                    {mode === 'session' && (
                        <View className="bg-black/60 px-3 py-1 rounded-lg border border-white/20">
                            <Text className="text-white font-bold text-xs">{progressText}</Text>
                        </View>
                    )}

                    {/* 4. 退出按钮修复:
                       - 增加 hitSlop 扩大点击范围 (上下左右各扩大 20px)
                       - 确保手指粗也能点中
                    */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="bg-black/50 w-10 h-10 rounded-full items-center justify-center border border-white/10"
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    >
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Info Overlay: Current Move */}
                <View className="absolute top-20 w-full items-center z-40" style={{ marginTop: insets.top + 20 }}>
                    <Text className="text-white font-black text-3xl shadow-black shadow-lg">
                        {currentMove?.name || 'Loading...'}
                    </Text>
                    <Text className="text-[#CCFF00] font-bold text-lg shadow-black shadow-lg">
                        {currentMove?.level}
                    </Text>
                </View>

                {/* 中间引导区 */}
                {settings.aiGuide && (
                    <View className="absolute top-0 left-0 w-full h-full justify-center items-center pointer-events-none z-0">
                        {/* Viewfinder Frame */}
                        <View className="w-3/4 h-[60%] relative opacity-80">
                            {/* TL */}
                            <View className="absolute top-0 left-0 w-10 h-10 border-t-[6px] border-l-[6px] border-white rounded-tl-3xl shadow-sm" />
                            {/* TR */}
                            <View className="absolute top-0 right-0 w-10 h-10 border-t-[6px] border-r-[6px] border-white rounded-tr-3xl shadow-sm" />
                            {/* BL */}
                            <View className="absolute bottom-0 left-0 w-10 h-10 border-b-[6px] border-l-[6px] border-white rounded-bl-3xl shadow-sm" />
                            {/* BR */}
                            <View className="absolute bottom-0 right-0 w-10 h-10 border-b-[6px] border-r-[6px] border-white rounded-br-3xl shadow-sm" />
                        </View>

                        <Text className="text-white font-bold mt-8 bg-black/40 px-6 py-3 rounded-full overflow-hidden text-base tracking-widest">
                            请将身体对准框线
                        </Text>
                    </View>
                )}

                {/* 5. 底部控制栏修复:
                   - 使用 insets.bottom 避开 Home 条
                   - 增加 paddingBottom 提升视觉舒适度
                */}
                <View
                    className="absolute bottom-0 w-full px-6"
                    style={{ paddingBottom: insets.bottom + 20 }}
                >
                    {/* 数据统计行 */}
                    <View className="bg-black/80 rounded-3xl p-5 flex-row justify-between items-center mb-6 backdrop-blur-md border border-gray-800">
                        <StatItem label="次数" value="0" />
                        <StatItem label="标准度" value="--%" color="#CCFF00" />
                        <StatItem label="耗时" value="00:00" />
                    </View>

                    {/* 按钮行 */}
                    <View className="flex-row justify-around items-center">
                        <ControlButton icon="camera-reverse-outline" onPress={() => setFacing(c => c === 'back' ? 'front' : 'back')} />

                        {/* 暂停/开始/Next 按钮 */}
                        {/* If session, show Next logic */}
                        <TouchableOpacity
                            onPress={handleNext}
                            className="w-20 h-20 bg-[#CCFF00] rounded-full items-center justify-center shadow-lg shadow-[#CCFF00]/40"
                        >
                            {/* Make it look like "Next" if not last move? Or just keep Play/Pause logic? 
                                Requirement: "implicit call a series of moves".
                                Let's simulate 'finishing' a move to go to next. 
                                For this demo, let's use a "Forward" icon to signify 'Next Move' 
                            */}
                            <Ionicons name={currentMoveIndex < sequence.length - 1 ? "play-skip-forward" : "checkmark"} size={36} color="black" />
                        </TouchableOpacity>

                        {/* 齿轮设置按钮 */}
                        <ControlButton icon="settings-outline" onPress={() => setShowSettings(true)} />
                    </View>
                </View>
            </CameraView>

            {/* 快捷设置图层 (Layer) */}
            <Modal animationType="slide" transparent={true} visible={showSettings} onRequestClose={() => setShowSettings(false)}>
                <TouchableOpacity className="flex-1 bg-black/60" activeOpacity={1} onPress={() => setShowSettings(false)}>
                    <View className="absolute bottom-0 w-full bg-[#1E1E1E] rounded-t-[30px] p-6 pb-10" onStartShouldSetResponder={() => true}>
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-white text-xl font-bold">训练设置</Text>
                            <TouchableOpacity onPress={() => setShowSettings(false)} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
                                <Ionicons name="close-circle" size={28} color="#666" />
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