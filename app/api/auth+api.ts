/**
 * @file auth+api.ts
 * @description 身份认证与用户管理 API。
 * 处理用户登录 (手机号/微信)、注册以及自动生成演示数据 (Seeding)。
 * 这是一个 Expo Router API Route，运行在类似 Edge 的环境中。
 */

import { ExpoRequest } from 'expo-router/server';
import connectToDatabase from '../../lib/mongoose';
import { Move } from '../../models/Move';
import { Session } from '../../models/Session';
import { User } from '../../models/User';

/**
 * 模拟的公共库种子数据 (如果数据库为空)
 * 自动填充一些基础的训练动作和课程
 */
async function seedLibrary() {
    const moveCount = await Move.countDocuments();
    if (moveCount === 0) {
        const moves = await Move.create([
            { name: '标准深蹲', category: '腿部', difficulty: '中级', icon: 'body', duration: 60 },
            { name: '俯卧撑', category: '胸部', difficulty: '初级', icon: 'accessibility', duration: 45 },
            { name: '开合跳', category: '有氧', difficulty: '初级', icon: 'walk', duration: 30 },
            { name: '平板支撑', category: '核心', difficulty: '高级', icon: 'fitness', duration: 60 },
        ]);
        // 创建一个包含上述动作的课程
        await Session.create({
            name: '全身燃脂初级',
            desc: '适合新手的全身激活训练',
            level: 'L1',
            totalDuration: 15,
            color: '#CCFF00',
            moves: moves.map((m: any) => m._id)
        });
    }
}

/**
 * POST /api/auth
 * 处理登录和注册请求
 */
export async function POST(request: ExpoRequest) {
    await connectToDatabase();
    await seedLibrary(); // 确保库里有东西

    try {
        const { type, payload } = await request.json();

        // --- 手机号登录模式 ---
        if (type === 'login_phone') {
            // 真实场景：校验短信验证码
            // Demo场景：直接查找或创建用户
            let user = await User.findOne({ phone: payload.phone }).populate('myMoves').populate('mySessions');
            if (!user) {
                user = await User.create({
                    phone: payload.phone,
                    nickname: `用户${payload.phone.slice(-4)}`,
                    // 新用户默认没有任何动作，必须去 library 添加
                    myMoves: [],
                    mySessions: []
                });
            }
            return Response.json({ success: true, user });
        }

        // --- 微信登录模式 ---
        if (type === 'login_wechat') {
            // 真实场景：使用 payload.code 换取 access_token 和 openid，再换取 userInfo
            // Mock场景：直接模拟一个微信用户
            const mockOpenId = "mock_wx_openid_12345";
            let user = await User.findOne({ wechatOpenId: mockOpenId }).populate('myMoves').populate('mySessions');

            if (!user) {
                user = await User.create({
                    wechatOpenId: mockOpenId,
                    nickname: "微信用户Tim",
                    avatar: "https://ui-avatars.com/api/?name=Tim&background=0D8ABC&color=fff", // 模拟微信头像
                    myMoves: [],
                    mySessions: []
                });
            }
            return Response.json({ success: true, user });
        }

        return Response.json({ error: 'Unknown type' }, { status: 400 });

    } catch (error) {
        return Response.json({ error: (error as Error).message }, { status: 500 });
    }
}