import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const [notifications, setNotifications] = useState(true);
    const [sound, setSound] = useState(true);

    return (

        <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* 统一的带返回键 Header */}
            <View className="flex-row items-center px-4 py-4">
                <TouchableOpacity onPress={() => {
                    console.log("Hook: Settings Back Pressed");
                    router.back();
                }} className="mr-4 w-10 h-10 items-center justify-center bg-[#1E1E1E] rounded-full">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold">设置</Text>
            </View>

            <ScrollView className="p-4">
                <View className="bg-[#1E1E1E] rounded-2xl overflow-hidden mb-6">
                    <SettingItem
                        icon="notifications-outline"
                        label="推送通知"
                        value={notifications}
                        onValueChange={(v: boolean) => {
                            console.log("Hook: Setting Toggle - Notifications:", v);
                            setNotifications(v);
                        }}
                        isSwitch
                    />
                    <View className="h-[1px] bg-gray-800 mx-4" />
                    <SettingItem
                        icon="volume-high-outline"
                        label="语音指导"
                        value={sound}
                        onValueChange={(v: boolean) => {
                            console.log("Hook: Setting Toggle - Sound:", v);
                            setSound(v);
                        }}
                        isSwitch
                    />
                </View>

                <View className="bg-[#1E1E1E] rounded-2xl overflow-hidden mb-6">
                    <SettingItem icon="language-outline" label="语言" value="简体中文" onPress={() => console.log("Hook: Setting Item Pressed - Language")} />
                    <View className="h-[1px] bg-gray-800 mx-4" />
                    <SettingItem icon="moon-outline" label="深色模式" value="已开启" onPress={() => console.log("Hook: Setting Item Pressed - Dark Mode")} />
                </View>

                <TouchableOpacity
                    onPress={() => console.log("Hook: Logout Pressed")}
                    className="bg-[#1E1E1E] rounded-2xl p-4 flex-row items-center justify-center mt-4"
                >
                    <Text className="text-red-500 font-bold text-lg">退出登录</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

function SettingItem({ icon, label, value, onValueChange, isSwitch, onPress }: any) {
    const Content = (
        <View className="flex-row items-center justify-between p-4 bg-[#1E1E1E]">
            <View className="flex-row items-center">
                <Ionicons name={icon} size={22} color="#999" style={{ marginRight: 12 }} />
                <Text className="text-white text-base font-bold">{label}</Text>
            </View>
            {isSwitch ? (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: "#333", true: "#CCFF00" }}
                    thumbColor={value ? "#000" : "#f4f3f4"}
                />
            ) : (
                <View className="flex-row items-center">
                    <Text className="text-gray-500 mr-2">{value}</Text>
                    <Ionicons name="chevron-forward" size={18} color="#666" />
                </View>
            )}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress}>
                {Content}
            </TouchableOpacity>
        );
    }

    return Content;
}