/**
 * @file IAPService.test.ts
 * @description Unit tests for IAPService - In-App Purchases service
 */


// Mock the expo-in-app-purchases module
jest.mock('expo-in-app-purchases', () => ({
    connectAsync: jest.fn(),
    disconnectAsync: jest.fn(),
    getProductsAsync: jest.fn(),
    purchaseItemAsync: jest.fn(),
    getPurchaseHistoryAsync: jest.fn(),
    setPurchaseListener: jest.fn(),
    finishTransactionAsync: jest.fn(),
    IAPResponseCode: { OK: 0, USER_CANCELED: 1, ERROR: 2 },
    IAPErrorCode: { UNKNOWN: 0 },
}));

// Variables to hold current mock instances
let mockInAppPurchases: any;
let iapService: any;

describe('IAPService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset the module cache to get a fresh singleton
        jest.resetModules();

        // Re-require the mock to get the current instance after reset
        mockInAppPurchases = require('expo-in-app-purchases');
        const IAPServiceModule = require('../IAPService');
        iapService = IAPServiceModule.iapService;
    });

    describe('getInstance', () => {
        it('should return the same instance', () => {
            const module = require('../IAPService');
            const instance1 = module.iapService;
            const instance2 = module.iapService;
            expect(instance1).toBe(instance2);
        });
    });

    describe('connect', () => {
        it('should connect to IAP successfully', async () => {
            (mockInAppPurchases.connectAsync as jest.Mock).mockResolvedValueOnce(undefined);

            await iapService.connect();

            expect(mockInAppPurchases.connectAsync).toHaveBeenCalled();
        });

        it('should not reconnect if already connected', async () => {
            (mockInAppPurchases.connectAsync as jest.Mock).mockResolvedValueOnce(undefined);

            await iapService.connect();
            await iapService.connect();

            expect(mockInAppPurchases.connectAsync).toHaveBeenCalledTimes(1);
        });

        it('should handle connection errors', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            (mockInAppPurchases.connectAsync as jest.Mock).mockRejectedValueOnce(new Error('Connection failed'));

            await iapService.connect();

            expect(consoleSpy).toHaveBeenCalledWith('IAP Connection Error:', expect.any(Error));
            consoleSpy.mockRestore();
        });
    });

    describe('getProducts', () => {
        it('should fetch products successfully', async () => {
            const mockProducts = [{ productId: 'monthly', price: '$5.99' }];
            (mockInAppPurchases.connectAsync as jest.Mock).mockResolvedValueOnce(undefined);
            (mockInAppPurchases.getProductsAsync as jest.Mock).mockResolvedValueOnce({ results: mockProducts });

            const products = await iapService.getProducts(['monthly']);

            expect(products).toEqual(mockProducts);
        });

        it('should return empty array on error', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            (mockInAppPurchases.connectAsync as jest.Mock).mockResolvedValueOnce(undefined);
            (mockInAppPurchases.getProductsAsync as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));

            const products = await iapService.getProducts();

            expect(products).toEqual([]);
            consoleSpy.mockRestore();
        });

        it('should return empty array if results is undefined', async () => {
            (mockInAppPurchases.connectAsync as jest.Mock).mockResolvedValueOnce(undefined);
            (mockInAppPurchases.getProductsAsync as jest.Mock).mockResolvedValueOnce({ results: undefined });

            const products = await iapService.getProducts();

            expect(products).toEqual([]);
        });
    });

    describe('purchase', () => {
        it('should initiate purchase successfully', async () => {
            (mockInAppPurchases.connectAsync as jest.Mock).mockResolvedValueOnce(undefined);
            (mockInAppPurchases.purchaseItemAsync as jest.Mock).mockResolvedValueOnce(undefined);

            await expect(iapService.purchase('monthly')).resolves.toBeUndefined();
            expect(mockInAppPurchases.purchaseItemAsync).toHaveBeenCalledWith('monthly');
        });

        it('should throw error on purchase failure', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            (mockInAppPurchases.connectAsync as jest.Mock).mockResolvedValueOnce(undefined);
            (mockInAppPurchases.purchaseItemAsync as jest.Mock).mockRejectedValueOnce(new Error('Purchase failed'));

            await expect(iapService.purchase('monthly')).rejects.toThrow('Purchase failed');
            consoleSpy.mockRestore();
        });
    });

    describe('getPurchaseHistory', () => {
        it('should fetch purchase history', async () => {
            const mockHistory = { results: [{ productId: 'monthly' }], responseCode: 0 };
            (mockInAppPurchases.connectAsync as jest.Mock).mockResolvedValueOnce(undefined);
            (mockInAppPurchases.getPurchaseHistoryAsync as jest.Mock).mockResolvedValueOnce(mockHistory);

            const history = await iapService.getPurchaseHistory();

            expect(history).toEqual(mockHistory);
        });

        it('should return cached history on second call', async () => {
            const mockHistory = { results: [{ productId: 'yearly' }], responseCode: 0 };
            (mockInAppPurchases.connectAsync as jest.Mock).mockResolvedValueOnce(undefined);
            (mockInAppPurchases.getPurchaseHistoryAsync as jest.Mock).mockResolvedValueOnce(mockHistory);

            await iapService.getPurchaseHistory();
            const history2 = await iapService.getPurchaseHistory();

            expect(mockInAppPurchases.getPurchaseHistoryAsync).toHaveBeenCalledTimes(1);
            expect(history2).toEqual(mockHistory);
        });

        it('should return error response on failure', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            (mockInAppPurchases.connectAsync as jest.Mock).mockResolvedValueOnce(undefined);
            (mockInAppPurchases.getPurchaseHistoryAsync as jest.Mock).mockRejectedValueOnce(new Error('History failed'));

            const history = await iapService.getPurchaseHistory();

            expect(history.results).toEqual([]);
            expect(history.responseCode).toBe(mockInAppPurchases.IAPResponseCode.ERROR);
            consoleSpy.mockRestore();
        });
    });

    describe('setPurchaseListener', () => {
        it('should register purchase listener and handle OK response', () => {
            const callback = jest.fn();
            const mockPurchase = { productId: 'monthly', acknowledged: false };

            iapService.setPurchaseListener(callback);

            // Get the registered listener and call it
            const registeredListener = (mockInAppPurchases.setPurchaseListener as jest.Mock).mock.calls[0][0];
            registeredListener({
                responseCode: mockInAppPurchases.IAPResponseCode.OK,
                results: [mockPurchase],
                errorCode: null
            });

            expect(mockInAppPurchases.finishTransactionAsync).toHaveBeenCalledWith(mockPurchase, true);
            expect(callback).toHaveBeenCalledWith(mockPurchase);
        });

        it('should skip already acknowledged purchases', () => {
            const callback = jest.fn();
            const mockPurchase = { productId: 'monthly', acknowledged: true };

            iapService.setPurchaseListener(callback);

            const registeredListener = (mockInAppPurchases.setPurchaseListener as jest.Mock).mock.calls[0][0];
            registeredListener({
                responseCode: mockInAppPurchases.IAPResponseCode.OK,
                results: [mockPurchase],
                errorCode: null
            });

            expect(mockInAppPurchases.finishTransactionAsync).not.toHaveBeenCalled();
            expect(callback).not.toHaveBeenCalled();
        });

        it('should handle user cancellation', () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            const callback = jest.fn();

            iapService.setPurchaseListener(callback);

            const registeredListener = (mockInAppPurchases.setPurchaseListener as jest.Mock).mock.calls[0][0];
            registeredListener({
                responseCode: mockInAppPurchases.IAPResponseCode.USER_CANCELED,
                results: [],
                errorCode: null
            });

            expect(consoleSpy).toHaveBeenCalledWith('User canceled the transaction');
            consoleSpy.mockRestore();
        });

        it('should handle error response', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
            const callback = jest.fn();

            iapService.setPurchaseListener(callback);

            const registeredListener = (mockInAppPurchases.setPurchaseListener as jest.Mock).mock.calls[0][0];
            registeredListener({
                responseCode: mockInAppPurchases.IAPResponseCode.ERROR,
                results: [],
                errorCode: 123
            });

            expect(consoleSpy).toHaveBeenCalledWith('Something went wrong with the purchase. Error code: 123');
            consoleSpy.mockRestore();
        });
    });

    describe('disconnect', () => {
        it('should disconnect when connected', async () => {
            (mockInAppPurchases.connectAsync as jest.Mock).mockResolvedValueOnce(undefined);
            (mockInAppPurchases.disconnectAsync as jest.Mock).mockResolvedValueOnce(undefined);

            await iapService.connect();
            await iapService.disconnect();

            expect(mockInAppPurchases.disconnectAsync).toHaveBeenCalled();
        });

        it('should not disconnect when not connected', async () => {
            await iapService.disconnect();

            expect(mockInAppPurchases.disconnectAsync).not.toHaveBeenCalled();
        });
    });

});
