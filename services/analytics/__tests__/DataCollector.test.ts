import NetInfo from "@react-native-community/netinfo";
import { Collector } from '../DataCollector';

import client from "../../api/client";

// Mock client
jest.mock('../../api/client');
const mockedClient = client as jest.Mocked<typeof client>;

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
    fetch: jest.fn()
}));

describe('DataCollector Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset buffer if possible, or create new instance logic (singleton limits this, but we can access private if cast to any)
        (Collector as any).buffer = [];
    });

    it('should buffer items when track is called', () => {
        Collector.track('test_event', { foo: 'bar' });
        const buffer = (Collector as any).buffer;
        expect(buffer.length).toBe(1);
        expect(buffer[0].type).toBe('test_event');
    });

    it('should flush when buffer size is reached', async () => {
        (NetInfo.fetch as jest.Mock).mockResolvedValue({ type: 'wifi' });

        // Fill buffer
        for (let i = 0; i < 20; i++) {
            Collector.track('event', { i });
        }

        // Wait for async flush to complete
        // Since track() calls flush() without awaiting, we need to wait for the promise chain
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(mockedClient.post).toHaveBeenCalled();
        const buffer = (Collector as any).buffer;
        expect(buffer.length).toBe(0);
    });

    it('should strip keypoints when not on wifi', async () => {
        (NetInfo.fetch as jest.Mock).mockResolvedValue({ type: 'cellular' });

        Collector.track('action_score', { keypoints: [{ x: 1, y: 1 }] });
        Collector.track('app_event', { action: 'click' });

        // Force flush
        await (Collector as any).flush();

        const callArgs = mockedClient.post.mock.calls[0][1] as any;
        const items = callArgs.items;

        // Should only contain the app_event, dropping the action_score
        expect(items.length).toBe(1);
        expect(items[0].type).toBe('app_event');
    });

    it('should sanitize data (add noise)', () => {
        const raw = { keypoints: [{ x: 100, y: 100, score: 0.9 }], deviceId: '123' };
        // Access private sanitize method
        const sanitized = (Collector as any).sanitize(raw);

        expect(sanitized.deviceId).toBeUndefined();
        expect(sanitized.keypoints[0].x).not.toBe(100); // Should have noise
        expect(Math.abs(sanitized.keypoints[0].x - 100)).toBeLessThan(1.0); // Noise within range
    });
});
