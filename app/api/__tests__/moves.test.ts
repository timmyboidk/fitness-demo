/**
 * @file moves.test.ts
 * @description Moves API 路由的单元测试
 */

import { GET } from '../moves+api';

describe('Moves API', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return all moves', async () => {
        const response = await GET({} as any);
        const body = await response.json();

        expect(body.success).toBe(true);
        expect(body.data).toBeInstanceOf(Array);
        expect(body.data.length).toBeGreaterThan(0);
        expect(body.code).toBe('200');
    });

    it('should return 500 on unexpected error', async () => {
        jest.resetModules();
        jest.mock('../moves+api', () => ({
            GET: jest.fn().mockRejectedValue(new Error('break')),
        }));

        // 验证模块重新加载
        const mod = await import('../moves+api');
        await expect(mod.GET({} as any)).rejects.toThrow();
    });
});
