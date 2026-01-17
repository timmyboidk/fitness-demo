import { libraryService } from '../LibraryService';
import client from '../api/client';

jest.mock('../api/client');
const mockedClient = client as jest.Mocked<typeof client>; // Mock 客户端

describe('LibraryService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('fetchLibrary returns data on success', async () => {
        const mockData = { moves: [{ id: '1' }], sessions: [{ id: '2' }] };
        mockedClient.get.mockResolvedValueOnce({
            data: { success: true, data: mockData },
        });

        const result = await libraryService.fetchLibrary();
        expect(result).toEqual(mockData);
        expect(mockedClient.get).toHaveBeenCalledWith('/api/library', expect.objectContaining({
            params: {}
        }));
    });

    it('fetchLibrary with difficulty filter', async () => {
        const mockData = { moves: [], sessions: [] };
        mockedClient.get.mockResolvedValueOnce({
            data: { success: true, data: mockData },
        });

        await libraryService.fetchLibrary('expert');
        expect(mockedClient.get).toHaveBeenCalledWith('/api/library', expect.objectContaining({
            params: { difficultyLevel: 'expert' }
        }));
    });

    it('fetchLibrary returns null on error', async () => {
        mockedClient.get.mockRejectedValueOnce(new Error('Fail'));
        const result = await libraryService.fetchLibrary();
        expect(result).toBeNull();
    });

    it('addItem posts data', async () => {
        mockedClient.post.mockResolvedValueOnce({
            data: { success: true },
        });

        const result = await libraryService.addItem('uid', 'mid', 'move');
        expect(mockedClient.post).toHaveBeenCalledWith('/api/library', expect.objectContaining({
            type: 'add_item'
        }));
        expect(result.success).toBe(true);
    });

    it('addItem handles error', async () => {
        mockedClient.post.mockRejectedValueOnce(new Error('Post failed'));
        const result = await libraryService.addItem('uid', 'mid', 'move');
        expect(result).toEqual({ success: false, error: 'Network Error' });
    });
});
