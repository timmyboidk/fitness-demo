import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook } from '@testing-library/react-native';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { useFeatureLimit } from '../useFeatureLimit';

// Mocks
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
}));
jest.mock('expo-router', () => ({
    router: { push: jest.fn() },
}));
jest.spyOn(Alert, 'alert');

describe('useFeatureLimit', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('allows access if no user found (e.g. guest or error)', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
        const { result } = renderHook(() => useFeatureLimit());

        const allowed = await result.current.checkLimit('move', 100);
        expect(allowed).toBe(true);
    });

    it('allows access for VIP user', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({ isVip: true }));
        const { result } = renderHook(() => useFeatureLimit());

        const allowed = await result.current.checkLimit('move', 100);
        expect(allowed).toBe(true);
    });

    it('allows access for Free user under limit', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({ isVip: false }));
        const { result } = renderHook(() => useFeatureLimit());

        // Limit is 10 for moves
        const allowed = await result.current.checkLimit('move', 9);
        expect(allowed).toBe(true);
    });

    it('blocks Free user over move limit', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({ isVip: false }));
        const { result } = renderHook(() => useFeatureLimit());

        const allowed = await result.current.checkLimit('move', 10);
        expect(allowed).toBe(false);
        expect(Alert.alert).toHaveBeenCalledWith(
            "达到限制",
            expect.stringContaining("免费版最多只能添加 10 个动作"),
            expect.any(Array)
        );
    });

    it('blocks Free user over session limit', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({ isVip: false }));
        const { result } = renderHook(() => useFeatureLimit());

        // Limit is 3 for sessions
        const allowed = await result.current.checkLimit('session', 3);
        expect(allowed).toBe(false);
        expect(Alert.alert).toHaveBeenCalledWith(
            "达到限制",
            expect.stringContaining("免费版每月限 3 个课程"),
            expect.any(Array)
        );
    });

    it('navigates to subscription on alert action', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({ isVip: false }));
        const { result } = renderHook(() => useFeatureLimit());

        await result.current.checkLimit('session', 3);

        // Simulate pressing the "Go to Upgrade" button
        const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
        const buttons = alertCall[2];
        const upgradeButton = buttons.find((b: any) => b.text === "去升级");

        upgradeButton.onPress();
        expect(router.push).toHaveBeenCalledWith('/profile/subscription' as any);
    });
});
