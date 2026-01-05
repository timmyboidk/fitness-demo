import { libraryStore } from '@/store/library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import LoginScreen from '../(auth)/login';
import MovesScreen from '../(tabs)/index';

// --- Integrated Test Mocks ---

// Mock fetch globally
global.fetch = jest.fn();

// Mock Alert.alert
jest.spyOn(Alert, 'alert');

// Mock AsyncStorage correctly for integrated tests
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-safe-area-context for UI rendering
jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    SafeAreaProvider: ({ children }: any) => children,
}));

describe('Full Integrated Application Flow', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        // Totally reset the implementation to avoid leakage
        (global.fetch as jest.Mock).mockReset();
    });

    /**
     * WORKFLOW 1: Authentication Integration
     * Tests UI -> Service -> Fetch -> Storage -> Router
     */
    describe('Authentication Workflow', () => {
        it('should log in successfully with valid phone and OTP', async () => {
            // Given: API will return success
            const mockUser = { id: 'u1', nickname: 'BetaTester', token: 'jwt-123' };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => ({ success: true, user: mockUser }),
            });

            // When: Render Login screen
            const { getByPlaceholderText, getByText } = render(<LoginScreen />);

            // And: User interacts
            fireEvent.changeText(getByPlaceholderText('手机号码'), '13812345678');
            fireEvent.press(getByText('获取验证码'));

            // Then: Immediate feedback
            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith("提示", expect.stringContaining("验证码已发送"));
            });

            // And: User enters OTP
            fireEvent.changeText(getByPlaceholderText('验证码'), '1234');
            fireEvent.press(getByText('登 录'));

            // Then: Verify Integrated Side Effects
            await waitFor(() => {
                // 1. Network called correctly
                expect(global.fetch).toHaveBeenCalledWith(
                    expect.stringContaining('/api/auth'),
                    expect.objectContaining({ method: 'POST' })
                );
                // 2. Data persisted
                expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
                // 3. Success Feedback
                expect(Alert.alert).toHaveBeenCalledWith("登录成功", expect.any(String), expect.any(Array));
            });

            // And: User confirms alert
            const successCall = (Alert.alert as jest.Mock).mock.calls.find(c => c[0] === "登录成功");
            successCall[2][0].onPress();

            // Then: Navigates to main app
            expect(router.replace).toHaveBeenCalledWith('/(tabs)');
        });

        it('should handle API errors gracefully', async () => {
            // Given: API returns an error
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => ({ success: false, error: 'Wrong code' }),
            });

            const { getByPlaceholderText, getByText } = render(<LoginScreen />);

            // When: User attempts login
            fireEvent.changeText(getByPlaceholderText('手机号码'), '13812345678');
            fireEvent.changeText(getByPlaceholderText('验证码'), '0000');
            fireEvent.press(getByText('登 录'));

            // Then: App shows the error returned from API
            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith("登录失败", "Wrong code");
            });
        });
    });

    /**
     * WORKFLOW 2: Content Synchronization Integration
     * Tests Store -> Service -> Fetch -> UI Update
     */
    describe('Library Synchronization Workflow', () => {
        it('should sync moves from API and update the UI accordingly', async () => {
            // Given: API has specific data
            const mockMoves = [
                { id: 'm_int', name: 'Integrated Move', level: 'Beginner', icon: 'figure.run', isVisible: true },
            ];
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => ({ moves: mockMoves, sessions: [] }),
            });

            // When: Render Moves screen (subscribed to libraryStore)
            const { findByText, queryByText } = render(<MovesScreen />);

            // Initially, it should NOT have the "Integrated Move" (from INITIAL_MOVES)
            expect(queryByText('Integrated Move')).toBeNull();

            // And: We trigger the sync flow
            await act(async () => {
                await libraryStore.sync();
            });

            // Then: UI should discover the new data through the store's notification
            const moveUI = await findByText('Integrated Move');
            expect(moveUI).toBeTruthy();

            // And: Verify network was called
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/library'));
        });

        it('should allow user to toggle visibility which updates both store and UI', async () => {
            // Given: Store has a move
            libraryStore.moves = [{ id: 't1', name: 'Wait to Remove', level: '1', icon: 'figure', isVisible: true }];
            libraryStore.notify();

            const { getByTestId, queryByText } = render(<MovesScreen />);
            expect(queryByText('Wait to Remove')).toBeTruthy();

            // When: User clicks remove (interactions with child component MoveItem)
            const removeBtn = getByTestId('symbol-minus.circle.fill');
            fireEvent.press(removeBtn);

            // Then: UI reflects the change (MoveItem filtered out in Screen)
            await waitFor(() => {
                expect(queryByText('Wait to Remove')).toBeNull();
            });

            // And: Store reflects the change
            expect(libraryStore.getMoves().find(m => m.id === 't1')?.isVisible).toBe(false);
        });
    });
});
