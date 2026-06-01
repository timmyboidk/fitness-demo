/**
 * @file library+api.ts
 * @description 资源库管理 API。
 * GET: 获取所有可用的动作和课程。
 * POST: 处理 items 的添加 (add_item)，即用户将动作/课程收藏到自己名下。
 * 使用内存数据存储。
 */

import { ExpoRequest } from 'expo-router/server';

interface StoredMove {
    id: string;
    name: string;
    category: string;
    difficulty: string;
    icon: string;
    duration: number;
}

interface StoredSession {
    id: string;
    name: string;
    desc: string;
    level: string;
    totalDuration: number;
    color: string;
    moveIds: string[];
}

const moves: StoredMove[] = [
    { id: 'm_001', name: '标准深蹲', category: '腿部', difficulty: '中级', icon: 'body', duration: 60 },
    { id: 'm_002', name: '俯卧撑', category: '胸部', difficulty: '初级', icon: 'accessibility', duration: 45 },
    { id: 'm_003', name: '开合跳', category: '有氧', difficulty: '初级', icon: 'walk', duration: 30 },
    { id: 'm_004', name: '平板支撑', category: '核心', difficulty: '高级', icon: 'fitness', duration: 60 },
];

const sessions: StoredSession[] = [
    {
        id: 's_001', name: '全身燃脂初级', desc: '适合新手的全身激活训练',
        level: 'L1', totalDuration: 15, color: '#D1D1D6',
        moveIds: ['m_001', 'm_002', 'm_003'],
    },
];

interface UserLibrary {
    myMoves: string[];
    mySessions: string[];
}

const userLibraries: Record<string, UserLibrary> = {};

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
 * GET /api/library
 * 获取全局的动作库和课程库
 */
export async function GET(request: ExpoRequest) {
    return ok({ moves, sessions });
}

/**
 * POST /api/library
 * 执行资源库操作 (如添加)
 */
export async function POST(request: ExpoRequest) {
    try {
        const { type, payload } = await request.json();

        if (type === 'add_item') {
            const { userId, itemId, itemType } = payload;

            if (!userLibraries[userId]) {
                userLibraries[userId] = { myMoves: [], mySessions: [] };
            }

            const lib = userLibraries[userId];

            if (itemType === 'move') {
                if (!lib.myMoves.includes(itemId)) {
                    lib.myMoves.push(itemId);
                }
            } else {
                if (!lib.mySessions.includes(itemId)) {
                    lib.mySessions.push(itemId);
                }
            }

            const moveDetails = lib.myMoves
                .map(id => moves.find(m => m.id === id))
                .filter(Boolean);
            const sessionDetails = lib.mySessions
                .map(id => sessions.find(s => s.id === id))
                .filter(Boolean);

            return ok({
                user: { id: userId, myMoves: moveDetails, mySessions: sessionDetails },
            });
        }

        return fail('Unknown type', 400);

    } catch (error) {
        return fail((error as Error).message, 500);
    }
}
