/**
 * @file difficulty.tsx
 * @description 难度选择/入职流程页面。
 * 在用户首次使用或注册时，引导选择适合的训练难度。
 * 包含难度选项的展示（图标、描述）和后端偏好设置同步。
 */

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/AuthService';

// 难度等级配置数据
const LEVELS = [
    {
        id: 'novice',
        title: '入门 (Novice)',
        desc: '从未尝试过健身或长时间未运动',
        icon: 'fitness-outline',
        color: '#34d399'
    },
    {
        id: 'skilled',
        title: '进阶 (Skilled)',
        desc: '有一定基础，每周坚持 2-3 次运动',
        icon: 'barbell-outline',
        color: '#fbbf24'
    },
    {
        id: 'expert',
        title: '高手 (Expert)',
        desc: '资深健身爱好者，追求极致挑战',
        icon: 'trophy-outline',
        color: '#f87171'
    }
];

/**
 * 难度选择屏幕组件
 */
export default function DifficultyScreen() {
    // 获取路由参数中的用户ID（如果有）
    const { userId } = useLocalSearchParams<{ userId: string }>();
    const [selectedLevel, setSelectedLevel] = useState('novice');
    const [loading, setLoading] = useState(false);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    /**
     * 处理完成/保存逻辑
     * 1. 获取当前用户ID (路由参数或本地存储)
     * 2. 调用API保存难度设置
     * 3. 更新本地用户信息并跳转首页
     */
    const handleFinish = async () => {
        let finalUserId = userId;

        if (!finalUserId) {
            try {
                const AsyncStorage = require('@react-native-async-storage/async-storage').default;
                const userStr = await AsyncStorage.getItem('user');
                if (userStr) {
                    finalUserId = JSON.parse(userStr).id;
                }
            } catch (e) {
                console.error(e);
            }
        }

        if (!finalUserId) {
            return Alert.alert("错误", "无法识别用户信息，请重新登录");
        }

        setLoading(true);
        try {
            const res = await authService.onboarding(finalUserId, selectedLevel);
            if (res.success) {
                // 更新本地用户数据的 difficultyLevel 字段
                const AsyncStorage = require('@react-native-async-storage/async-storage').default;
                const userStr = await AsyncStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    user.difficultyLevel = selectedLevel;
                    await AsyncStorage.setItem('user', JSON.stringify(user));
                }

                Alert.alert("设置成功", "你的训练计划已更新！", [
                    { text: "开始健身", onPress: () => router.replace('/(tabs)') }
                ]);
            } else {
                Alert.alert("同步失败", res.error || "请稍后在设置中重新尝试");
            }
        } catch (e) {
            console.error(e);
            Alert.alert("网络异常", "请检查网络连接");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <ScrollView contentContainerStyle={{ padding: 24 }}>
                <View className="mb-10 mt-6">
                    <Text className="text-black dark:text-white text-3xl font-black mb-3">你的健身基础是？</Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-lg">AI 将根据你的选择推荐最合适的课程</Text>
                </View>

                {/* 难度选项列表 */}
                <View className="space-y-4">
                    {LEVELS.map((level) => (
                        <TouchableOpacity
                            key={level.id}
                            onPress={() => setSelectedLevel(level.id)}
                            testID={`level-${level.id}`}
                            className={`p-6 rounded-3xl border-2 transition-all flex-row items-center ${selectedLevel === level.id
                                ? 'border-[#CCFF00] bg-[#CCFF00]/5'
                                : 'border-gray-100 dark:border-gray-800'
                                }`}
                        >
                            <View
                                className="w-14 h-14 rounded-2xl items-center justify-center mr-5"
                                style={{ backgroundColor: level.color + '20' }}
                            >
                                <Ionicons name={level.icon as any} size={28} color={level.color} />
                            </View>

                            <View className="flex-1">
                                <Text className="text-black dark:text-white text-xl font-bold mb-1">{level.title}</Text>
                                <Text className="text-gray-500 dark:text-gray-400 text-sm">{level.desc}</Text>
                            </View>

                            {/* 选中状态打钩 */}
                            {selectedLevel === level.id && (
                                <Ionicons name="checkmark-circle" size={24} color="#CCFF00" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <Button
                    label={loading ? "正在保存..." : "完成设置"}
                    testID="finish-button"
                    onPress={handleFinish}
                    className="mt-12"
                    disabled={loading}
                />
            </ScrollView>
        </SafeAreaView>
    );
}
