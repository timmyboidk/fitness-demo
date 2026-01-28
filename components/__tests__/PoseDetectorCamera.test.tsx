import { render } from '@testing-library/react-native';
import React from 'react';
import { PoseDetectorCamera } from '../PoseDetectorCamera';

// Mock expo-camera
jest.mock('expo-camera', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        CameraView: jest.fn(({ facing, style }: any) => (
            <View testID="camera-view" style={style} accessibilityLabel={facing} />
        ))
    };
});

describe('PoseDetectorCamera', () => {
    it('renders correctly with default props', () => {
        const { getByTestId } = render(<PoseDetectorCamera />);
        const camera = getByTestId('camera-view');
        expect(camera).toBeTruthy();
        expect(camera.props.accessibilityLabel).toBe('back');
    });

    it('renders with front facing', () => {
        const { getByTestId } = render(<PoseDetectorCamera facing="front" />);
        const camera = getByTestId('camera-view');
        expect(camera.props.accessibilityLabel).toBe('front');
    });

    it('renders with onInferenceResult (no-op check)', () => {
        const fn = jest.fn();
        render(<PoseDetectorCamera onInferenceResult={fn} />);
        // Currently component doesn't use it, just checking it renders without crash
    });
});
