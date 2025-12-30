import { View, Text, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';

const BG_IMAGE = { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop' };

export default function LoginScreen() {
    return (
        <ImageBackground source={BG_IMAGE} className="flex-1" resizeMode="cover">
            <View className="flex-1 bg-black/60 justify-center p-6">

                {/* Logo区 */}
                <View className="items-center mb-12">
                    <Text className="text-[#CCFF00] text-5xl font-black tracking-widest italic">FITBODY</Text>
                    <Text className="text-gray-300 text-lg">智能 AI 健身助手</Text>
                </View>

                {/* 手机号登录表单 */}
                <View className="space-y-4 mb-8">
                    <View className="flex-row items-center bg-[#1E1E1E] h-14 px-4 rounded-xl border border-gray-700">
                        <Text className="text-gray-400 text-lg mr-3 font-bold">+86</Text>
                        <View className="h-6 w-[1px] bg-gray-700 mr-3" />
                        <TextInput
                            placeholder="请输入手机号码"
                            placeholderTextColor="#666"
                            keyboardType="number-pad"
                            className="flex-1 text-white text-lg font-bold"
                        />
                    </View>

                    <View className="flex-row gap-3">
                        <View className="flex-1 bg-[#1E1E1E] h-14 px-4 rounded-xl border border-gray-700 justify-center">
                            <TextInput
                                placeholder="验证码"
                                placeholderTextColor="#666"
                                keyboardType="number-pad"
                                className="text-white text-lg font-bold"
                            />
                        </View>
                        <TouchableOpacity className="w-32 bg-[#333] h-14 rounded-xl items-center justify-center border border-gray-700">
                            <Text className="text-[#CCFF00] font-bold">获取验证码</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Button label="登录 / 注册" onPress={() => router.replace('/(tabs)')} className="mb-10" />

                {/* 微信登录 */}
                <View className="items-center">
                    <View className="flex-row items-center mb-6 w-full">
                        <View className="flex-1 h-[1px] bg-gray-700" />
                        <Text className="mx-4 text-gray-400">其他登录方式</Text>
                        <View className="flex-1 h-[1px] bg-gray-700" />
                    </View>

                    <TouchableOpacity
                        onPress={() => router.replace('/(tabs)')}
                        className="flex-row items-center bg-[#07C160] px-8 py-3 rounded-full"
                    >
                        <Ionicons name="logo-wechat" size={24} color="white" style={{ marginRight: 8 }} />
                        <Text className="text-white font-bold text-lg">微信一键登录</Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-gray-600 text-xs text-center mt-10">
                    登录即代表同意《用户协议》与《隐私政策》
                </Text>

            </View>
        </ImageBackground>
    );
}