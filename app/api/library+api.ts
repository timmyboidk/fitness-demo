import { ExpoRequest } from 'expo-router/server';
import connectToDatabase from '../../lib/mongoose';
import { Move } from '../../models/Move';
import { Session } from '../../models/Session';
import { User } from '../../models/User';

export async function GET(request: ExpoRequest) {
    await connectToDatabase();
    const allMoves = await Move.find({});
    const allSessions = await Session.find({});
    return Response.json({ moves: allMoves, sessions: allSessions });
}

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
