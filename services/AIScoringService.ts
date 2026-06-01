/**
 * @file AIScoringService.ts
 * @description 处理与 AI 评分后端的通信。
 * 发送关键点数据并返回实时的动作评分与反馈。
 */

import client from './api/client';

import { FeedbackCode, ScoreRequest, ScoreResponse } from '../types';

/**
 * AI 评分服务
 * 封装所有与 AI 评分相关的 API 调用。
 */
class AIScoringService {
    /**
     * 提交姿态数据进行 AI 评分。
     *
     * @param request - 包含动作 ID 和关键点数据
     * @returns {Promise<ScoreResponse>} 包含反馈代码的评分结果
     */
    async scoreMove(request: ScoreRequest): Promise<ScoreResponse> {
        try {
            const response = await client.post('/api/ai/score', request);
            const data = response.data;

            if (data.success) {
                return {
                    ...data.data,
                    feedbackCodes: data.data.feedbackCodes || [],
                };
            }

            return {
                success: false,
                score: 0,
                feedback: ['评分服务暂时不可用'],
                feedbackCodes: [],
            };
        } catch (e) {
            console.error('AI 评分出错:', e);
            return {
                success: false,
                score: 0,
                feedback: ['网络异常，请稍后重试'],
                feedbackCodes: [],
            };
        }
    }
}

export const aiScoringService = new AIScoringService();
