
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

// Mock react-native-worklets-core
jest.mock('react-native-worklets-core', () => ({
    Worklets: {
        createRunOnJS: jest.fn((fn) => fn),
        createSharedValue: jest.fn((val) => ({ value: val })),
    },
}));

jest.mock('react-native-vision-camera', () => {
    const { View } = require('react-native');
    const Camera = jest.fn(({ device }) => <View testID={`camera-${device?.position}`} />);
    Camera.requestCameraPermission = jest.fn(() => Promise.resolve('granted'));

    return {
        Camera: Camera,
        useCameraDevice: jest.fn((position) => ({
            id: 'mock-device-id',
            position: position,
            hasFlash: true,
            isActive: true,
        })),
        useCameraPermission: jest.fn(() => ({ hasPermission: true, requestPermission: jest.fn() })),
        useFrameProcessor: jest.fn((fn) => fn),
        VisionCameraProxy: {
            initFrameProcessorPlugin: jest.fn(),
        },
    };
});

// Mock vision-camera-resize-plugin
jest.mock('vision-camera-resize-plugin', () => ({
    useResizePlugin: jest.fn(() => ({
        resize: jest.fn(() => ({
            width: 192,
            height: 192,
            data: new Uint8Array(),
            pixelFormat: 'rgb',
        })),
    })),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { };
    return Reanimated;
});

// Mock onnxruntime-react-native
jest.mock('onnxruntime-react-native', () => ({
    InferenceSession: {
        create: jest.fn(() => Promise.resolve({
            run: jest.fn(),
        })),
    },
}));

// Mock expo-camera
jest.mock('expo-camera', () => ({
    useCameraPermissions: jest.fn(() => [
        { granted: true, status: 'granted', canAskAgain: true, expires: 'never' },
        jest.fn()
    ]),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
