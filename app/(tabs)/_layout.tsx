import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#121212',
                    borderTopColor: '#333',
                    height: 90,
                    paddingTop: 10
                },
                tabBarActiveTintColor: '#CCFF00',
                tabBarInactiveTintColor: '#666',
                tabBarShowLabel: true,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Moves',
                    tabBarIcon: ({ color }) => <Ionicons name="barbell" size={26} color={color} />,
                }}
            />
            <Tabs.Screen
                name="sessions" // 注意：这里引用的是 sessions.tsx
                options={{
                    title: 'Sessions',
                    tabBarIcon: ({ color }) => <Ionicons name="timer" size={26} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile" // 注意：这里引用的是 profile.tsx
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <Ionicons name="person" size={26} color={color} />,
                }}
            />
            {/* 隐藏原来的 explore 路由如果还存在的话 */}
            <Tabs.Screen name="explore" options={{ href: null }} />
        </Tabs>
    );
}