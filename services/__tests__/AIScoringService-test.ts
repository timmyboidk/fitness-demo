import { aiScoringService } from '../AIScoringService';
import client from '../api/client';

jest.mock('../api/client');
const mockedClient = client as jest.Mocked<typeof client>;

describe('AIScoringService', () => {
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
