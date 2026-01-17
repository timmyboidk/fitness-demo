import { render } from '@testing-library/react-native';
import React from 'react';
import { PoseDetectorCamera } from '../PoseDetectorCamera';

// Mock expo-camera
jest.mock('expo-camera', () => {
    const { View } = require('react-native');
    return {
        CameraView: (props: any) => <View testID="mock-camera-view" {...props} />,
    };
});

describe('PoseDetectorCamera', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders CameraView correctly', () => {
        const { getByTestId } = render(<PoseDetectorCamera />);
        expect(getByTestId('mock-camera-view')).toBeTruthy();
    });

    it('passes facing prop to CameraView', () => {
        const { getByTestId } = render(<PoseDetectorCamera facing="front" />);
        const camera = getByTestId('mock-camera-view');
        expect(camera.props.facing).toBe('front');
    });

    it('uses back facing by default', () => {
        const { getByTestId } = render(<PoseDetectorCamera />);
        const camera = getByTestId('mock-camera-view');
        expect(camera.props.facing).toBe('back');
    });
});

