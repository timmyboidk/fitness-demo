import NetInfo from '@react-native-community/netinfo';
import { Collector as DataCollector } from '../analytics/DataCollector';
import client from '../api/client';

jest.mock('@react-native-community/netinfo');
jest.mock('../api/client');

describe('DataCollector', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset internal state if possible, but singleton.
    });

    it('should buffer events and flush when limit reached', async () => {
        (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true, type: 'wifi' });
        (client.post as jest.Mock).mockResolvedValue({ data: { success: true } });

        // Add events
        await DataCollector.track('app_event', { foo: 'bar' });
        await DataCollector.track('score', { foo: 'baz' });

        // Trigger flush manually or by count
        // Assuming flush buffer size is 10.
        // We can force flush if exposed, otherwise we rely on limit.

        // Wait, DataCollector logic:
        // track -> addToBuffer -> if buffer >= limit -> flush

        // Let's force it.
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

        // Even if we fill buffer
        for (let i = 0; i < 15; i++) {
            await DataCollector.track('app_event', {});
        }

        expect(client.post).not.toHaveBeenCalled();
    });
});
