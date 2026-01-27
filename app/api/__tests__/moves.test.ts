/**
 * @file moves.test.ts
 * @description Unit tests for Moves API route
 */

import { GET } from '../moves+api';

// Mock mocks for non-existent files
jest.mock('../../../lib/mongoose', () => jest.fn(), { virtual: true });
jest.mock('../../../models/Move', () => ({
    Move: {
        countDocuments: jest.fn(),
        create: jest.fn(),
        find: jest.fn(),
    }
}), { virtual: true });

const { Move } = require('../../../models/Move');

describe('Moves API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch moves and seed if empty', async () => {
        (Move.countDocuments as jest.Mock).mockResolvedValue(0);
        (Move.create as jest.Mock).mockResolvedValue([]);
        const findMock = {
            sort: jest.fn().mockResolvedValue([{ name: 'Push Up' }]),
        };
        (Move.find as jest.Mock).mockReturnValue(findMock);

        const response = await GET({} as any);
        const data = await response.json();

        expect(Move.create).toHaveBeenCalled();
        expect(data).toHaveLength(1);
    });

    it('should return moves without seeding if not empty', async () => {
        (Move.countDocuments as jest.Mock).mockResolvedValue(10);
        const findMock = {
            sort: jest.fn().mockResolvedValue([{ name: 'Squat' }]),
        };
        (Move.find as jest.Mock).mockReturnValue(findMock);

        const response = await GET({} as any);
        const data = await response.json();

        expect(Move.create).not.toHaveBeenCalled();
        expect(data[0].name).toBe('Squat');
    });

    it('should return 500 on database error', async () => {
        (Move.countDocuments as jest.Mock).mockRejectedValue(new Error('DB Error'));

        const response = await GET({} as any);
        expect(response.status).toBe(500);
    });
});
