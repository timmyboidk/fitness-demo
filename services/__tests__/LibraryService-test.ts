import { libraryService } from '../LibraryService';

global.fetch = jest.fn() as jest.Mock;

describe('LibraryService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('fetchLibrary returns data on success', async () => {
        const mockData = { moves: [1], sessions: [2] };
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        const result = await libraryService.fetchLibrary();
        expect(result).toEqual(mockData);
    });

    it('fetchLibrary returns null on error', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Fail'));
        const result = await libraryService.fetchLibrary();
        expect(result).toBeNull();
    });

    it('fetchLibrary returns null on non-ok response', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
        });
        const result = await libraryService.fetchLibrary();
        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('addItem posts data', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({ success: true }),
        });

        const result = await libraryService.addItem('uid', 'mid', 'move');
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/library'), expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('add_item')
        }));
        expect(result.success).toBe(true);
    });

    it('addItem handles error', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Post failed'));

        const result = await libraryService.addItem('uid', 'mid', 'move');
        expect(result).toEqual({ success: false, error: 'Network Error' });
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});
