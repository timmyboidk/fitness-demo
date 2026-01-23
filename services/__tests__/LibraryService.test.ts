import { Move, Session } from '../../types';
import { libraryService } from '../LibraryService';
import client from '../api/client';

jest.mock('../api/client');

describe('LibraryService', () => {
    describe('fetchLibrary', () => {
        it('should fetch library data successfully', async () => {
            const mockMoves: Move[] = [
                { id: '1', name: 'Pushup', level: 'Easy', duration: 10, calories: 5, isVisible: true }
            ];
            const mockSessions: Session[] = [
                { id: 's1', title: 'Morning', level: 'Easy', duration: 20, moves: [], isVisible: true, color: '#000' } as any
            ];

            const mockResponse = {
                data: {
                    success: true,
                    data: {
                        moves: mockMoves,
                        sessions: mockSessions
                    }
                }
            };

            (client.get as jest.Mock).mockResolvedValue(mockResponse);

            const result = await libraryService.fetchLibrary();

            expect(client.get).toHaveBeenCalledWith('/api/library', expect.anything());
            expect(result?.moves).toEqual(mockMoves); // result can be null
            expect(result?.sessions).toEqual(mockSessions);
        });

        it('should handle API errors gracefully', async () => {
            (client.get as jest.Mock).mockRejectedValue(new Error('Network error'));

            const result = await libraryService.fetchLibrary();

            expect(client.get).toHaveBeenCalledWith('/api/library', expect.anything());
            expect(result).toBeNull();
        });

        it('should return null if response success is false', async () => {
            (client.get as jest.Mock).mockResolvedValue({
                data: { success: false }
            });

            const result = await libraryService.fetchLibrary();
            expect(result).toBeNull();
        });
    });

    describe('addItem', () => {
        it('should send post request to add item', async () => {
            (client.post as jest.Mock).mockResolvedValue({
                data: { success: true }
            });

            const result = await libraryService.addItem('test_user', '123', 'move');

            expect(client.post).toHaveBeenCalledWith('/api/library', {
                type: 'add_item',
                payload: { userId: 'test_user', itemId: '123', itemType: 'move' }
            });
            expect(result).toEqual({ success: true });
        });

        it('should handle failure when adding item', async () => {
            (client.post as jest.Mock).mockRejectedValue(new Error('Failed'));

            const result = await libraryService.addItem('test_user', '123', 'move');
            expect(result).toEqual({ success: false, error: 'Network Error' });
        });
    });
});
