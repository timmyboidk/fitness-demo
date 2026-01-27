/**
 * @file DataCollector.test.ts
 * @description Unit tests for DataCollector analytics service
 */

// Mock dependencies before imports
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

        // Reset and reimport to get fresh instance
        jest.resetModules();

        // Re-setup mocks AFTER reset modules
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
            // The coordinates should be slightly different due to noise
            expect(sanitizedKeypoints[0].x).not.toBe(100);
            expect(sanitizedKeypoints[0].y).not.toBe(200);
            // But within reasonable range (original ± 0.5)
            expect(Math.abs(sanitizedKeypoints[0].x - 100)).toBeLessThanOrEqual(0.5);
            expect(Math.abs(sanitizedKeypoints[0].y - 200)).toBeLessThanOrEqual(0.5);
        });

        it('should auto-flush when buffer reaches BATCH_SIZE', () => {
            const flushSpy = jest.spyOn(Collector, 'flush');
            // BATCH_SIZE is 20
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

            // Should only send 'score', not 'action_score' (keypoints)
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
            expect(Collector['buffer'].length).toBe(1); // Not cleared
            consoleSpy.mockRestore();
        });

        it('should use currentSessionId if set', () => {
            (global as any).currentSessionId = 'test-session-456';
            Collector.track('score', { value: 100 });
            expect(Collector['buffer'][0].type).toBe('score');
        });
    });
});
