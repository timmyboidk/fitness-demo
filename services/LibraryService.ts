import client from './api/client';

export interface Move {
    id: string;
    name: string;
    modelUrl: string;
    scoringConfig: any;
}

export interface Session {
    id: string;
    name: string;
    difficulty: string;
    duration: number;
}

export interface LibraryResponse {
    moves: Move[];
    sessions: Session[];
}

export class LibraryService {
    async fetchLibrary(difficultyLevel?: string): Promise<LibraryResponse | null> {
        try {
            const response = await client.get('/api/library', {
                params: { difficultyLevel }
            });
            const data = response.data;
            if (data.success) {
                return data.data;
            }
            return null;
        } catch (e) {
            console.error('Fetch library error:', e);
            return null;
        }
    }

    async addItem(userId: string, itemId: string, itemType: 'move' | 'session') {
        // Based on the spec, there isn't a direct 'addItem' endpoint in fitness-content,
        // but let's assume it's part of the library management if needed.
        // For now, keeping the structure but updating to client.
        try {
            const response = await client.post('/api/library', {
                type: 'add_item',
                payload: { userId, itemId, itemType }
            });
            return response.data;
        } catch (e) {
            console.error('Add item error:', e);
            return { success: false, error: 'Network Error' };
        }
    }
}

export const libraryService = new LibraryService();
