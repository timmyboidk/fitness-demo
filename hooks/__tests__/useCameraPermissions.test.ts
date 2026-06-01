/**
 * @file useCameraPermissions.test.ts
 * @description useCameraPermissions hook 的单元测试（重新导出测试）
 */

import { useCameraPermissions as importedHook } from '../useCameraPermissions';

// 模拟 expo-camera
jest.mock('expo-camera', () => ({
    useCameraPermissions: jest.fn(() => [null, jest.fn()]),
}));

import { useCameraPermissions as expoCameraHook } from 'expo-camera';

describe('useCameraPermissions', () => {
    it('should re-export useCameraPermissions from expo-camera', () => {
        expect(importedHook).toBeDefined();
        importedHook(); // 执行它
        expect(expoCameraHook).toHaveBeenCalled();
    });
});
