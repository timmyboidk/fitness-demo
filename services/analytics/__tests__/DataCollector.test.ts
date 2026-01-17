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
        // 如果可能，重置 buffer，或创建新实例逻辑 (单例限制了这点，但如果我们强制转换为 any 可以访问私有属性)
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

        // 填充 buffer
        for (let i = 0; i < 20; i++) {
            Collector.track('event', { i });
        }

        // 等待异步 flush 完成
        // 由于 track() 调用 flush() 不会 await，我们需要等待 promise 链
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(mockedClient.post).toHaveBeenCalled();
        const buffer = (Collector as any).buffer;
        expect(buffer.length).toBe(0);
    });

    it('should strip keypoints when not on wifi', async () => {
        (NetInfo.fetch as jest.Mock).mockResolvedValue({ type: 'cellular' });

        Collector.track('action_score', { keypoints: [{ x: 1, y: 1 }] });
        Collector.track('app_event', { action: 'click' });

        // 强制 flush
        await (Collector as any).flush();

        const callArgs = mockedClient.post.mock.calls[0][1] as any;
        const items = callArgs.items;

        // 应该只包含 app_event，丢弃 action_score
        expect(items.length).toBe(1);
        expect(items[0].type).toBe('app_event');
    });

    it('should sanitize data (add noise)', () => {
        const raw = { keypoints: [{ x: 100, y: 100, score: 0.9 }], deviceId: '123' };
        // 访问私有 sanitize 方法
        const sanitized = (Collector as any).sanitize(raw);

        expect(sanitized.deviceId).toBeUndefined();
        expect(sanitized.keypoints[0].x).not.toBe(100); // 应该有噪声
        expect(Math.abs(sanitized.keypoints[0].x - 100)).toBeLessThan(1.0); // 噪声在范围内
    });
});
