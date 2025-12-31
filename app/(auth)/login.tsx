import { View, Text, TouchableOpacity, TextInput, ImageBackground, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BG_IMAGE = { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop' };

export default function LoginScreen() {
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');

    const handleLogin = async (type: 'phone' | 'wechat') => {
        if (type === 'phone' && (phone.length !== 11 || code.length !== 4)) {
            return Alert.alert("提示", "请输入正确的手机号和4位验证码");
        }

        try {
            // 调用我们在 app/api/auth+api.ts 中写的接口
            const res = await fetch('http://localhost:8081/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: type === 'phone' ? 'login_phone' : 'login_wechat',
                    payload: { phone, code }
                })
            });

            const data = await res.json();

            if (data.success) {
                // 持久化存储用户信息
                await AsyncStorage.setItem('user', JSON.stringify(data.user));
                router.replace('/(tabs)');
            } else {
                Alert.alert("登录失败", "请稍后重试");
            }
        } catch (e) {
            Alert.alert("网络错误", "无法连接到服务器");
        }
    };

    return (
        <ImageBackground source={BG_IMAGE} className="flex-1" resizeMode="cover">
            <View className="flex-1 bg-black/70 justify-center p-8">
                <View className="items-center mb-16">
                    <Text className="text-[#CCFF00] text-5xl font-black italic tracking-widest">FITBODY</Text>
                    <Text className="text-gray-300 text-lg mt-2">专业 AI 健身助手</Text>
                </View>

                {/* 手机号登录区域 */}
                <View className="space-y-4 w-full mb-10">
                    <View className="bg-[#1E1E1E] h-14 rounded-2xl flex-row items-center px-4 border border-gray-700">
                        <Text className="text-white font-bold text-lg border-r border-gray-600 pr-3 mr-3">+86</Text>
                        <TextInput
                            placeholder="请输入手机号码"
                            placeholderTextColor="#666"
                            className="flex-1 text-white text-lg font-bold"
                            keyboardType="number-pad"
                            value={phone}
                            onChangeText={setPhone}
                        />
                    </View>
                    <View className="flex-row gap-3">
                        <View className="flex-1 bg-[#1E1E1E] h-14 rounded-2xl justify-center px-4 border border-gray-700">
                            <TextInput
                                placeholder="验证码"
                                placeholderTextColor="#666"
                                className="text-white text-lg font-bold"
                                keyboardType="number-pad"
                                value={code}
                                onChangeText={setCode}
                            />
                        </View>
                        <TouchableOpacity className="w-32 bg-[#333] rounded-2xl items-center justify-center border border-gray-600">
                            <Text className="text-[#CCFF00] font-bold">获取验证码</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => handleLogin('phone')} className="bg-[#CCFF00] h-14 rounded-full items-center justify-center mt-4 shadow-lg shadow-[#CCFF00]/20">
                        <Text className="text-black text-xl font-black">登 录</Text>
                    </TouchableOpacity>
                </View>

                {/* 微信登录 */}
                <View className="w-full items-center">
                    <View className="flex-row items-center w-full mb-8">
                        <View className="h-[1px] bg-gray-700 flex-1" />
                        <Text className="text-gray-500 mx-4 text-xs">其他方式登录</Text>
                        <View className="h-[1px] bg-gray-700 flex-1" />
                    </View>

                    <TouchableOpacity onPress={() => handleLogin('wechat')} className="flex-row items-center bg-[#07C160] px-8 py-3 rounded-full">
                        <Ionicons name="logo-wechat" size={28} color="white" style={{ marginRight: 8 }} />
                        <Text className="text-white font-bold text-lg">微信一键登录</Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-gray-600 text-[10px] text-center mt-12">
                    登录即代表同意《用户协议》与《隐私政策》
                </Text>
            </View>
        </ImageBackground>
    );
}