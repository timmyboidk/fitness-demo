/**
 * @file AIScoringService.ts
 * @description 负责与AI评分后端服务进行交互。
 * 发送关键点数据以获取实时动作评分和反馈。
 */

import client from './api/client';

/**
 * 动作评分请求数据结构
 * @property moveId 动作ID
 * @property data.keypoints 计算出的骨架关键点数组
 * @property data.userId 用户ID
 */
export interface ScoreRequest {
    moveId: string;
    data: {
        keypoints: { x: number; y: number; score: number }[];
        userId: string;
    };
}

/**
 * 动作评分响应数据结构
 * @property success 请求是否成功
 * @property score 动作得分 (0-100)
 * @property feedback 针对动作的改进建议列表
 */
export interface ScoreResponse {
    success: boolean;
    score: number;
    feedback: string[];
}

/**
 * AI评分服务类
 * 封装所有与AI评分相关的API调用
 */
class AIScoringService {
    /**
     * 发送动作数据进行AI评分
     *
     * @param request - 包含动作ID和关键点数据的请求对象
     * @returns {Promise<ScoreResponse>} 返回评分结果，包括分数和建议
     * 该方法内置了基本的错误处理，确保在网络异常时返回友好的默认状态
     */
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
