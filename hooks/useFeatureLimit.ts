/**
 * @file useFeatureLimit.ts
 * @description 处理免费用户功能使用限制的 Hook。
 * 抽象了检查 VIP 状态和数量限制的逻辑。
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Alert } from 'react-native';

type FeatureType = 'move' | 'session';

export function useFeatureLimit() {
    /**
     * 根据用户订阅状态检查是否允许继续操作。
     * @param type - 正在访问的功能类型（'move' 或 'session'）
     * @param currentCount - 用户当前的计数
     * @returns Promise<boolean> - 允许则返回 true，阻止则返回 false（并显示 Alert）
     */
    const checkLimit = async (type: FeatureType, currentCount: number): Promise<boolean> => {
        try {
            const userStr = await AsyncStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);

                // VIP 用户无限制
                if (user.isVip) {
                    return true;
                }

                const limit = type === 'move' ? 10 : 3;

                if (currentCount >= limit) {
                    const message = type === 'move'
                        ? "免费版最多只能添加 10 个动作。升级到 VIP 解锁无限动作库。"
                        : "免费版每月限 3 个课程。升级到 VIP 解锁无限训练计划。";

                    Alert.alert(
                        "达到限制",
                        message,
                        [
                            { text: "取消", style: "cancel" },
                            { text: "去升级", onPress: () => router.push('/profile/subscription' as any) }
                        ]
                    );
                    return false;
                }
            }
            // 如果未找到用户（游客？）或检查通过
            return true;
        } catch (error) {
            console.error('Feature limit check error:', error);
            // 发生错误时默认允许还是阻止？
            // 最好允许，以免因内部错误阻止用户，或优雅处理。
            return true;
        }
    };

    return { checkLimit };
}
