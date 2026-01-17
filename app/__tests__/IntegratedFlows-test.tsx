import { libraryStore } from '@/store/library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import LoginScreen from '../(auth)/login';
import MovesScreen from '../(tabs)/index';
import client from '../../services/api/client';

// --- 集成测试 Mock ---

// Mock client (模拟客户端)
jest.mock('../../services/api/client');
const mockedClient = client as jest.Mocked<typeof client>;

// Mock Alert.alert (模拟弹窗)
jest.spyOn(Alert, 'alert');

// 为集成测试正确 mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-safe-area-context 用于 UI 渲染
jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    SafeAreaProvider: ({ children }: any) => children,
    SafeAreaView: ({ children }: any) => children,
}));

describe('Full Integrated Application Flow', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        mockedClient.post.mockReset();
        mockedClient.get.mockReset();
    });

    /**
     * 工作流 1: 认证集成
     * 测试 UI -> Service -> Fetch -> Storage -> Router
     */
    describe('Authentication Workflow', () => {
        it('should log in successfully with valid phone and OTP', async () => {
            // 给定: API 将返回成功
            const mockUser = { id: 'u1', nickname: 'BetaTester', token: 'jwt-123' };
            mockedClient.post.mockResolvedValueOnce({
                data: { success: true, data: { id: 'u1', nickname: 'BetaTester', token: 'jwt-123' } },
            });

            // 当: 渲染登录屏幕时
            const { getByPlaceholderText, getByText } = render(<LoginScreen />);

            // 并且: 用户交互
            fireEvent.changeText(getByPlaceholderText('手机号码'), '13812345678');
            fireEvent.press(getByText('获取验证码'));

            // 那么: 立即反馈
            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith("提示", expect.stringContaining("验证码已发送"));
            });

            // 并且: 用户输入验证码
            fireEvent.changeText(getByPlaceholderText('验证码'), '1234');
            fireEvent.press(getByText('登 录'));

            // 那么: 验证集成副作用
            await waitFor(() => {
                // 1. 网络调用正确
                expect(mockedClient.post).toHaveBeenCalledWith(
                    '/api/auth',
                    expect.objectContaining({ type: 'login_phone' })
                );
                // 2. 数据持久化
                expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
                // 3. 成功反馈
                expect(Alert.alert).toHaveBeenCalledWith("登录成功", expect.any(String), expect.any(Array));
            });

            // 并且: 用户确认弹窗
            const successCall = (Alert.alert as jest.Mock).mock.calls.find(c => c[0] === "登录成功");
            successCall[2][0].onPress();

            // 那么: 导航到主应用
            expect(router.replace).toHaveBeenCalledWith('/(tabs)');
        });

        it('should handle API errors gracefully', async () => {
            // 给定: API 返回错误
            mockedClient.post.mockResolvedValueOnce({
                data: { success: false, message: 'Wrong code' },
            });

            const { getByPlaceholderText, getByText } = render(<LoginScreen />);

            // 当: 用户尝试登录
            fireEvent.changeText(getByPlaceholderText('手机号码'), '13812345678');
            fireEvent.changeText(getByPlaceholderText('验证码'), '0000');
            fireEvent.press(getByText('登 录'));

            // 那么: 应用显示 API 返回的错误
            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith("登录失败", "Wrong code");
            });
        });
    });

    /**
     * 工作流 2: 内容同步集成
     * 测试 Store -> Service -> Fetch -> UI Update
     */
    describe('Library Synchronization Workflow', () => {
        it('should sync moves from API and update the UI accordingly', async () => {
            // 给定: API 具有特定数据
            const mockMoves = [
                { id: 'm_int', name: 'Integrated Move', level: 'Beginner', icon: 'figure.run', isVisible: true },
            ];
            mockedClient.get.mockResolvedValueOnce({
                data: { success: true, data: { moves: mockMoves, sessions: [] } },
            });

            // 当: 渲染动作屏幕 (订阅 libraryStore)
            const { findByText, queryByText } = render(<MovesScreen />);

            // 初始状态，不应该有 "Integrated Move" (来自 INITIAL_MOVES)
            expect(queryByText('Integrated Move')).toBeNull();

            // 并且: 我们触发同步流
            await act(async () => {
                await libraryStore.sync();
            });

            // 那么: UI 应该通过 store 通知发现新数据
            const moveUI = await findByText('Integrated Move');
            expect(moveUI).toBeTruthy();

            // 并且: 验证网络被调用
            expect(mockedClient.get).toHaveBeenCalledWith('/api/library', expect.any(Object));
        });

        it('should allow user to toggle visibility which updates both store and UI', async () => {
            // 给定: Store 有一个动作
            libraryStore.moves = [{ id: 't1', name: 'Wait to Remove', level: '1', icon: 'figure', isVisible: true }];
            libraryStore.notify();

            const { getByTestId, queryByText } = render(<MovesScreen />);
            expect(queryByText('Wait to Remove')).toBeTruthy();

            // 当: 用户点击移除 (与子组件 MoveItem 交互)
            const removeBtn = getByTestId('symbol-minus.circle.fill');
            fireEvent.press(removeBtn);

            // 那么: UI 反映更改 (MoveItem 在屏幕中被过滤掉)
            await waitFor(() => {
                expect(queryByText('Wait to Remove')).toBeNull();
            });

            // 并且: Store 反映更改
            expect(libraryStore.getMoves().find(m => m.id === 't1')?.isVisible).toBe(false);
        });
    });
});
