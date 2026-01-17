/**
 * @file useFeatureLimit.ts
 * @description Hook to handle feature usage limits for free users.
 * Abstracts the logic for checking VIP status and count limits.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Alert } from 'react-native';

type FeatureType = 'move' | 'session';

export function useFeatureLimit() {
    /**
     * Checks if the user is allowed to proceed with the action based on their subscription status.
     * @param type - The type of feature being accessed ('move' or 'session')
     * @param currentCount - The current number of items the user has
     * @returns Promise<boolean> - true if allowed, false if blocked (and Alert shown)
     */
    const checkLimit = async (type: FeatureType, currentCount: number): Promise<boolean> => {
        try {
            const userStr = await AsyncStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);

                // VIP users have no limits
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
            // If no user found (guest?) or check passed
            return true;
        } catch (error) {
            console.error('Feature limit check error:', error);
            // Default to allow if error occurs, or block? 
            // Better to allow to not block user due to internal error, or handle gracefully.
            return true;
        }
    };

    return { checkLimit };
}
