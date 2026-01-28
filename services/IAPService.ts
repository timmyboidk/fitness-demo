import * as InAppPurchases from 'expo-in-app-purchases';
import { Platform } from 'react-native';

const ITEM_IDS = Platform.select({
    ios: ['monthly', 'quarterly', 'yearly'],
    android: ['monthly', 'quarterly', 'yearly'],
});

class IAPService {
    private static instance: IAPService;
    private connected: boolean = false;
    private history: InAppPurchases.IAPQueryResponse<InAppPurchases.InAppPurchase> | null = null;

    private constructor() { }

    static getInstance(): IAPService {
        if (!IAPService.instance) {
            IAPService.instance = new IAPService();
        }
        return IAPService.instance;
    }

    async connect(): Promise<void> {
        if (this.connected) return;
        try {
            await InAppPurchases.connectAsync();
            this.connected = true;
        } catch (error) {
            console.error('IAP 连接错误:', error);
        }
    }

    async getProducts(itemIds: string[] = ITEM_IDS!): Promise<InAppPurchases.IAPItemDetails[]> {
        if (!this.connected) {
            await this.connect();
        }

        try {
            const { results } = await InAppPurchases.getProductsAsync(itemIds);
            return results || [];
        } catch (error) {
            console.error('获取产品信息失败', error);
            return [];
        }
    }

    async purchase(productId: string): Promise<void> {
        if (!this.connected) {
            await this.connect();
        }

        try {
            await InAppPurchases.purchaseItemAsync(productId);
        } catch (error) {
            console.error('购买失败', error);
            throw error;
        }
    }

    async getPurchaseHistory(): Promise<InAppPurchases.IAPQueryResponse<InAppPurchases.InAppPurchase>> {
        if (!this.connected) {
            await this.connect();
        }

        if (this.history) return this.history;

        try {
            this.history = await InAppPurchases.getPurchaseHistoryAsync();
            return this.history;
        } catch (error) {
            console.error('获取购买历史失败', error);
            return {
                results: [],
                responseCode: InAppPurchases.IAPResponseCode.ERROR,
                errorCode: InAppPurchases.IAPErrorCode.UNKNOWN,
            }; // 出错时返回空结果
        }
    }

    setPurchaseListener(callback: (purchase: InAppPurchases.InAppPurchase) => void) {
        InAppPurchases.setPurchaseListener(({ responseCode, results, errorCode }) => {
            if (responseCode === InAppPurchases.IAPResponseCode.OK && results) {
                results.forEach(purchase => {
                    if (!purchase.acknowledged) {
                        InAppPurchases.finishTransactionAsync(purchase, true); // 消耗品传 true，非消耗品通常传 false
                        callback(purchase);
                    }
                });
            } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
                console.log('用户取消了交易');
            } else {
                console.warn(`购买过程中出错。错误代码: ${errorCode}`);
            }
        });
    }

    async disconnect() {
        if (this.connected) {
            await InAppPurchases.disconnectAsync();
            this.connected = false;
        }
    }
}

export const iapService = IAPService.getInstance();
