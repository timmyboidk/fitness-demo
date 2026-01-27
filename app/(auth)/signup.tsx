/**
 * @file signup.tsx
 * @description 用户注册页面。
 * 引导新用户输入昵称、手机号和验证码以创建账户。
 * 注册成功后自动持久化用户信息并跳转至难度评估页。
 */

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useOTP } from '../../hooks/useOTP';
import { authService } from '../../services/AuthService';

/**
 * 注册屏幕组件
 */
export default function SignupScreen() {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // 表单状态
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(false);

    // 使用自定义 Hook 处理验证码逻辑
    const { timer, isTimerRunning, sendCode } = useOTP();

    /**
     * 处理注册逻辑
     */
    const handleSignup = async () => {
        // 1. 基础校验
        if (phone.length !== 11 || code.length !== 4) {
            return Alert.alert("提示", "请输入有效的手机号和验证码");
        }
        if (nickname.length < 2) {
            return Alert.alert("提示", "请设置一个昵称");
        }

        setLoading(true);
        try {
            // 2. 调用验证接口 (此处复用 verifyOTP，实际注册应有单独接口)
            // 假设验证通过即视为注册成功并返回新用户数据
            const result = await authService.verifyOTP(phone, code);

            if (result.success && result.user) {
                // 3. 持久化存储用户凭证
                await AsyncStorage.setItem('user', JSON.stringify(result.user));
                await AsyncStorage.setItem('user_token', result.user.token);
                await AsyncStorage.setItem('user_id', result.user.id);

                // 4. 跳转至入职流程 (引导页)
                router.replace({
                    pathname: '/onboarding/difficulty',
                    params: { userId: result.user.id }
                });
            } else {
                Alert.alert("错误", result.message || "注册失败");
            }
        } catch (e) {
            Alert.alert("错误", "连接服务器失败");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, paddingTop: insets.top + 20 }}>

                    {/* 顶部导航 */}
                    <View className="flex-row items-center mb-10">
                        <TouchableOpacity onPress={() => router.back()} className="mr-4">
                            <Ionicons name="arrow-back" size={28} color={isDark ? "white" : "black"} />
                        </TouchableOpacity>
                        <Text className="text-black dark:text-white text-xl font-bold">创建新账号</Text>
                    </View>

                    {/* 标题 */}
                    <View className="mb-10">
                        <Text className="text-black dark:text-white text-3xl font-black mb-2">加入 FITBODY</Text>
                        <Text className="text-gray-500 dark:text-gray-400">完善资料，开启你的 AI 健身之旅</Text>
                    </View>

                    {/* 表单区域 */}
                    <View className="space-y-4">
                        <Input
                            placeholder="设置昵称"
                            value={nickname}
                            onChangeText={setNickname}
                            testID="nickname-input"
                            icon="person-outline"
                        />

                        <Input
                            placeholder="手机号码"
                            keyboardType="number-pad"
                            value={phone}
                            onChangeText={setPhone}
                            maxLength={11}
                            testID="phone-input"
                            icon="phone-portrait-outline"
                        />

                        <View className="flex-row gap-3">
                            <View className="flex-1">
                                <Input
                                    placeholder="验证码"
                                    keyboardType="number-pad"
                                    value={code}
                                    onChangeText={setCode}
                                    maxLength={4}
                                    testID="code-input"
                                    icon="shield-checkmark-outline"
                                />
                            </View>
                            <TouchableOpacity
                                onPress={() => sendCode(phone)}
                                disabled={isTimerRunning}
                                className={`h-14 w-32 rounded-xl items-center justify-center border border-gray-300 dark:border-gray-800 ${isTimerRunning ? 'bg-gray-200 dark:bg-gray-800' : 'bg-gray-100 dark:bg-[#1E1E1E] active:bg-gray-200 dark:active:bg-gray-800'}`}
                            >
                                <Text className={isTimerRunning ? "text-gray-500 font-bold" : "text-[#16a34a] dark:text-[#CCFF00] font-bold"}>
                                    {isTimerRunning ? `${timer}s` : "发送"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Button
                            label={loading ? "注册中..." : "立即注册"}
                            testID="signup-button"
                            onPress={handleSignup}
                            className="mt-6"
                            disabled={loading}
                        />
                    </View>

                    <View className="flex-row justify-center mt-auto pb-8">
                        <Text className="text-gray-500">已有账号？ </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                            <Text className="text-[#16a34a] dark:text-[#CCFF00] font-bold">去登录</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}