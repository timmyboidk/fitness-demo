import { View, Text, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SocialScreen() {
    return (
        <SafeAreaView className="flex-1 bg-[#121212] p-4" edges={['top']}>
            <Stack.Screen options={{ title: "社交账号绑定", headerStyle: { backgroundColor: '#121212' }, headerTintColor: '#fff' }} />
            <SocialItem icon="logo-wechat" name="微信" status="已连接" color="#07C160" />
            <SocialItem icon="logo-apple" name="Apple ID" status="未连接" color="#fff" />
            <SocialItem icon="logo-instagram" name="Instagram" status="未连接" color="#E1306C" />
        </SafeAreaView>
    );
}

function SocialItem({ icon, name, status, color }: any) {
    return (
        <TouchableOpacity className="flex-row items-center justify-between bg-[#1E1E1E] p-5 rounded-2xl mb-4">
            <View className="flex-row items-center">
                <Ionicons name={icon} size={28} color={color} style={{ marginRight: 16 }} />
                <Text className="text-white font-bold text-lg">{name}</Text>
            </View>
            <Text className={status === '已连接' ? 'text-[#07C160]' : 'text-gray-500'}>{status}</Text>
        </TouchableOpacity>
    );
}