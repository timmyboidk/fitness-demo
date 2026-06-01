import NetInfo from '@react-native-community/netinfo';
import { Collector as DataCollector } from '../analytics/DataCollector';
import client from '../api/client';

jest.mock('@react-native-community/netinfo');
jest.mock('../api/client');

describe('DataCollector', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // 如果可能则重置内部状态，但它是单例。
    });

    it('should buffer events and flush when limit reached', async () => {
        (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true, type: 'wifi' });
        (client.post as jest.Mock).mockResolvedValue({ data: { success: true } });

        // 添加事件
        await DataCollector.track('app_event', { foo: 'bar' });
        await DataCollector.track('score', { foo: 'baz' });

        // 手动或通过计数触发刷新
        // 假设刷新缓冲区大小为 10。
        // 如果暴露了强制刷新方法，我们可以使用，否则依赖限制。

        // 等等，DataCollector 逻辑：
        // track -> addToBuffer -> if buffer >= limit -> flush

        // 强制触发它。
        for (let i = 0; i < 15; i++) {
            await DataCollector.track('app_event', {});
        }

        await DataCollector.flush();

        expect(client.post).toHaveBeenCalledWith('/api/data/collect', expect.any(Object));
    });

    it('should not flush if offline', async () => {
        (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: false });
        (client.post as jest.Mock).mockClear();

        await DataCollector.track('app_event', {});

        // 即使我们填满缓冲区
        for (let i = 0; i < 15; i++) {
            await DataCollector.track('app_event', {});
        }

        expect(client.post).not.toHaveBeenCalled();
    });
});
