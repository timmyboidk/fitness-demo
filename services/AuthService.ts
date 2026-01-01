export interface User {
    id: string;
    nickname: string;
    avatar: string;
    token: string;
}

class AuthService {
    private baseUrl = 'https://api.fitbody.com/api/auth'; // Mock URL

    async requestOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
        console.log(`[AuthService] Requesting OTP for ${phoneNumber}`);
        // Mock API Call
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true, message: 'OTP sent' };
    }

    async verifyOTP(phoneNumber: string, code: string): Promise<{ success: boolean; user?: User; message?: string }> {
        console.log(`[AuthService] Verifying OTP: ${code} for ${phoneNumber}`);
        await new Promise(resolve => setTimeout(resolve, 800));

        if (code === '1234') {
            return {
                success: true,
                user: {
                    id: `ph_${phoneNumber}`,
                    nickname: `User ${phoneNumber.slice(-4)}`,
                    avatar: 'https://ui-avatars.com/api/?name=User&background=333&color=fff',
                    token: 'mock_jwt_token'
                }
            };
        }
        return { success: false, message: 'Invalid code' };
    }

    async loginWithWeChat(code: string): Promise<{ success: boolean; user?: User; message?: string }> {
        console.log(`[AuthService] Exchanging WeChat code: ${code}`);
        await new Promise(resolve => setTimeout(resolve, 800));

        return {
            success: true,
            user: {
                id: 'wx_user_mock',
                nickname: 'WeChat User',
                avatar: 'https://ui-avatars.com/api/?name=WeChat&background=07C160&color=fff',
                token: 'mock_wx_jwt_token'
            }
        };
    }
}

export const authService = new AuthService();
