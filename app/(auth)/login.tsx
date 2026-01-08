import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authService } from '../../services/AuthService';

export default function LoginScreen() {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    // OTP Timer
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    useEffect(() => {
        let interval: any;
        if (isTimerRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsTimerRunning(false);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timer]);

    const handleSendCode = async () => {
        if (!/^1[3-9]\d{9}$/.test(phone)) {
            return Alert.alert("错误", "请输入正确的11位手机号码");
        }

        setIsTimerRunning(true);
        setTimer(60);

        try {
            const res = await authService.requestOTP(phone);
            if (res.success) {
                Alert.alert("提示", "验证码已发送 (默认1234)");
            } else {
                Alert.alert("错误", res.message || "由于网络原因发送失败");
                setIsTimerRunning(false);
                setTimer(0);
            }
        } catch (e) {
            Alert.alert("错误", "发送失败，请稍后重试");
            setIsTimerRunning(false);
            setTimer(0);
        }
    };

    const handleLogin = async (type: 'phone' | 'wechat') => {
        setLoading(true);

        try {
            let result;

            if (type === 'wechat') {
                // Simulate WeChat SDK Login Code
                const mockCode = "wx_code_" + Math.random().toString(36).substring(7);
                result = await authService.loginWithWeChat(mockCode);
            } else {
                if (!phone || !code) {
                    setLoading(false);
                    return Alert.alert("提示", "请输入手机号和验证码");
                }
                result = await authService.verifyOTP(phone, code);
            }

            if (result.success && result.user) {
                await AsyncStorage.setItem('user', JSON.stringify(result.user));
                Alert.alert(
                    "登录成功",
                    `欢迎回来，${result.user.nickname}`,
                    [{ text: "OK", onPress: () => router.replace('/(tabs)') }]
                );
            } else {
                Alert.alert("登录失败", result.message || "请检查您的输入或网络连接");
            }
        } catch (e) {
            Alert.alert("系统错误", "请稍后重试");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white dark:bg-[#121212]">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, paddingTop: insets.top + 20 }}>

                    {/* 顶部返回 */}
                    <TouchableOpacity onPress={() => router.back()} className="mb-8">
                        <Ionicons name="close" size={28} color={isDark ? "white" : "black"} />
                    </TouchableOpacity>

                    {/* 标题区 */}
                    <View className="mb-10">
                        <Text className="text-black dark:text-white text-4xl font-black mb-2 italic">FITBODY</Text>
                        <Text className="text-gray-500 dark:text-gray-400 text-lg">欢迎回来，请登录您的账号</Text>
                    </View>

                    {/* 表单区 */}
                    <View className="space-y-4">
                        <Input
                            placeholder="手机号码"
                            keyboardType="number-pad"
                            value={phone}
                            onChangeText={setPhone}
                            maxLength={11}
                            icon="call-outline"
                        />

                        <View className="flex-row gap-3">
                            <View className="flex-1">
                                <Input
                                    placeholder="验证码"
                                    keyboardType="number-pad"
                                    value={code}
                                    onChangeText={setCode}
                                    maxLength={4}
                                    icon="key-outline"
                                />
                            </View>
                            <TouchableOpacity
                                onPress={handleSendCode}
                                disabled={isTimerRunning}
                                className={`h-14 w-32 rounded-xl items-center justify-center border border-gray-300 dark:border-gray-800 ${isTimerRunning ? 'bg-gray-200 dark:bg-gray-800' : 'bg-gray-100 dark:bg-[#1E1E1E] active:bg-gray-200 dark:active:bg-gray-800'}`}
                            >
                                <Text className={isTimerRunning ? "text-gray-500 font-bold" : "text-[#0a7ea4] dark:text-[#CCFF00] font-bold"}>
                                    {isTimerRunning ? `${timer}s` : "获取验证码"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Button
                            label={loading ? "登录中..." : "登 录"}
                            onPress={() => handleLogin('phone')}
                            className="mt-4"
                            disabled={loading}
                        />
                    </View>

                    {/* 分割线 */}
                    <View className="flex-row items-center my-10">
                        <View className="h-[1px] bg-gray-300 dark:bg-gray-800 flex-1" />
                        <Text className="mx-4 text-gray-500 text-xs">社交账号一键登录</Text>
                        <View className="h-[1px] bg-gray-300 dark:bg-gray-800 flex-1" />
                    </View>

                    {/* 微信登录 */}
                    <TouchableOpacity
                        onPress={() => handleLogin('wechat')}
                        disabled={loading}
                        className="flex-row items-center justify-center bg-[#07C160] h-14 rounded-full mb-6"
                    >
                        <Ionicons name="logo-wechat" size={24} color="white" style={{ marginRight: 8 }} />
                        <Text className="text-white font-bold text-lg">微信登录</Text>
                    </TouchableOpacity>

                    <View className="flex-row justify-center mt-auto pb-8">
                        <Text className="text-gray-500">还没有账号？ </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                            <Text className="text-[#0a7ea4] dark:text-[#CCFF00] font-bold">立即注册</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}