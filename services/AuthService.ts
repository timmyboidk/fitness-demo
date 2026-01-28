/**
 * @file AuthService.ts
 * @description 身份验证服务。
 * 处理用户登录、注册、OTP验证以及微信登录流程。
 * 管理用户Token和会话持久化。
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import client from './api/client';

/**
 * 认证服务类
 * 封装与后端 /api/auth 相关的交互逻辑
 */
class AuthService {
    /**
     * 请求发送手机验证码 (OTP)
     */
    async requestOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
        // 预留接口，用于后续实现
        return { success: true, message: '' };
    }

    /**
     * 验证手机验证码并登录
     */
    async verifyOTP(phoneNumber: string, code: string): Promise<{ success: boolean; user?: User; message?: string }> {
        try {
            const response = await client.post('/api/auth/verify-otp', { phone: phoneNumber, code });
            const data = response.data; // client.post 的返回类型取决于 Mock，但通常是响应对象。
            if (data.success) {
                await AsyncStorage.setItem('user_token', data.data.token);
            }
            return {
                success: data.success,
                user: data.data,
                message: data.message
            };
        } catch (e: any) {
            console.error('验证 OTP 出错:', e);
            return { success: false, message: e.response?.data?.message || '验证失败' };
        }
    }

    /**
     * 微信授权登录
     */
    async loginWithWeChat(code: string): Promise<{ success: boolean; user?: User; message?: string }> {
        try {
            const response = await client.post('/api/auth/wechat', { code });
            return response.data;
        } catch (e: any) {
            console.error('微信登录出错:', e);
            return { success: false };
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
            console.error('新手引导流程出错:', e);
            return { success: false, error: e.response?.data?.message || '网络错误' };
        }
    }

    /**
     * 验证支付并升级为 VIP 会员
     * @param userId - 用户 ID
     * @param planId - 订阅计划 ID
     * @param receipt - Apple/Android 支付凭证 (Transaction Receipt)
     */
    async upgradeToVip(userId: string, planId: string, receipt: string): Promise<{ success: boolean; data?: any; error?: string }> {
        try {
            // 在实际生成环境中，此接口应调用 fitness-pay 模块进行校验
            const response = await client.post('/api/pay/verify', {
                userId,
                planId,
                receipt,
                platform: 'ios'
            });
            return response.data;
        } catch (e: any) {
            console.error('升级 VIP 出错:', e);
            return { success: false, error: e.response?.data?.message || '支付验证失败' };
        }
    }

    /**
     * 退出登录
     * 清除本地存储的认证信息
     */
    async logout() {
        const keys = ['user_token', 'user_id'];
        await AsyncStorage.multiRemove(keys);
        // 如果需要，也可以在此处通知后端使Token失效
    }
}

export const authService = new AuthService();
