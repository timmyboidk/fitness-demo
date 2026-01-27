import { aiScoringService } from '../AIScoringService';
import client from '../api/client';

jest.mock('../api/client');

describe('AIScoringService', () => {
    it('should return score from API', async () => {
        const mockResponse = {
            data: {
                success: true,
                data: {
                    success: true,
                    score: 85,
                    feedback: ['Great job!']
                }
            }
        };
        (client.post as jest.Mock).mockResolvedValue(mockResponse);

        const result = await aiScoringService.scoreMove({
            moveId: 'm1',
            data: { keypoints: [], userId: 'u1' }
        });

        expect(result.score).toBe(85);
        expect(result.feedback).toContain('Great job!');
    });

    it('should handle API errors gracefully', async () => {
        (client.post as jest.Mock).mockRejectedValue(new Error('Network error'));

        const result = await aiScoringService.scoreMove({
            moveId: 'm1',
            data: { keypoints: [], userId: 'u1' }
        });

        expect(result.success).toBe(false);
        expect(result.score).toBe(0);
    });

    it('should handle API success false', async () => {
        (client.post as jest.Mock).mockResolvedValue({
            data: { success: false }
        });

        const result = await aiScoringService.scoreMove({
            moveId: 'm1',
            data: { keypoints: [], userId: 'u1' }
        });

        expect(result.success).toBe(false);
    });
});
