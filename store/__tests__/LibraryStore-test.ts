import { libraryService } from '../../services/LibraryService';
import { libraryStore } from '../library';

// Mock libraryService
jest.mock('../../services/LibraryService', () => ({
    libraryService: {
        fetchLibrary: jest.fn(),
    },
}));

describe('LibraryStore', () => {
    it('initializes with default data', () => {
        expect(libraryStore.getMoves().length).toBeGreaterThan(0);
        expect(libraryStore.getSessions().length).toBeGreaterThan(0);
    });

    it('toggles move visibility', () => {
        const move = libraryStore.getMoves()[0];
        const initial = move.isVisible;

        libraryStore.toggleMoveVisibility(move.id);
        expect(move.isVisible).toBe(!initial);

        // Toggle back
        libraryStore.toggleMoveVisibility(move.id);
        expect(move.isVisible).toBe(initial);
    });

    it('toggles session visibility', () => {
        const session = libraryStore.getSessions()[0];
        const initial = session.isVisible;

        libraryStore.toggleSessionVisibility(session.id);
        expect(session.isVisible).toBe(!initial);

        libraryStore.toggleSessionVisibility(session.id);
        expect(session.isVisible).toBe(initial);
    });

    it('returns correct moves for a session', () => {
        const session = libraryStore.getSessions()[0]; // s1: HIIT (ids: m_hiit, m_core_training, etc.)
        const moves = libraryStore.getSessionMoves(session.id);

        expect(moves.length).toBe(session.moveIds.length);
        moves.forEach(m => expect(session.moveIds).toContain(m.id));
    });

    it('returns empty array for invalid session', () => {
        const moves = libraryStore.getSessionMoves('invalid_id');
        expect(moves).toEqual([]);
    });

    it('notifies subscribers on change', () => {
        const listener = jest.fn();
        const unsubscribe = libraryStore.subscribe(listener);

        const move = libraryStore.getMoves()[0];
        libraryStore.toggleMoveVisibility(move.id);

        expect(listener).toHaveBeenCalledTimes(1);

        unsubscribe();
        libraryStore.toggleMoveVisibility(move.id);
        expect(listener).toHaveBeenCalledTimes(1); // No extra call
    });

    it('sync calls service and logs count', async () => {
        const spy = jest.spyOn(console, 'log').mockImplementation();
        (libraryService.fetchLibrary as jest.Mock).mockResolvedValue({ moves: [1, 2, 3] });

        await libraryStore.sync();
        expect(libraryService.fetchLibrary).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.stringContaining("Library synced"), 3);
        spy.mockRestore();
    });

    it('toggles move visibility safely for invalid ID', () => {
        const spy = jest.fn();
        libraryStore.subscribe(spy);
        libraryStore.toggleMoveVisibility('invalid');
        expect(spy).not.toHaveBeenCalled();
    });

    it('toggles session visibility safely for invalid ID', () => {
        const spy = jest.fn();
        libraryStore.subscribe(spy);
        libraryStore.toggleSessionVisibility('invalid');
        expect(spy).not.toHaveBeenCalled();
    });
});
