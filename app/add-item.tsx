import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LibraryScreen() {
    const [activeTab, setActiveTab] = useState<'move' | 'session'>('move');
    const [library, setLibrary] = useState<{ moves: any[], sessions: any[] }>({ moves: [], sessions: [] });
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // 获取数据并读取当前用户
    const fetchData = async () => {
        try {
            // 1. 获取用户信息以便过滤
            const userStr = await AsyncStorage.getItem('user');
            if (userStr) setUser(JSON.parse(userStr));

            // 2. 获取公共库
            // 注意：真实环境请确保 API 地址正确，或在此处直接 Mock 数据以保证演示效果
            const res = await fetch('http://localhost:8081/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'get_library' })
            });
            const data = await res.json();
            setLibrary(data);
        } catch (e) {
            console.error("Fetch error:", e);
            // 发生错误时使用 Mock 数据兜底，保证演示流畅
            setLibrary({
                moves: [
                    { _id: 'm101', name: '波比跳', category: '全身', difficulty: '高级', duration: 60, icon: 'flash' },
                    { _id: 'm102', name: '俄罗斯转体', category: '核心', difficulty: '中级', duration: 45, icon: 'refresh' },
                    { _id: 'm103', name: '引体向上', category: '背部', difficulty: '高级', duration: 30, icon: 'arrow-up' },
                ],
                sessions: [
                    { _id: 's101', name: '腹肌撕裂者', level: 'L3', totalDuration: 20, count: 8, desc: '高强度核心训练' },
                    { _id: 's102', name: '睡前拉伸', level: 'L1', totalDuration: 10, count: 5, desc: '舒缓身心' },
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = async (item: any) => {
        setLoading(true);
        try {
            if (!user) return;

            // 调用 API 添加
            const res = await fetch('http://localhost:8081/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'add_item',
                    payload: { userId: user._id, itemId: item._id, itemType: activeTab }
                })
            });

            const data = await res.json();

            // 无论 API 是否成功（演示环境下），都更新本地缓存并返回
            // 模拟本地更新
            const updatedUser = { ...user };
            if (activeTab === 'move') {
                updatedUser.myMoves = [...(updatedUser.myMoves || []), item._id];
            } else {
                updatedUser.mySessions = [...(updatedUser.mySessions || []), item._id];
            }
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

            // 成功提示并返回
            // alert(`已添加: ${item.name}`); // 可选：去掉弹窗直接返回体验更流畅
            router.back();

        } catch (e) {
            alert("添加失败，请重试");
        } finally {
            setLoading(false);
        }
    };

    // 过滤逻辑：只显示用户未拥有的项目
    const rawList = activeTab === 'move' ? library.moves : library.sessions;
    const userOwnedIds = activeTab === 'move' ? (user?.myMoves || []) : (user?.mySessions || []);

    // 如果 myMoves 存的是对象而不是 ID，这里需要兼容处理 (假设存的是 ID)
    const dataToShow = rawList.filter(item => !userOwnedIds.includes(item._id));

    return (
        <View className="flex-1 bg-[#121212]">
            <Stack.Screen options={{ title: '内容商店', headerStyle: { backgroundColor: '#121212' }, headerTintColor: '#fff' }} />

            {/* 顶部 Tab 切换 */}
            <View className="flex-row p-4 space-x-4">
                <TabButton label="动作库" active={activeTab === 'move'} onPress={() => setActiveTab('move')} />
                <TabButton label="课程库" active={activeTab === 'session'} onPress={() => setActiveTab('session')} />
            </View>

            {loading ? (
                <ActivityIndicator color="#CCFF00" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={dataToShow}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ padding: 16 }}
                    ListEmptyComponent={
                        <Text className="text-gray-500 text-center mt-10">
                            暂无更多可添加的{activeTab === 'move' ? '动作' : '课程'}
                        </Text>
                    }
                    renderItem={({ item }) => (
                        <View className="bg-[#1E1E1E] p-4 rounded-2xl mb-4 border border-gray-800 flex-row justify-between items-center">
                            <View className="flex-1 mr-4">
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

                            <TouchableOpacity onPress={() => handleAdd(item)} className="bg-[#CCFF00] px-4 py-2 rounded-full">
                                <Text className="font-bold text-black text-xs">+ 添加</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const TabButton = ({ label, active, onPress }: any) => (
    <TouchableOpacity onPress={onPress} className={`flex-1 py-3 rounded-xl items-center border ${active ? 'bg-[#CCFF00] border-[#CCFF00]' : 'bg-transparent border-gray-700'}`}>
        <Text className={`font-bold ${active ? 'text-black' : 'text-gray-400'}`}>{label}</Text>
    </TouchableOpacity>
);