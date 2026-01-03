
// Mock expo-router
jest.mock('expo-router', () => ({
    router: {
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
    },
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
    }),
    useLocalSearchParams: jest.fn(() => ({})),
}));

// Mock expo-symbols
jest.mock('expo-symbols', () => ({
    SymbolView: ({ name, tintColor }) => {
        const { View } = require('react-native');
        return <View testID={`symbol-${name}`} style={{ backgroundColor: tintColor }} />;
    },
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
    const { View } = require('react-native');
    return {
        Ionicons: ({ name, color }) => <View testID={`icon-${name}`} style={{ backgroundColor: color }} />,
        MaterialIcons: ({ name, color }) => <View testID={`icon-${name}`} style={{ backgroundColor: color }} />,
    };
});

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
    impactAsync: jest.fn(),
    notificationAsync: jest.fn(),
    selectionAsync: jest.fn(),
    ImpactFeedbackStyle: {
        Light: 'light',
        Medium: 'medium',
        Heavy: 'heavy',
    },
}));
