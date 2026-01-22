import { libraryStore } from '../library';

describe('LibraryStore', () => {
    it('should initialize with default moves and sessions', () => {
        expect(libraryStore.getMoves().length).toBeGreaterThan(0);
        expect(libraryStore.getSessions().length).toBeGreaterThan(0);
    });

    it('should toggle move visibility', () => {
        const moves = libraryStore.getMoves();
        const firstMoveId = moves[0].id;
        const initialVisibility = moves[0].isVisible;

        libraryStore.toggleMoveVisibility(firstMoveId);
        expect(moves[0].isVisible).toBe(!initialVisibility);

        libraryStore.toggleMoveVisibility(firstMoveId);
        expect(moves[0].isVisible).toBe(initialVisibility);
    });

    it('should get session moves correctly', () => {
        const sessions = libraryStore.getSessions();
        const firstSession = sessions[0];
        const sessionMoves = libraryStore.getSessionMoves(firstSession.id);

        expect(sessionMoves.length).toBeGreaterThan(0);
        expect(sessionMoves.every(m => firstSession.moveIds.includes(m.id))).toBe(true);
    });
});
