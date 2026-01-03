import { aiScoringService } from '../AIScoringService';

// We don't need to mock internals if they are self-contained logic, unless it calls external APIs.
// The service currently uses setTimeout and Math.random.
// We should probably mock Math.random to get consistent scores?
// But it's hard to strict equal check randoms. We can check range.

describe('AIScoringService', () => {
    it('returns a score within range', async () => {
        const result = await aiScoringService.scoreMove({
            moveId: '1',
            timestamp: 123,
            data: {}
        });

        expect(result.success).toBe(true);
        expect(result.score).toBeGreaterThanOrEqual(70);
        expect(result.score).toBeLessThanOrEqual(100);
        expect(result.feedback.length).toBeGreaterThan(0);
    });
});
