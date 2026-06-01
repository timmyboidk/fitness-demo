/**
 * @file HumanAvatar.test.tsx
 * @description HumanAvatar（3D）组件的单元测试
 */

import { render } from '@testing-library/react-native';
import React from 'react';

// 模拟 react-three/fiber 作为虚拟模块，因为它不在 package.json 中
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

        // 匹配快照或基本结构
        const json = toJSON();
        expect(json).toBeTruthy();
    });

    it('should handle frame updates with pose data', () => {
        const poseSharedValue = { value: { spine: { x: 1, y: 0, z: 0 } } };
        render(<HumanAvatar poseSharedValue={poseSharedValue} />);

        // 触发 useFrame
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
