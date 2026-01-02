
export class LibraryService {
    // 同样使用硬编码IP或环境变量
    private baseUrl = 'http://10.0.0.169:8081/api/library';

    async fetchLibrary() {
        try {
            const res = await fetch(this.baseUrl);
            if (!res.ok) throw new Error("Failed to fetch library");
            return await res.json(); // { moves: [], sessions: [] }
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async addItem(userId: string, itemId: string, itemType: 'move' | 'session') {
        try {
            const res = await fetch(this.baseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'add_item',
                    payload: { userId, itemId, itemType }
                })
            });
            return await res.json();
        } catch (e) {
            console.error(e);
            return { success: false, error: 'Network Error' };
        }
    }
}

export const libraryService = new LibraryService();
