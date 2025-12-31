import { View, Text, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function LoginScreen() {
    const insets = useSafeAreaInsets();
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (type: 'phone' | 'wechat') => {
        setLoading(true);

        // 模拟 API 请求逻辑
        setTimeout(async () => {
            let userData;
            if (type === 'wechat') {
                // 模拟微信用户数据
                userData = {
                    _id: 'wx_user_888',
                    nickname: '微信用户_Tim',
                    avatar: 'https://ui-avatars.com/api/?name=WeChat&background=07C160&color=fff',
                    vip: true
                };
                Alert.alert("微信授权成功", `欢迎回来，${userData.nickname}`);
            } else {
                if (phone.length !== 11 || code.length !== 4) {
                    setLoading(false);
                    return Alert.alert("提示", "请输入11位手机号和4位验证码");
                }
                // 模拟手机用户数据
                userData = {
                    _id: `ph_${phone}`,
                    nickname: `用户${phone.slice(-4)}`,
                    avatar: 'https://ui-avatars.com/api/?name=User&background=333&color=fff',
                    phone: phone
                };
            }

            try {
                await AsyncStorage.setItem('user', JSON.stringify(userData));
                router.replace('/(tabs)');
            } catch (e) {
                Alert.alert("登录错误", "数据存储失败");
            } finally {
                setLoading(false);
            }
        }, 800);
    };

    return (
        <View className="flex-1 bg-[#121212]">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, paddingTop: insets.top + 20 }}>

                    {/* 顶部返回 */}
                    <TouchableOpacity onPress={() => router.back()} className="mb-8">
                        <Ionicons name="close" size={28} color="white" />
                    </TouchableOpacity>

                    {/* 标题区 */}
                    <View className="mb-10">
                        <Text className="text-white text-4xl font-black mb-2 italic">FITBODY</Text>
                        <Text className="text-gray-400 text-lg">欢迎回来，请登录您的账号</Text>
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
                            <TouchableOpacity className="h-14 w-32 bg-[#1E1E1E] rounded-xl items-center justify-center border border-gray-800 active:bg-gray-800">
                                <Text className="text-[#CCFF00] font-bold">获取验证码</Text>
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
                        <View className="h-[1px] bg-gray-800 flex-1" />
                        <Text className="mx-4 text-gray-500 text-xs">社交账号一键登录</Text>
                        <View className="h-[1px] bg-gray-800 flex-1" />
                    </View>

                    {/* 微信登录 */}
                    <TouchableOpacity
                        onPress={() => handleLogin('wechat')}
                        className="flex-row items-center justify-center bg-[#07C160] h-14 rounded-full mb-6"
                    >
                        <Ionicons name="logo-wechat" size={24} color="white" style={{ marginRight: 8 }} />
                        <Text className="text-white font-bold text-lg">微信登录</Text>
                    </TouchableOpacity>

                    <View className="flex-row justify-center mt-auto pb-8">
                        <Text className="text-gray-500">还没有账号？ </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                            <Text className="text-[#CCFF00] font-bold">立即注册</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}