import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const client = axios.create({
    baseURL: 'http://10.0.0.169:8080',
    timeout: 10000,
});

// Request Interceptor: Attach Token
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

// Response Interceptor: Handle 401
client.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Handle logout or refresh logic
            await SecureStore.deleteItemAsync('user_token');
        }
        return Promise.reject(error);
    }
);

export default client;
