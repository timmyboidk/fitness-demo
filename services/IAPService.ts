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
            console.error('IAP Connection Error:', error);
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
            console.error('Error fetching products', error);
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
            console.error('Purchase failed', error);
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
            console.error('Error fetching history', error);
            return {
                results: [],
                responseCode: InAppPurchases.IAPResponseCode.ERROR,
                errorCode: InAppPurchases.IAPErrorCode.UNKNOWN,
            }; // Return empty on error
        }
    }

    setPurchaseListener(callback: (purchase: InAppPurchases.InAppPurchase) => void) {
        InAppPurchases.setPurchaseListener(({ responseCode, results, errorCode }) => {
            if (responseCode === InAppPurchases.IAPResponseCode.OK && results) {
                results.forEach(purchase => {
                    if (!purchase.acknowledged) {
                        InAppPurchases.finishTransactionAsync(purchase, true); // Consume for consumable, false for non-consumable usually
                        callback(purchase);
                    }
                });
            } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
                console.log('User canceled the transaction');
            } else {
                console.warn(`Something went wrong with the purchase. Error code: ${errorCode}`);
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
