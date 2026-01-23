import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook } from '@testing-library/react-native';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { useFeatureLimit } from '../useFeatureLimit';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('expo-router');
jest.spyOn(Alert, 'alert');

describe('useFeatureLimit', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should allow if user is VIP', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({ isVip: true }));

        const { result } = renderHook(() => useFeatureLimit());
        const allowed = await result.current.checkLimit('move', 100); // Over limit

        expect(allowed).toBe(true);
        expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('should allow if count is under limit (Move)', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({ isVip: false }));

        const { result } = renderHook(() => useFeatureLimit());
        const allowed = await result.current.checkLimit('move', 5); // Limit is 10

        expect(allowed).toBe(true);
        expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('should block if count reached limit (Move)', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({ isVip: false }));

        const { result } = renderHook(() => useFeatureLimit());
        const allowed = await result.current.checkLimit('move', 10); // Limit is 10

        expect(allowed).toBe(false);
        expect(Alert.alert).toHaveBeenCalledWith(
            "达到限制",
            expect.stringContaining("免费版最多只能添加 10 个动作"),
            expect.any(Array)
        );
    });

    it('should navigate to subscription on upgrade press', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({ isVip: false }));

        // Mock Alert.alert to execute the "Go Upgrade" button callback immediately
        (Alert.alert as jest.Mock).mockImplementation((title, msg, buttons) => {
            const upgradeButton = buttons.find((b: any) => b.text === "去升级");
            if (upgradeButton) {
                upgradeButton.onPress();
            }
        });

        const { result } = renderHook(() => useFeatureLimit());
        await result.current.checkLimit('move', 10);

        expect(router.push).toHaveBeenCalledWith('/profile/subscription');
    });

    it('should handle session limits', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({ isVip: false }));

        const { result } = renderHook(() => useFeatureLimit());
        const allowed = await result.current.checkLimit('session', 3); // Limit is 3

        expect(allowed).toBe(false);
        expect(Alert.alert).toHaveBeenCalledWith(
            "达到限制",
            expect.stringContaining("免费版每月限 3 个课程"),
            expect.any(Array)
        );
    });

    it('should allow if no user found (guest)', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

        const { result } = renderHook(() => useFeatureLimit());
        const allowed = await result.current.checkLimit('move', 999);

        expect(allowed).toBe(true);
    });
});
