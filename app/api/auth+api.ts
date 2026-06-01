/**
 * @file auth+api.ts
 * @description 身份认证与用户管理 API。
 * 处理用户登录 (手机号/微信) 以及自动生成演示数据 (Seeding)。
 * 这是一个 Expo Router API Route，使用内存数据存储。
 */

import { ExpoRequest } from 'expo-router/server';

/** 内存用户存储 */
interface StoredUser {
    id: string;
    phone?: string;
    nickname: string;
    avatar?: string;
    wechatOpenId?: string;
    myMoves: string[];
    mySessions: string[];
}

const users: StoredUser[] = [];
let nextUserId = 1;

function findUserByPhone(phone: string) {
    return users.find(u => u.phone === phone);
}

function findUserByWechat(openId: string) {
    return users.find(u => u.wechatOpenId === openId);
}

function createUser(data: Partial<StoredUser>): StoredUser {
    const user: StoredUser = {
        id: `u_${String(nextUserId++).padStart(3, '0')}`,
        nickname: data.nickname || `用户${Math.random().toString(36).slice(2, 6)}`,
        avatar: data.avatar || 'https://ui-avatars.com/api/?name=User&background=333&color=fff',
        myMoves: [],
        mySessions: [],
        ...data,
    };
    users.push(user);
    return user;
}

function ok(data: unknown, message = '操作成功') {
    return Response.json({
        success: true, code: '200', message, data, timestamp: Date.now(),
    });
}

function fail(error: string, status: number, message = '操作失败') {
    return Response.json({
        success: false, code: String(status), message, data: null, timestamp: Date.now(),
    }, { status });
}

/**
 * POST /api/auth
 * 处理登录和注册请求
 */
export async function POST(request: ExpoRequest) {
    try {
        const { type, payload } = await request.json();

        // --- 手机号登录模式 ---
        if (type === 'login_phone') {
            let user = findUserByPhone(payload.phone);
            if (!user) {
                user = createUser({
                    phone: payload.phone,
                    nickname: `用户${payload.phone.slice(-4)}`,
                });
            }
            return ok(user);
        }

        // --- 微信登录模式 ---
        if (type === 'login_wechat') {
            const mockOpenId = 'mock_wx_openid_' + (payload.code || 'default');
            let user = findUserByWechat(mockOpenId);
            if (!user) {
                user = createUser({
                    wechatOpenId: mockOpenId,
                    nickname: '微信用户',
                    avatar: 'https://ui-avatars.com/api/?name=WeChat&background=333&color=fff',
                });
            }
            return ok(user);
        }

        return fail('Unknown type', 400);

    } catch (error) {
        return fail((error as Error).message, 500);
    }
}
