import { Platform } from 'react-native';

// 尝试动态加载 IAP 模块，避免在不支持的环境中（如 Web 或某些 Expo Go 版本）崩溃
let InAppPurchases: any = null;
try {
    if (Platform.OS !== 'web') {
        InAppPurchases = require('expo-in-app-purchases');
    }
} catch (error) {
    console.warn('ExpoInAppPurchases 模块未找到，IAP 功能将不可用。');
}

const ITEM_IDS = Platform.select({
    ios: ['monthly', 'quarterly', 'yearly'],
    android: ['monthly', 'quarterly', 'yearly'],
});

class IAPService {
    private static instance: IAPService;
    private connected: boolean = false;
    private history: any = null;

    private constructor() { }

    static getInstance(): IAPService {
        if (!IAPService.instance) {
            IAPService.instance = new IAPService();
        }
        return IAPService.instance;
    }

    private isAvailable(): boolean {
        return !!InAppPurchases;
    }

    async connect(): Promise<void> {
        if (this.connected) return;
        if (!this.isAvailable()) {
            console.warn('IAP service is not available (native module missing).');
            return;
        }

        try {
            if (InAppPurchases.connectAsync) {
                await InAppPurchases.connectAsync();
                this.connected = true;
            }
        } catch (error) {
            console.error('IAP 连接错误:', error);
        }
    }

    async getProducts(itemIds: string[] = ITEM_IDS!): Promise<any[]> {
        if (!this.isAvailable() || !InAppPurchases.getProductsAsync) {
            return [];
        }

        if (!this.connected) {
            await this.connect();
        }

        if (!this.connected) return [];

        try {
            const { results } = await InAppPurchases.getProductsAsync(itemIds);
            return results || [];
        } catch (error) {
            console.error('获取产品信息失败', error);
            return [];
        }
    }

    async purchase(productId: string): Promise<void> {
        if (!this.isAvailable() || !InAppPurchases.purchaseItemAsync) {
            throw new Error('IAP is not supported on this platform');
        }

        if (!this.connected) {
            await this.connect();
        }

        if (!this.connected) throw new Error('IAP service not connected');

        try {
            await InAppPurchases.purchaseItemAsync(productId);
        } catch (error) {
            console.error('购买失败', error);
            throw error;
        }
    }

    async getPurchaseHistory(): Promise<any> {
        const errorResponse = {
            results: [],
            responseCode: 2, // ERROR
            errorCode: 0, // UNKNOWN
        };

        if (!this.isAvailable() || !InAppPurchases.getPurchaseHistoryAsync) {
            return errorResponse;
        }

        if (!this.connected) {
            await this.connect();
        }

        if (this.history) return this.history;
        if (!this.connected) return errorResponse;

        try {
            this.history = await InAppPurchases.getPurchaseHistoryAsync();
            return this.history;
        } catch (error) {
            console.error('获取购买历史失败', error);
            return errorResponse;
        }
    }

    setPurchaseListener(callback: (purchase: any) => void) {
        if (!this.isAvailable() || !InAppPurchases.setPurchaseListener) {
            return;
        }

        InAppPurchases.setPurchaseListener(({ responseCode, results, errorCode }: any) => {
            if (responseCode === InAppPurchases.IAPResponseCode?.OK && results) {
                results.forEach((purchase: any) => {
                    if (!purchase.acknowledged) {
                        InAppPurchases.finishTransactionAsync(purchase, true);
                        callback(purchase);
                    }
                });
            } else if (responseCode === InAppPurchases.IAPResponseCode?.USER_CANCELED) {
                console.log('用户取消了交易');
            } else {
                console.warn(`购买过程中出错。错误代码: ${errorCode}`);
            }
        });
    }

    async disconnect() {
        if (this.connected && InAppPurchases && InAppPurchases.disconnectAsync) {
            await InAppPurchases.disconnectAsync();
            this.connected = false;
        }
    }
}

export const iapService = IAPService.getInstance();
