import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen() {
    return (
        <ScrollView className="flex-1 bg-matte" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <View className="p-8">
                <TouchableOpacity onPress={() => router.back()} className="mb-6">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                <Text className="text-white text-center text-3xl font-black mb-2">Create Account</Text>
                <Text className="text-gray-400 text-center mb-8">Let&#39;s Start!</Text>

                <Input placeholder="Full Name" />
                <Input placeholder="Email or Mobile Number" keyboardType="email-address" />
                <Input placeholder="Password" secureTextEntry />
                <Input placeholder="Confirm Password" secureTextEntry />

                <Text className="text-gray-500 text-xs text-center mb-6 px-4">
                    By continuing, you agree to Terms of Use and Privacy Policy.
                </Text>

                <Button label="Sign Up" onPress={() => router.replace('/(tabs)')} className="mb-6" />

                <View className="flex-row items-center mb-6">
                    <View className="flex-1 h-[1px] bg-gray-800" />
                    <Text className="mx-4 text-gray-500">or sign up with</Text>
                    <View className="flex-1 h-[1px] bg-gray-800" />
                </View>

                {/* Social Buttons Row */}
                <View className="flex-row justify-center space-x-6 mb-8">
                    <TouchableOpacity className="w-14 h-14 bg-surface rounded-full items-center justify-center border border-gray-700">
                        <Ionicons name="logo-google" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity className="w-14 h-14 bg-surface rounded-full items-center justify-center border border-gray-700">
                        <Ionicons name="logo-apple" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-center pb-8">
                    <Text className="text-gray-500">Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                        <Text className="text-neon font-bold">Log in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}