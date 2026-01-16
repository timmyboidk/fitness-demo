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
