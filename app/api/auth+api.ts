import { ExpoRequest } from 'expo-router/server';
import connectToDatabase from '../../lib/mongoose';
import { User } from '../../models/User';
import { Move } from '../../models/Move';
import { Session } from '../../models/Session';

// 模拟的公共库种子数据 (如果数据库为空)
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

export async function POST(request: ExpoRequest) {
    await connectToDatabase();
    await seedLibrary(); // 确保库里有东西

    try {
        const { type, payload } = await request.json();

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

        if (type === 'login_wechat') {
            // 真实场景：使用 payload.code 换取 access_token 和 openid，再换取 userInfo
            // 参见上传的 PDF 文档流程
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

        // 获取公共库内容 (用于 Add Item 页面)
        if (type === 'get_library') {
            const allMoves = await Move.find({});
            const allSessions = await Session.find({});
            return Response.json({ moves: allMoves, sessions: allSessions });
        }

        // 用户添加内容到自己的列表
        if (type === 'add_item') {
            const { userId, itemId, itemType } = payload;
            const user = await User.findById(userId);
            if (itemType === 'move') {
                if (!user.myMoves.includes(itemId)) {
                    user.myMoves.push(itemId);
                }
            } else {
                if (!user.mySessions.includes(itemId)) {
                    user.mySessions.push(itemId);
                }
            }
            await user.save();
            // 返回更新后的用户数据
            const updatedUser = await User.findById(userId).populate('myMoves').populate('mySessions');
            return Response.json({ success: true, user: updatedUser });
        }

        return Response.json({ error: 'Unknown type' }, { status: 400 });

    } catch (error) {
        return Response.json({ error: (error as Error).message }, { status: 500 });
    }
}