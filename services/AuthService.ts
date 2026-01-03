export interface User {
    id: string;
    nickname: string;
    avatar: string;
    token: string;
}

class AuthService {
    // 自动判断环境 URL (Demo 中既然是 Expo Router API Route，前端直接 fetch 相对路径即可，或者 localhost)
    // 注意：React Native 中 fetch 需要完整 URL 或配 Proxy。Expo Go 中 localhost 指向设备本身而非电脑。
    // 这里假设开发环境 ip 地址，实际生产应配环境变量。
    private baseUrl = 'http://10.0.0.169:8081/api/auth'; // 根据 Log 中 Metro waiting on exp://10.0.0.169:8081 推断

    async requestOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
        // Demo: 这里的 API 还没实现 OTP 发送，前端直接模拟成功，因为 API 只要手机号就能登录

        return { success: true, message: 'OTP sent' };
    }

    async verifyOTP(phoneNumber: string, code: string): Promise<{ success: boolean; user?: User; message?: string }> {
        try {
            const res = await fetch(this.baseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'login_phone',
                    payload: { phone: phoneNumber, code } // code 实际上 API 没验，Demo 逻辑
                })
            });
            const data = await res.json();
            if (data.success) {
                return { success: true, user: data.user };
            }
            return { success: false, message: data.error || 'Login failed' };
        } catch (e) {
            console.error(e);
            return { success: false, message: 'Network error' };
        }
    }

    async loginWithWeChat(code: string): Promise<{ success: boolean; user?: User; message?: string }> {
        try {
            const res = await fetch(this.baseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'login_wechat',
                    payload: { code }
                })
            });
            const data = await res.json();
            if (data.success) {
                return { success: true, user: data.user };
            }
            return { success: false, message: data.error || 'Login failed' };
        } catch (e) {
            console.error(e);
            return { success: false, message: 'Network error' };
        }
    }

    async logout() {
        // 如果有服务器端 Session，这里调用 logout api
        // 目前只是客户端清除 token，逻辑在 UI 层做了，也可以移到这里
        const keys = ['user', 'token'];
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.multiRemove(keys);
    }
}

export const authService = new AuthService();
