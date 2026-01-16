/**
 * @file library+api.ts
 * @description 资源库管理 API。
 * GET: 获取所有可用的动作和课程。
 * POST: 处理 items 的添加 (add_item)，即用户将动作/课程收藏到自己名下。
 */

import { ExpoRequest } from 'expo-router/server';
import connectToDatabase from '../../lib/mongoose';
import { Move } from '../../models/Move';
import { Session } from '../../models/Session';
import { User } from '../../models/User';

/**
 * GET /api/library
 * 获取全局的动作库和课程库
 */
export async function GET(request: ExpoRequest) {
    await connectToDatabase();
    const allMoves = await Move.find({});
    const allSessions = await Session.find({});
    return Response.json({ moves: allMoves, sessions: allSessions });
}

/**
 * POST /api/library
 * 执行资源库操作 (如添加)
 */
export async function POST(request: ExpoRequest) {
    try {
        await connectToDatabase();
        const { type, payload } = await request.json();

        // 用户添加内容到自己的列表
        if (type === 'add_item') {
            const { userId, itemId, itemType } = payload;
            const user = await User.findById(userId);
            if (!user) {
                return Response.json({ error: 'User not found' }, { status: 404 });
            }

            // 根据类型更新用户引用
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

            // 返回更新后的用户数据 (包含 populate 的详细信息)
            const updatedUser = await User.findById(userId).populate('myMoves').populate('mySessions');
            return Response.json({ success: true, user: updatedUser });
        }

        return Response.json({ error: 'Unknown type' }, { status: 400 });

    } catch (error) {
        return Response.json({ error: (error as Error).message }, { status: 500 });
    }
}
