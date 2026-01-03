import { ExpoRequest } from 'expo-router/server';
import connectToDatabase from '../../lib/mongoose';
import { Move } from '../../models/Move';

export async function GET(request: ExpoRequest) {
    try {
        await connectToDatabase();

        // 1. 检查数据库是否为空
        const count = await Move.countDocuments();

        // 2. 如果为空，自动插入演示数据 (Seeding)
        if (count === 0) {

            await Move.create([
                {
                    name: 'Push Up',
                    level: 'Beginner',
                    category: 'Strength',
                    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop'
                },
                {
                    name: 'Squat',
                    level: 'Intermediate',
                    category: 'Legs',
                    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop'
                },
                {
                    name: 'Plank',
                    level: 'All Levels',
                    category: 'Core',
                    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop'
                },
                {
                    name: 'Lunges',
                    level: 'Beginner',
                    category: 'Legs',
                    imageUrl: 'https://images.unsplash.com/photo-1434608519344-49d77a699ded?q=80&w=2074&auto=format&fit=crop'
                },
            ]);
        }

        // 3. 获取所有数据并返回
        // 修复点：使用标准的 Response.json()
        const moves = await Move.find({}).sort({ createdAt: -1 });
        return Response.json(moves);

    } catch (error) {
        console.error("Database Error:", error);
        // 修复点：使用标准的 Response.json()
        return Response.json(
            { error: 'Failed to fetch moves', details: (error as Error).message },
            { status: 500 }
        );
    }
}