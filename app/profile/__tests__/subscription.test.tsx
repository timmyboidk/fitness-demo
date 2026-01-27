import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { Alert, useColorScheme } from 'react-native';
import { iapService } from '../../../services/IAPService';
import SubscriptionScreen from '../subscription';

// Mock services
jest.mock('../../../services/IAPService', () => ({
    iapService: {
        connect: jest.fn(),
        disconnect: jest.fn(),
        getProducts: jest.fn(),
        purchase: jest.fn(),
        setPurchaseListener: jest.fn(),
    }
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
    router: { back: jest.fn(), push: jest.fn() },
    Stack: { Screen: () => null },
}));

// Mock expo-in-app-purchases
jest.mock('expo-in-app-purchases', () => ({
    // Empty
}));

// Mock icons
jest.mock('@expo/vector-icons', () => ({
    Ionicons: () => null,
    MaterialCommunityIcons: () => null,
}));

// Mock safe area
jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: ({ children }: any) => {
        const { View } = require('react-native');
        return <View>{children}</View>;
    },
}));

// Mock react-native's useColorScheme
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
    default: jest.fn(),
}));

jest.spyOn(Alert, 'alert');
jest.setTimeout(15000);

describe('SubscriptionScreen - Branch Expansion', () => {
    const mockProducts = [
        { productId: 'monthly', title: 'Monthly Plan', price: '¥30', priceAmountMicros: 30000000 },
        { productId: 'yearly', title: 'Yearly Plan', price: '¥300', priceAmountMicros: 300000000 },
        { productId: 'quarterly', title: 'Quarterly Plan', price: '¥80', priceAmountMicros: 80000000 }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useColorScheme as jest.Mock).mockReturnValue('light');
        (iapService.getProducts as jest.Mock).mockResolvedValue(mockProducts);
        (iapService.connect as jest.Mock).mockResolvedValue(undefined);
    });

    it('renders light mode correctly with multiple products', async () => {
        const { getByText, getAllByText } = render(<SubscriptionScreen />);

        await waitFor(() => {
            expect(getByText('Yearly Plan')).toBeTruthy();
            expect(getByText('Monthly Plan')).toBeTruthy();
            expect(getByText('Quarterly Plan')).toBeTruthy();
            expect(getByText('PRO 会员')).toBeTruthy();
        });

        // Verify sorting (yearly at the end because micros is highest)
        // Verify period labeling logic
        expect(getByText('/年')).toBeTruthy();
        expect(getByText('/3个月')).toBeTruthy();
        expect(getByText('/月')).toBeTruthy();
    });

    it('renders dark mode correctly', async () => {
        (useColorScheme as jest.Mock).mockReturnValue('dark');
        const { getByText } = render(<SubscriptionScreen />);
        await waitFor(() => {
            expect(getByText('PRO 会员')).toBeTruthy();
        });
    });

    it('handles IAP connection failure', async () => {
        (iapService.connect as jest.Mock).mockRejectedValue(new Error('Connection failed'));
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        render(<SubscriptionScreen />);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith("IAP Init failed", expect.any(Error));
        });
        consoleSpy.mockRestore();
    });

    it('renders static plans if no products returned', async () => {
        (iapService.getProducts as jest.Mock).mockResolvedValue([]);
        const { getByText } = render(<SubscriptionScreen />);
        await waitFor(() => {
            expect(getByText('月度会员')).toBeTruthy();
            expect(getByText('年度会员 (省20%)')).toBeTruthy();
        });
    });

    it('handles successful purchase via listener', async () => {
        let listenerCallback: any;
        (iapService.setPurchaseListener as jest.Mock).mockImplementation((cb) => {
            listenerCallback = cb;
        });

        render(<SubscriptionScreen />);

        await waitFor(() => expect(listenerCallback).toBeDefined());

        listenerCallback({ transactionReceipt: 'mock-receipt' });

        expect(Alert.alert).toHaveBeenCalledWith("恭喜", "您已成功升级为 VIP 会员！", expect.any(Array));

        // Trigger onPress
        const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
        buttons[0].onPress();
        expect(router.back).toHaveBeenCalled();
    });

    describe('handleUpgrade branches', () => {
        it('redirects to login if not authenticated', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
            const { getByText, findByText } = render(<SubscriptionScreen />);

            const yearlyButton = await findByText('Yearly Plan');
            fireEvent.press(yearlyButton);

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith("提示", "请先登录");
                expect(router.push).toHaveBeenCalledWith('/(auth)/login');
            });
        });

        it('handles user cancellation', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue('{"id":"1"}');
            (iapService.purchase as jest.Mock).mockRejectedValue(new Error('User canceled the transaction'));

            const { getByText, findByText } = render(<SubscriptionScreen />);
            const yearlyButton = await findByText('Yearly Plan');
            fireEvent.press(yearlyButton);

            await waitFor(() => {
                expect(iapService.purchase).toHaveBeenCalled();
                expect(Alert.alert).not.toHaveBeenCalled();
            });
        });

        it('handles general purchase error', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue('{"id":"1"}');
            (iapService.purchase as jest.Mock).mockRejectedValue(new Error('Payment Refused'));

            const { getByText, findByText } = render(<SubscriptionScreen />);
            const yearlyButton = await findByText('Yearly Plan');
            fireEvent.press(yearlyButton);

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith("支付失败", "无法完成支付，请重试");
            });
        });
    });
});
