import client from './api/client';

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

class AIScoringService {
    async scoreMove(request: ScoreRequest): Promise<ScoreResponse> {
        try {
            const response = await client.post('/api/ai/score', request);
            const data = response.data;

            if (data.success) {
                // The spec says data.data contains the score info
                return data.data;
            }

            return {
                success: false,
                score: 0,
                feedback: ['评分服务暂时不可用']
            };
        } catch (e) {
            console.error('AIScoring error:', e);
            return {
                success: false,
                score: 0,
                feedback: ['网络异常，请稍后重试']
            };
        }
    }
}

export const aiScoringService = new AIScoringService();
