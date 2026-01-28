/**
 * @file useCameraPermissions.test.ts
 * @description Unit tests for useCameraPermissions hook (re-export test)
 */

import { useCameraPermissions as importedHook } from '../useCameraPermissions';

// Mock expo-camera
jest.mock('expo-camera', () => ({
    useCameraPermissions: jest.fn(() => [null, jest.fn()]),
}));

import { useCameraPermissions as expoCameraHook } from 'expo-camera';

describe('useCameraPermissions', () => {
    it('should re-export useCameraPermissions from expo-camera', () => {
        expect(importedHook).toBeDefined();
        importedHook(); // Execute it
        expect(expoCameraHook).toHaveBeenCalled();
    });
});
