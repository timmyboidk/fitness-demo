/**
 * @file moves+api.ts
 * @description 动作查询 API。
 * 单独的动作查询接口，使用内存数据存储。
 */

import { ExpoRequest } from 'expo-router/server';

interface StoredMove {
    id: string;
    name: string;
    level: string;
    category: string;
    imageUrl?: string;
}

const moves: StoredMove[] = [
    {
        id: 'm_001', name: 'Push Up', level: 'Beginner',
        category: 'Strength',
        imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop',
    },
    {
        id: 'm_002', name: 'Squat', level: 'Intermediate',
        category: 'Legs',
        imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop',
    },
    {
        id: 'm_003', name: 'Plank', level: 'All Levels',
        category: 'Core',
        imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop',
    },
    {
        id: 'm_004', name: 'Lunges', level: 'Beginner',
        category: 'Legs',
        imageUrl: 'https://images.unsplash.com/photo-1434608519344-49d77a699ded?q=80&w=2074&auto=format&fit=crop',
    },
];

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

export async function GET(request: ExpoRequest) {
    try {
        return ok(moves);
    } catch (error) {
        console.error('获取动作列表出错:', error);
        return fail('Failed to fetch moves', 500);
    }
}
