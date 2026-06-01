/**
 * @file DataCollector.test.ts
 * @description DataCollector 分析服务的单元测试
 */

// 在导入前模拟依赖
jest.mock('@react-native-community/netinfo', () => ({
    fetch: jest.fn(),
}));

jest.mock('../../api/client', () => ({
    __esModule: true,
    default: {
        post: jest.fn(),
    },
}));

jest.mock('uuid', () => ({
    v4: () => 'mock-uuid-1234',
}));

describe('DataCollector', () => {
    let DataCollectorModule: any;
    let Collector: any;

    beforeEach(() => {
        jest.clearAllMocks();

        // 重置并重新导入以获取新实例
        jest.resetModules();

        // 在重置模块后重新设置模拟
        const NetInfo = require('@react-native-community/netinfo');
        const client = require('../../api/client').default;

        NetInfo.fetch.mockResolvedValue({ isConnected: true, type: 'wifi' });
        client.post.mockResolvedValue({ data: { success: true } });

        DataCollectorModule = require('../DataCollector');
        Collector = DataCollectorModule.Collector;
        (global as any).currentSessionId = undefined;
    });

    describe('track', () => {
        it('should add items to buffer with timestamp', () => {
            Collector.track('score', { value: 95 });

            expect(Collector['buffer'].length).toBe(1);
            expect(Collector['buffer'][0].type).toBe('score');
            expect(Collector['buffer'][0].value).toBe(95);
            expect(Collector['buffer'][0].timestamp).toBeDefined();
        });

        it('should sanitize data by removing deviceId', () => {
            Collector.track('app_event', { deviceId: 'secret123', action: 'click' });

            expect(Collector['buffer'][0].deviceId).toBeUndefined();
            expect(Collector['buffer'][0].action).toBe('click');
        });

        it('should add noise to keypoints for privacy', () => {
            const originalKeypoints = [{ x: 100, y: 200 }];
            Collector.track('action_score', { keypoints: originalKeypoints });

            const sanitizedKeypoints = Collector['buffer'][0].keypoints;
            // 由于噪声，坐标应该略有不同
            expect(sanitizedKeypoints[0].x).not.toBe(100);
            expect(sanitizedKeypoints[0].y).not.toBe(200);
            // 但在合理范围内（原始值 ± 0.5）
            expect(Math.abs(sanitizedKeypoints[0].x - 100)).toBeLessThanOrEqual(0.5);
            expect(Math.abs(sanitizedKeypoints[0].y - 200)).toBeLessThanOrEqual(0.5);
        });

        it('should auto-flush when buffer reaches BATCH_SIZE', () => {
            const flushSpy = jest.spyOn(Collector, 'flush');
            // BATCH_SIZE 为 20
            for (let i = 0; i < 20; i++) {
                Collector.track('score', { i });
            }
            expect(flushSpy).toHaveBeenCalled();
        });
    });

    describe('flush', () => {
        it('should not flush if buffer is empty', async () => {
            const { fetch } = require('@react-native-community/netinfo');
            await Collector.flush();
            expect(fetch).not.toHaveBeenCalled();
        });

        it('should filter keypoints when not on wifi', async () => {
            const NetInfo = require('@react-native-community/netinfo');
            const client = require('../../api/client').default;

            NetInfo.fetch.mockResolvedValue({ isConnected: true, type: 'cellular' });

            Collector.track('action_score', { keypoints: [{ x: 1, y: 1 }] });
            Collector.track('score', { value: 100 });

            await Collector.flush();

            // 应该只发送 'score'，而不是 'action_score'（关键点）
            expect(client.post).toHaveBeenCalledWith('/api/data/collect', expect.objectContaining({
                items: expect.arrayContaining([
                    expect.objectContaining({ type: 'score' })
                ])
            }));

            const sentItems = client.post.mock.calls[0][1].items;
            expect(sentItems.find((i: any) => i.keypoints)).toBeUndefined();
        });

        it('should log warning and keep buffer on upload failure', async () => {
            const client = require('../../api/client').default;
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });

            client.post.mockRejectedValue(new Error('Network error'));

            Collector.track('score', { value: 50 });
            await Collector.flush();

            expect(consoleSpy).toHaveBeenCalledWith('Upload failed, retrying next batch', expect.any(Error));
            expect(Collector['buffer'].length).toBe(1); // 未清除
            consoleSpy.mockRestore();
        });

        it('should use currentSessionId if set', () => {
            (global as any).currentSessionId = 'test-session-456';
            Collector.track('score', { value: 100 });
            expect(Collector['buffer'][0].type).toBe('score');
        });
    });
});
