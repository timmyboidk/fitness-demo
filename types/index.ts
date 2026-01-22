/**
 * @file types/index.ts
 * @description Shared TypeScript interfaces for the application.
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
    icon: string; // SF Symbol Name
    isVisible: boolean;
    modelUrl?: string;
    scoringConfig?: any;
}

export interface Session {
    id: string;
    name: string;
    time: string; // e.g. "20 分钟"
    duration?: number; // in minutes
    count: string; // e.g. "4 个动作"
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
