import client from './api/client';

export interface User {
    id: string;
    nickname: string;
    avatar: string;
    token: string;
    phone?: string;
}

class AuthService {
    async requestOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
        // Backend doesn't have a separate OTP request endpoint in the current spec,
        // but typically this would be handled. For now, we simulate success.
        return { success: true, message: 'OTP sent' };
    }

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
            return { success: false, message: data.message || 'Login failed' };
        } catch (e: any) {
            console.error('Login error:', e);
            return { success: false, message: e.response?.data?.message || 'Network error' };
        }
    }

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
            return { success: false, message: data.message || 'Login failed' };
        } catch (e: any) {
            console.error('WeChat login error:', e);
            return { success: false, message: e.response?.data?.message || 'Network error' };
        }
    }

    async onboarding(userId: string, difficultyLevel: string): Promise<{ success: boolean; data?: any }> {
        try {
            const response = await client.post('/api/auth/onboarding', {
                userId,
                difficultyLevel
            });
            return response.data;
        } catch (e: any) {
            console.error('Onboarding error:', e);
            return { success: false, error: e.response?.data?.message || 'Network error' };
        }
    }

    async logout() {
        const keys = ['user_token', 'user_id'];
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.multiRemove(keys);
        // Also clear from client if needed, though interceptor handles it
    }
}

export const authService = new AuthService();
