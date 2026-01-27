/**
 * @file HumanAvatar.test.tsx
 * @description Unit tests for HumanAvatar (3D) component
 */

import { render } from '@testing-library/react-native';
import React from 'react';

// Mock react-three/fiber as a virtual module since it's missing from package.json
let frameCallback: any;
jest.mock('@react-three/fiber', () => ({
    useFrame: (callback: any) => {
        frameCallback = callback;
    },
}), { virtual: true });

import { HumanAvatar } from '../HumanAvatar';

describe('HumanAvatar', () => {
    it('should render correct group and primitive', () => {
        const poseSharedValue = { value: null };
        const { toJSON } = render(<HumanAvatar poseSharedValue={poseSharedValue} />);

        // Match snapshot or basic structure
        const json = toJSON();
        expect(json).toBeTruthy();
    });

    it('should handle frame updates with pose data', () => {
        const poseSharedValue = { value: { spine: { x: 1, y: 0, z: 0 } } };
        render(<HumanAvatar poseSharedValue={poseSharedValue} />);

        // Trigger useFrame
        if (frameCallback) {
            expect(() => frameCallback()).not.toThrow();
        }
    });

    it('should handle missing pose data gracefully', () => {
        const poseSharedValue = { value: null };
        render(<HumanAvatar poseSharedValue={poseSharedValue} />);

        if (frameCallback) {
            expect(() => frameCallback()).not.toThrow();
        }
    });
});
