import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// 1. 引入 Constants 用于获取动态 IP
import Constants from 'expo-constants';

export default function LibraryScreen() {
    const [activeTab, setActiveTab] = useState<'move' | 'session'>('move');
    const [library, setLibrary] = useState<{ moves: any[], sessions: any[] }>({ moves: [], sessions: [] });
    const [loading, setLoading] = useState(true);

    // 2. 动态获取 API 地址 (解决 Network request failed 问题)
    const getApiUrl = () => {
        const debuggerHost = Constants.expoConfig?.hostUri;
        const localhost = debuggerHost?.split(':')[0] || 'localhost';
        return `http://${localhost}:8081/api/auth`;
    };

    // 获取公共库数据
    const fetchLibrary = async () => {
        try {
            // 3. 使用动态 URL
            const apiUrl = getApiUrl();
            console.log("Fetching library from:", apiUrl); // 方便调试

            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'get_library' })
            });
            const data = await res.json();
            setLibrary(data);
        } catch (e) {
            console.error("Fetch Error:", e);
            // 发生错误时使用 Mock 数据兜底，防止白屏
            setLibrary({
                moves: [
                    { _id: 'm101', name: '波比跳 (离线)', category: '全身', difficulty: '高级', duration: 60, icon: 'flash' },
                    { _id: 'm102', name: '俄罗斯转体', category: '核心', difficulty: '中级', duration: 45, icon: 'refresh' },
                ],
                sessions: [
                    { _id: 's101', name: '离线课程', level: 'L1', totalDuration: 10, count: 5, desc: '网络异常时显示' },
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLibrary();
    }, []);

    const handleAdd = async (item: any) => {
        setLoading(true);
        try {
            const userStr = await AsyncStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            if (!user) return;

            // 4. 使用动态 URL
            const apiUrl = getApiUrl();
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'add_item',
                    payload: { userId: user._id, itemId: item._id, itemType: activeTab }
                })
            });

            const data = await res.json();
            if (data.success) {
                // 更新本地存储的用户数据
                await AsyncStorage.setItem('user', JSON.stringify(data.user));
                // alert(`已添加: ${item.name}`); // 体验优化：去掉弹窗
                router.back(); // 返回主页
            }
        } catch (e) {
            alert("添加失败，请检查网络");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const dataToShow = activeTab === 'move' ? library.moves : library.sessions;

    return (
        <View className="flex-1 bg-[#121212]">
            <Stack.Screen options={{ title: '内容库', headerStyle: { backgroundColor: '#121212' }, headerTintColor: '#fff' }} />

            {/* 顶部 Tab 切换 */}
            <View className="flex-row p-4 space-x-4">
                <TabButton label="所有动作" active={activeTab === 'move'} onPress={() => setActiveTab('move')} />
                <TabButton label="精选课程" active={activeTab === 'session'} onPress={() => setActiveTab('session')} />
            </View>

            {loading ? (
                <ActivityIndicator color="#CCFF00" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={dataToShow}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item }) => (
                        <View className="bg-[#1E1E1E] p-4 rounded-2xl mb-4 border border-gray-800 flex-row justify-between items-center">
                            <View className="flex-1">
                                <View className="flex-row items-center mb-1">
                                    <Text className="text-white text-lg font-bold mr-2">{item.name}</Text>
                                    <View className="bg-gray-700 px-2 py-0.5 rounded text-xs">
                                        <Text className="text-[#CCFF00] text-[10px]">{activeTab === 'move' ? item.difficulty : item.level}</Text>
                                    </View>
                                </View>
                                <Text className="text-gray-400 text-sm" numberOfLines={1}>
                                    {activeTab === 'move' ? `类别: ${item.category} • 时长: ${item.duration}s` : item.desc}
                                </Text>
                            </View>

                            <TouchableOpacity onPress={() => handleAdd(item)} className="bg-[#CCFF00] w-10 h-10 rounded-full items-center justify-center">
                                <Ionicons name="add" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const TabButton = ({ label, active, onPress }: any) => (
    <TouchableOpacity onPress={onPress} className={`flex-1 py-3 rounded-xl items-center ${active ? 'bg-[#CCFF00]' : 'bg-[#1E1E1E]'}`}>
        <Text className={`font-bold ${active ? 'text-black' : 'text-gray-400'}`}>{label}</Text>
    </TouchableOpacity>
);