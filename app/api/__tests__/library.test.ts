/**
 * @file library.test.ts
 * @description Library API 路由的单元测试
 */

import { GET, POST } from '../library+api';

describe('Library API', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    describe('GET', () => {
        it('should return all moves and sessions', async () => {
            const response = await GET({} as any);
            const body = await response.json();

            expect(body.success).toBe(true);
            expect(body.data.moves).toBeDefined();
            expect(body.data.sessions).toBeDefined();
            expect(body.data.moves.length).toBeGreaterThan(0);
            expect(body.data.sessions.length).toBeGreaterThan(0);
            expect(body.code).toBe('200');
        });
    });

    describe('POST', () => {
        it('should handle add_item for move', async () => {
            const request = {
                json: jest.fn().mockResolvedValue({
                    type: 'add_item',
                    payload: { userId: 'u1', itemId: 'm_001', itemType: 'move' },
                }),
            } as any;

            const response = await POST(request);
            const body = await response.json();

            expect(body.success).toBe(true);
            expect(body.data.user.myMoves).toContainEqual(
                expect.objectContaining({ id: 'm_001' }),
            );
        });

        it('should handle add_item for session', async () => {
            const request = {
                json: jest.fn().mockResolvedValue({
                    type: 'add_item',
                    payload: { userId: 'u2', itemId: 's_001', itemType: 'session' },
                }),
            } as any;

            const response = await POST(request);
            const body = await response.json();

            expect(body.success).toBe(true);
            expect(body.data.user.mySessions).toContainEqual(
                expect.objectContaining({ id: 's_001' }),
            );
        });

        it('should return 400 for unknown type', async () => {
            const request = {
                json: jest.fn().mockResolvedValue({ type: 'unknown' }),
            } as any;

            const response = await POST(request);
            expect(response.status).toBe(400);
        });

        it('should return 500 on unexpected error', async () => {
            const request = {
                json: jest.fn().mockRejectedValue(new Error('Unexpected error')),
            } as any;

            const response = await POST(request);
            expect(response.status).toBe(500);
        });
    });
});
