/**
 * @file client.ts
 * @description API 客户端配置。
 * 基于 Axios 封装，统一处理 BaseURL、超时设置。
 * 集成 Request 拦截器自动注入 JWT Token。
 * 集成 Response 拦截器处理全局错误 (如 401 未授权)。
 */

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// 创建 Axios 实例
const client = axios.create({
    baseURL: 'http://10.0.0.169:8080', // 开发环境后端地址
    timeout: 10000, // 请求超时时间 10s
});

// --- MOCK ADAPTER (Frontend Demo Mode) ---
// 由于后端服务未启动，此处拦截所有请求并返回模拟数据。
client.interceptors.request.use(async (config) => {
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 600));

    const { url, method } = config;
    console.log(`[MockAPI] ${method?.toUpperCase()} ${url}`);

    // 1. Auth Login (POST /api/auth)
    if (url === '/api/auth' && method === 'post') {
        const { phone, code, email, password } = config.data || {};

        // Debug User Logic (9999 / 0000)
        if ((phone === '9999' && code === '0000') || (email === '9999' && password === '0000')) {
            const debugUser = {
                id: 'debug_user_9999',
                nickname: 'Debug User',
                avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=400&auto=format&fit=crop',
                token: 'debug_token_9999',
                isVip: false // Start as free user to test upgrade
            };
            throw {
                response: {
                    status: 200,
                    data: { success: true, data: debugUser, message: "Debug Login Success" }
                }
            };
        }

        const mockUser = {
            id: 'mock_user_001',
            nickname: 'Demo User',
            avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop',
            token: 'mock_jwt_token_12345',
            isVip: false
        };
        throw {
            response: {
                status: 200,
                data: { success: true, data: mockUser, message: "Mock Login Success" }
            }
        };
    }

    // 2. Library Sync (GET /api/library)
    if (url === '/api/library' && method === 'get') {
        const mockMoves = [
            { id: 'm1', name: '波比跳 (Burpees)', level: 'Hard', duration: 15, calories: 20, isVisible: true },
            { id: 'm2', name: '深蹲 (Squats)', level: 'Medium', duration: 20, calories: 15, isVisible: true },
            { id: 'm3', name: '俯卧撑 (Pushups)', level: 'Medium', duration: 20, calories: 12, isVisible: false }
        ];
        throw {
            response: {
                status: 200,
                data: { success: true, data: { moves: mockMoves, sessions: [] } }
            }
        };
    }

    // 3. AI Scoring (POST /api/ai/score)
    if (url === '/api/ai/score' && method === 'post') {
        throw {
            response: {
                status: 200,
                data: { success: true, score: 92, feedback: ['动作标准', '节奏很好'] }
            }
        };
    }

    // 4. Analytics (POST /api/data/collect)
    if (url?.includes('/api/data/collect')) {
        throw { response: { status: 200, data: { success: true } } };
    }

    // 5. Model Updates (GET /api/core/models/latest)
    if (url?.includes('/api/core/models/latest')) {
        throw { response: { status: 200, data: { success: true, data: null } } };
    }

    // 6. Onboarding (POST /api/auth/onboarding)
    if (url?.includes('/api/auth/onboarding')) {
        throw { response: { status: 200, data: { success: true } } };
    }

    // Default: Mock 404 for unknown endpoints to avoid hanging
    console.warn(`[MockAPI] Unhandled endpoint: ${url}`);
    throw { response: { status: 404, data: { success: false, message: "Mock Endpoint Not Found" } } };
}, error => Promise.reject(error));

/**
 * 请求拦截器
 * 自动从 SecureStore 获取 Token 并添加到 Authorization 头
 */
client.interceptors.request.use(async (config) => {
    try {
        const token = await SecureStore.getItemAsync('user_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (e) {
        console.error('Error reading token', e);
    }
    return config;
});

/**
 * 响应拦截器
 * 全局处理 API 响应错误
 * 401 Unauthorized: 自动清除本地 Token (触发登出逻辑)
 */
client.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token 过期或无效，执行登出清理
            await SecureStore.deleteItemAsync('user_token');
        }
        return Promise.reject(error);
    }
);

export default client;
