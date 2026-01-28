/**
 * @file use-color-scheme.test.ts
 * @description Unit tests for use-color-scheme hook (re-export test)
 */

import { useColorScheme as rnUseColorScheme } from 'react-native';
import { useColorScheme as importedUseColorScheme } from '../use-color-scheme';

describe('use-color-scheme', () => {
    it('should re-export useColorScheme from react-native', () => {
        // Verify that the exported function is the same as React Native's
        expect(importedUseColorScheme).toBe(rnUseColorScheme);
        const result = importedUseColorScheme();
        expect(result).toBeDefined(); // Standard mock returns 'light' or similar
    });
});
