/**
 * @file auth.test.ts
 * @description Auth API 路由的单元测试
 */

import { POST } from '../auth+api';

describe('Auth API /POST', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('should handle login_phone for existing user', async () => {
        const createReq = {
            json: jest.fn().mockResolvedValue({
                type: 'login_phone',
                payload: { phone: '1234567890' },
            }),
        } as any;
        await POST(createReq);

        const response = await POST(createReq);
        const body = await response.json();

        expect(body.success).toBe(true);
        expect(body.data.phone).toBe('1234567890');
        expect(body.code).toBe('200');
        expect(body.timestamp).toBeDefined();
    });

    it('should handle login_wechat', async () => {
        const request = {
            json: jest.fn().mockResolvedValue({
                type: 'login_wechat',
                payload: { code: 'auth_code_xyz' },
            }),
        } as any;

        const response = await POST(request);
        const body = await response.json();

        expect(body.success).toBe(true);
        expect(body.data.wechatOpenId).toContain('mock_wx_openid_');
    });

    it('should return 400 for unknown type', async () => {
        const request = {
            json: jest.fn().mockResolvedValue({ type: 'unknown' }),
        } as any;

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body.success).toBe(false);
    });

    it('should return 500 on unexpected error', async () => {
        const request = {
            json: jest.fn().mockRejectedValue(new Error('JSON Parse Error')),
        } as any;

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(500);
        expect(body.success).toBe(false);
    });
});
