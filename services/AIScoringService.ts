/**
 * @file AIScoringService.ts
 * @description Handles communication with the AI scoring backend.
 * Sends keypoint data and returns real-time form scores and feedback.
 */

import client from './api/client';

import { FeedbackCode, ScoreRequest, ScoreResponse } from '../types';

/**
 * AI Scoring Service
 * Encapsulates all AI scoring-related API calls.
 */
class AIScoringService {
    /**
     * Submit pose data for AI scoring.
     *
     * @param request - Contains move ID and keypoint data
     * @returns {Promise<ScoreResponse>} Score result with feedback codes
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
