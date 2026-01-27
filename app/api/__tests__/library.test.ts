/**
 * @file library.test.ts
 * @description Unit tests for Library API route
 */

import { GET, POST } from '../library+api';

// Mock mocks for non-existent files
jest.mock('../../../lib/mongoose', () => jest.fn(), { virtual: true });
jest.mock('../../../models/User', () => ({
    User: {
        findById: jest.fn(),
    }
}), { virtual: true });
jest.mock('../../../models/Move', () => ({
    Move: {
        find: jest.fn(),
    }
}), { virtual: true });
jest.mock('../../../models/Session', () => ({
    Session: {
        find: jest.fn(),
    }
}), { virtual: true });

const { User } = require('../../../models/User');
const { Move } = require('../../../models/Move');
const { Session } = require('../../../models/Session');

describe('Library API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET', () => {
        it('should return all moves and sessions', async () => {
            (Move.find as jest.Mock).mockResolvedValue([{ id: 'm1' }]);
            (Session.find as jest.Mock).mockResolvedValue([{ id: 's1' }]);

            const response = await GET({} as any);
            const data = await response.json();

            expect(data.moves).toHaveLength(1);
            expect(data.sessions).toHaveLength(1);
        });
    });

    describe('POST', () => {
        it('should handle add_item for move', async () => {
            const mockUser = {
                myMoves: [],
                mySessions: [],
                save: jest.fn().mockResolvedValue(true),
            };
            const findByIdMock = {
                populate: jest.fn().mockReturnThis(),
                then: jest.fn().mockImplementation(callback => Promise.resolve(callback(mockUser))),
            };
            (User.findById as jest.Mock).mockReturnValue(findByIdMock);

            const request = {
                json: jest.fn().mockResolvedValue({
                    type: 'add_item',
                    payload: { userId: 'u1', itemId: 'm1', itemType: 'move' }
                })
            } as any;

            const response = await POST(request);
            const data = await response.json();

            expect(data.success).toBe(true);
            expect(mockUser.myMoves).toContain('m1');
            expect(mockUser.save).toHaveBeenCalled();
        });

        it('should handle add_item for session', async () => {
            const mockUser = {
                myMoves: [],
                mySessions: [],
                save: jest.fn().mockResolvedValue(true),
            };
            const findByIdMock = {
                populate: jest.fn().mockReturnThis(),
                then: jest.fn().mockImplementation(callback => Promise.resolve(callback(mockUser))),
            };
            (User.findById as jest.Mock).mockReturnValue(findByIdMock);

            const request = {
                json: jest.fn().mockResolvedValue({
                    type: 'add_item',
                    payload: { userId: 'u1', itemId: 's1', itemType: 'session' }
                })
            } as any;

            const response = await POST(request);
            const data = await response.json();

            expect(data.success).toBe(true);
            expect(mockUser.mySessions).toContain('s1');
        });

        it('should return 404 if user not found', async () => {
            const findByIdMock = {
                populate: jest.fn().mockReturnThis(),
                then: jest.fn().mockImplementation(callback => Promise.resolve(callback(null))),
            };
            (User.findById as jest.Mock).mockReturnValue(findByIdMock);

            const request = {
                json: jest.fn().mockResolvedValue({
                    type: 'add_item',
                    payload: { userId: 'nonexistent', itemId: 'm1', itemType: 'move' }
                })
            } as any;

            const response = await POST(request);
            expect(response.status).toBe(404);
        });

        it('should return 500 on save error', async () => {
            const mockUser = {
                myMoves: [],
                save: jest.fn().mockRejectedValue(new Error('Save failed')),
            };
            const findByIdMock = {
                populate: jest.fn().mockReturnThis(),
                then: jest.fn().mockImplementation(callback => Promise.resolve(callback(mockUser))),
            };
            (User.findById as jest.Mock).mockReturnValue(findByIdMock);

            const request = {
                json: jest.fn().mockResolvedValue({
                    type: 'add_item',
                    payload: { userId: 'u1', itemId: 'm1', itemType: 'move' }
                })
            } as any;

            const response = await POST(request);
            expect(response.status).toBe(500);
        });
    });
});
