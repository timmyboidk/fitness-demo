// Mock mocks for non-existent files
jest.mock('../../../lib/mongoose', () => jest.fn(), { virtual: true });
jest.mock('../../../models/User', () => ({
    User: {
        findOne: jest.fn(),
        create: jest.fn(),
    }
}), { virtual: true });
jest.mock('../../../models/Move', () => ({
    Move: {
        countDocuments: jest.fn(),
        create: jest.fn(),
    }
}), { virtual: true });
jest.mock('../../../models/Session', () => ({
    Session: {
        create: jest.fn(),
    }
}), { virtual: true });

const { User } = require('../../../models/User');
const { Move } = require('../../../models/Move');
const { Session } = require('../../../models/Session');
import { POST } from '../auth+api';

describe('Auth API /POST', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (Move.countDocuments as jest.Mock).mockResolvedValue(10); // Assume seeded
    });

    it('should handle login_phone for existing user', async () => {
        const mockUser = { phone: '1234567890', nickname: 'TestUser' };
        const queryChain = {
            populate: jest.fn().mockReturnThis(),
            then: jest.fn().mockImplementation(callback => Promise.resolve(callback(mockUser))),
        };
        (User.findOne as jest.Mock).mockReturnValue(queryChain);

        const request = {
            json: jest.fn().mockResolvedValue({
                type: 'login_phone',
                payload: { phone: '1234567890' }
            })
        } as any;

        const response = await POST(request);
        const data = await response.json();

        expect(data.success).toBe(true);
        expect(data.user.phone).toBe('1234567890');
    });

    it('should handle login_phone and create new user if not found', async () => {
        const queryChain = {
            populate: jest.fn().mockReturnThis(),
            then: jest.fn().mockImplementation(callback => Promise.resolve(callback(null))),
        };
        (User.findOne as jest.Mock).mockReturnValue(queryChain);
        (User.create as jest.Mock).mockResolvedValue({ phone: '9999', nickname: '用户9999' });

        const request = {
            json: jest.fn().mockResolvedValue({
                type: 'login_phone',
                payload: { phone: '1234567899' }
            })
        } as any;

        const response = await POST(request);
        const data = await response.json();

        expect(data.success).toBe(true);
        expect(User.create).toHaveBeenCalled();
    });

    it('should handle login_wechat', async () => {
        const mockUser = { nickname: '微信用户Tim', wechatOpenId: 'mock_wx_openid_12345' };
        const queryChain = {
            populate: jest.fn().mockReturnThis(),
            then: jest.fn().mockImplementation(callback => Promise.resolve(callback(mockUser))),
        };
        (User.findOne as jest.Mock).mockReturnValue(queryChain);

        const request = {
            json: jest.fn().mockResolvedValue({
                type: 'login_wechat',
                payload: { code: 'some_code' }
            })
        } as any;

        const response = await POST(request);
        const data = await response.json();

        expect(data.success).toBe(true);
        expect(data.user.nickname).toBe('微信用户Tim');
    });

    it('should seed library if database is empty', async () => {
        (Move.countDocuments as jest.Mock).mockResolvedValue(0);
        (Move.create as jest.Mock).mockResolvedValue([{ _id: 'm1' }]);

        const request = {
            json: jest.fn().mockResolvedValue({ type: 'other' })
        } as any;

        await POST(request);

        expect(Move.create).toHaveBeenCalled();
        expect(Session.create).toHaveBeenCalled();
    });

    it('should return 400 for unknown type', async () => {
        const request = {
            json: jest.fn().mockResolvedValue({ type: 'unknown' })
        } as any;

        const response = await POST(request);
        expect(response.status).toBe(400);
    });

    it('should return 500 on unexpected error', async () => {
        const request = {
            json: jest.fn().mockRejectedValue(new Error('JSON Parse Error'))
        } as any;

        const response = await POST(request);
        expect(response.status).toBe(500);
    });
});
