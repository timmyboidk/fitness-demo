/**
 * @file AIScoringService-test.ts
 * @description AIScoringService的单元测试。
 * 验证服务是否能正确处理后端API响应以及网络错误情况。
 */

import { aiScoringService } from '../AIScoringService';
import client from '../api/client';

// Mock API客户端，避免真实网络请求
jest.mock('../api/client');
const mockedClient = client as jest.Mocked<typeof client>;

describe('AIScoringService', () => {
    /**
     * 测试场景: 后端成功返回评分数据
     * 预期: 服务应正确解析API响应并返回标准化的ScoreResponse对象
     */
    it('returns a score from backend', async () => {
        mockedClient.post.mockResolvedValueOnce({
            data: {
                success: true,
                data: {
                    success: true,
                    score: 95,
                    feedback: ['Great form']
                }
            }
        });

        const result = await aiScoringService.scoreMove({
            moveId: 'm_squat',
            data: {
                keypoints: [],
                userId: '1'
            }
        });

        expect(result.success).toBe(true);
        expect(result.score).toBe(95);
        expect(result.feedback[0]).toBe('Great form');
    });

    /**
     * 测试场景: 后端服务出错或网络异常
     * 预期: 服务应捕获异常并返回带有默认错误信息的失败响应，而不是抛出异常
     */
    it('handles service errors', async () => {
        mockedClient.post.mockResolvedValueOnce({
            data: { success: false }
        });

        const result = await aiScoringService.scoreMove({
            moveId: '1',
            data: { keypoints: [], userId: '1' }
        });

        expect(result.success).toBe(false);
        expect(result.feedback[0]).toContain('不可用');
    });
});
