import { View, Text, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur'; // 需要安装

// 背景图
const BG_IMAGE = { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop' };

export default function LoginScreen() {
    return (
        <ImageBackground source={BG_IMAGE} className="flex-1" resizeMode="cover">
            <View className="flex-1 bg-black/50"> {/* 整体压暗 */}
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>

                    {/* 顶部返回 */}
                    <TouchableOpacity onPress={() => router.back()} className="absolute top-14 left-6 z-10">
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </TouchableOpacity>

                    {/* 主要内容区域 - 毛玻璃卡片 */}
                    <BlurView intensity={30} tint="dark" className="rounded-t-[40px] overflow-hidden">
                        <View className="bg-black/40 p-8 pt-10">
                            <Text className="text-white text-4xl font-black mb-2">Welcome Back</Text>
                            <Text className="text-gray-300 text-lg mb-8">Please log in to continue</Text>

                            <View className="space-y-4">
                                <Input placeholder="Email address" icon="mail-outline" />
                                <Input placeholder="Password" secureTextEntry icon="lock-closed-outline" />
                            </View>

                            <TouchableOpacity className="items-end mt-3 mb-8">
                                <Text className="text-gray-400">Forgot password?</Text>
                            </TouchableOpacity>

                            <Button label="Log In" onPress={() => router.replace('/(tabs)')} className="mb-8" />

                            {/* 社交登录 */}
                            <View className="flex-row items-center mb-6">
                                <View className="flex-1 h-[1px] bg-gray-700" />
                                <Text className="mx-4 text-gray-400">or continue with</Text>
                                <View className="flex-1 h-[1px] bg-gray-700" />
                            </View>

                            <View className="flex-row justify-center space-x-4 mb-6">
                                <SocialButton icon="logo-google" />
                                <SocialButton icon="logo-apple" />
                                <SocialButton icon="logo-facebook" />
                            </View>

                            <View className="flex-row justify-center mb-8">
                                <Text className="text-gray-400">Don&#39;t have an account? </Text>
                                <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                                    <Text className="text-neon font-bold">Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </BlurView>
                </ScrollView>
            </View>
        </ImageBackground>
    );
}

// 简单的辅助组件
function SocialButton({ icon }: { icon: any }) {
    return (
        <TouchableOpacity className="w-16 h-16 bg-white/10 rounded-full items-center justify-center border border-white/20">
            <Ionicons name={icon} size={28} color="white" />
        </TouchableOpacity>
    );
}