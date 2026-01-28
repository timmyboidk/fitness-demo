/**
 * @file types/index.ts
 * @description 应用全局共享的 TypeScript 接口定义。
 */

export interface User {
    id: string;
    nickname: string;
    avatar: string;
    token: string;
    phone?: string;
    isVip: boolean;
    difficultyLevel?: 'novice' | 'skilled' | 'expert';
}

export interface Move {
    id: string;
    name: string;
    level: string;
    icon: string; // SF Symbol 图标名称
    isVisible: boolean;
    modelUrl?: string;
    scoringConfig?: any;
}

export interface Session {
    id: string;
    name: string;
    time: string; // 例如: "20 分钟"
    duration?: number; // 分钟数
    count: string; // 例如: "4 个动作"
    color: string;
    isVisible: boolean;
    moveIds: string[];
    difficulty?: string;
}

export interface ScoreRequest {
    moveId: string;
    data: {
        keypoints: { x: number; y: number; score: number }[];
        userId: string;
    };
}

export interface ScoreResponse {
    success: boolean;
    score: number;
    feedback: string[];
}
