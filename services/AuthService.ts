/**
 * @file AuthService.ts
 * @description 身份验证服务。
 * 处理用户登录、注册、OTP验证以及微信登录流程。
 * 管理用户Token和会话持久化。
 */

import client from './api/client';

/**
 * 用户信息接口
 * @property id 用户唯一标识
 * @property nickname 用户昵称
 * @property avatar 用户头像URL
 * @property token 认证令牌 (JWT)
 * @property phone (可选) 绑定手机号
 */
export interface User {
    id: string;
    nickname: string;
    avatar: string;
    token: string;
    phone?: string;
}

/**
 * 认证服务类
 * 封装与后端 /api/auth 相关的交互逻辑
 */
class AuthService {
    /**
     * 请求发送手机验证码 (OTP)
     *
     * @param phoneNumber - 目标手机号
     * @returns {Promise<{ success: boolean; message: string }>} 请求结果
     */
    async requestOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
        // 当前后端规范中暂时没有独立的OTP请求接口，
        // 但通常流程需要此步骤。此处模拟发送成功。
        return { success: true, message: '验证码已发送' };
    }

    /**
     * 验证手机验证码并登录
     *
     * @param phoneNumber - 手机号
     * @param code - 验证码
     * @returns {Promise<{ success: boolean; user?: User; message?: string }>} 登录结果, 成功则包含用户信息
     */
    async verifyOTP(phoneNumber: string, code: string): Promise<{ success: boolean; user?: User; message?: string }> {
        try {
            const response = await client.post('/api/auth', {
                type: 'login_phone',
                phone: phoneNumber,
                code: code
            });

            const data = response.data;
            if (data.success) {
                return { success: true, user: data.data };
            }
            return { success: false, message: data.message || '登录失败' };
        } catch (e: any) {
            console.error('Login error:', e);
            return { success: false, message: e.response?.data?.message || '网络错误' };
        }
    }

    /**
     * 微信授权登录
     *
     * @param code - 微信授权临时票据 (code)
     * @returns {Promise<{ success: boolean; user?: User; message?: string }>} 登录结果
     */
    async loginWithWeChat(code: string): Promise<{ success: boolean; user?: User; message?: string }> {
        try {
            const response = await client.post('/api/auth', {
                type: 'login_wechat',
                code: code
            });

            const data = response.data;
            if (data.success) {
                return { success: true, user: data.data };
            }
            return { success: false, message: data.message || '登录失败' };
        } catch (e: any) {
            console.error('WeChat login error:', e);
            return { success: false, message: e.response?.data?.message || '网络错误' };
        }
    }

    /**
     * 用户初始化/入职流程
     * 设置用户偏好（如难度等级）
     *
     * @param userId - 用户ID
     * @param difficultyLevel - 选择的难度等级
     * @returns {Promise<{ success: boolean; data?: any }>} 操作结果
     */
    async onboarding(userId: string, difficultyLevel: string): Promise<{ success: boolean; data?: any; error?: string }> {
        try {
            const response = await client.post('/api/auth/onboarding', {
                userId,
                difficultyLevel
            });
            return response.data;
        } catch (e: any) {
            console.error('Onboarding error:', e);
            return { success: false, error: e.response?.data?.message || '网络错误' };
        }
    }

    /**
     * 退出登录
     * 清除本地存储的认证信息
     */
    async logout() {
        const keys = ['user_token', 'user_id'];
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.multiRemove(keys);
        // 如果需要，也可以在此处通知后端使Token失效
    }
}

export const authService = new AuthService();
