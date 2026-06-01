
// 模拟 expo-router
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

// 模拟 expo-symbols
jest.mock('expo-symbols', () => ({
    SymbolView: ({ name, tintColor }) => {
        const { View } = require('react-native');
        return <View testID={`symbol-${name}`} style={{ backgroundColor: tintColor }} />;
    },
}));

// 模拟 @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
    const { View } = require('react-native');
    return {
        Ionicons: ({ name, color }) => <View testID={`icon-${name}`} style={{ backgroundColor: color }} />,
        MaterialIcons: ({ name, color }) => <View testID={`icon-${name}`} style={{ backgroundColor: color }} />,
    };
});

// 模拟 expo-haptics
jest.mock('expo-haptics', () => ({
    impactAsync: jest.fn(),
    notificationAsync: jest.fn(),
    selectionAsync: jest.fn(),
    ImpactFeedbackStyle: {
        Light: 'light',
        Medium: 'medium',
        Heavy: 'heavy',
    },
    NotificationFeedbackType: {
        Success: 'success',
        Warning: 'warning',
        Error: 'error',
    },
}));

// 模拟 expo-linear-gradient
jest.mock('expo-linear-gradient', () => {
    const { View } = require('react-native');
    return {
        LinearGradient: ({ children, ...props }) => (
            <View testID="linear-gradient" {...props}>{children}</View>
        ),
    };
});

// 模拟 @expo-google-fonts/inter
jest.mock('@expo-google-fonts/inter', () => ({
    useFonts: jest.fn(() => [true]),
    Inter_400Regular: 'Inter_400Regular',
    Inter_500Medium: 'Inter_500Medium',
    Inter_600SemiBold: 'Inter_600SemiBold',
    Inter_700Bold: 'Inter_700Bold',
    Inter_900Black: 'Inter_900Black',
}));

// 模拟 expo-splash-screen
jest.mock('expo-splash-screen', () => ({
    preventAutoHideAsync: jest.fn(),
    hideAsync: jest.fn(),
}));

// 模拟 react-native-worklets-core
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

// 模拟 vision-camera-resize-plugin
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

// 模拟 react-native-reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { };
    // 添加 FadeInDown 模拟
    Reanimated.FadeInDown = {
        delay: jest.fn(() => ({
            duration: jest.fn(() => ({
                springify: jest.fn(() => 'mock-animation'),
            })),
        })),
    };
    return Reanimated;
});

// 模拟 onnxruntime-react-native
jest.mock('onnxruntime-react-native', () => ({
    InferenceSession: {
        create: jest.fn(() => Promise.resolve({
            run: jest.fn(),
        })),
    },
}));

// 模拟 expo-camera
jest.mock('expo-camera', () => ({
    useCameraPermissions: jest.fn(() => [
        { granted: true, status: 'granted', canAskAgain: true, expires: 'never' },
        jest.fn()
    ]),
}));

// 模拟 react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// 模拟 @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
