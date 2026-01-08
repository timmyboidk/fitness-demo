import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function SignupScreen() {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (phone.length !== 11 || code.length !== 4) {
            return Alert.alert("提示", "请输入有效的手机号和验证码");
        }
        if (nickname.length < 2) {
            return Alert.alert("提示", "请设置一个昵称");
        }

        setLoading(true);
        // 模拟注册 API
        setTimeout(async () => {
            const userData = {
                _id: `ph_${phone}`,
                nickname: nickname,
                avatar: `https://ui-avatars.com/api/?name=${nickname}&background=CCFF00&color=000`,
                phone: phone,
                vip: false
            };

            try {
                await AsyncStorage.setItem('user', JSON.stringify(userData));
                Alert.alert("注册成功", "欢迎加入 FITBODY！", [
                    { text: "开始训练", onPress: () => router.replace('/(tabs)') }
                ]);
            } catch (e) {
                Alert.alert("错误", "注册失败");
            } finally {
                setLoading(false);
            }
        }, 800);
    };

    return (
        <View className="flex-1 bg-white dark:bg-[#121212]">
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

                    {/* 表单 */}
                    <View className="space-y-4">
                        <Input
                            placeholder="设置昵称"
                            value={nickname}
                            onChangeText={setNickname}
                            icon="person-outline"
                        />

                        <Input
                            placeholder="手机号码"
                            keyboardType="number-pad"
                            value={phone}
                            onChangeText={setPhone}
                            maxLength={11}
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
                                    icon="shield-checkmark-outline"
                                />
                            </View>
                            <TouchableOpacity className="h-14 w-32 bg-gray-100 dark:bg-[#1E1E1E] rounded-xl items-center justify-center border border-gray-300 dark:border-gray-800 active:bg-gray-200 dark:active:bg-gray-800">
                                <Text className="text-[#0a7ea4] dark:text-[#CCFF00] font-bold">发送</Text>
                            </TouchableOpacity>
                        </View>

                        <Button
                            label={loading ? "注册中..." : "立即注册"}
                            onPress={handleSignup}
                            className="mt-6"
                            disabled={loading}
                        />
                    </View>

                    <View className="flex-row justify-center mt-auto pb-8">
                        <Text className="text-gray-500">已有账号？ </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                            <Text className="text-[#0a7ea4] dark:text-[#CCFF00] font-bold">去登录</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}