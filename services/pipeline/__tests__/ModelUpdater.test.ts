/**
 * @file ModelUpdater.test.ts
 * @description Unit tests for ModelUpdater pipeline service
 */

import * as FileSystem from 'expo-file-system';

// Mock dependencies
jest.mock('expo-file-system', () => ({
    downloadAsync: jest.fn(),
    getInfoAsync: jest.fn(),
    documentDirectory: '/mock/documents/',
}));

jest.mock('../../api/client', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
    },
}));

import client from '../../api/client';
import { checkAndUpdateModel } from '../ModelUpdater';

describe('ModelUpdater', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('checkAndUpdateModel', () => {
        it('should do nothing if no update available', async () => {
            (client.get as jest.Mock).mockResolvedValue({
                data: { success: true, data: { hasUpdate: false } }
            });

            await checkAndUpdateModel();

            expect(FileSystem.downloadAsync).not.toHaveBeenCalled();
        });

        it('should do nothing if API returns error', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            (client.get as jest.Mock).mockRejectedValue(new Error('Network error'));

            await checkAndUpdateModel();

            expect(FileSystem.downloadAsync).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        it('should do nothing if success is false', async () => {
            (client.get as jest.Mock).mockResolvedValue({
                data: { success: false }
            });

            await checkAndUpdateModel();

            expect(FileSystem.downloadAsync).not.toHaveBeenCalled();
        });

        it('should do nothing if no downloadUrl', async () => {
            (client.get as jest.Mock).mockResolvedValue({
                data: { success: true, data: { hasUpdate: true, data: {} } }
            });

            await checkAndUpdateModel();

            expect(FileSystem.downloadAsync).not.toHaveBeenCalled();
        });

        it('should download and verify model on update', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            (client.get as jest.Mock).mockResolvedValue({
                data: {
                    success: true,
                    data: {
                        hasUpdate: true,
                        data: {
                            version: '2.0.0',
                            downloadUrl: 'https://example.com/model.onnx',
                            md5: 'abc123'
                        }
                    }
                }
            });
            (FileSystem.downloadAsync as jest.Mock).mockResolvedValue({
                uri: '/mock/documents/pose_latest.onnx'
            });
            (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
                md5: 'abc123'
            });

            await checkAndUpdateModel();

            expect(FileSystem.downloadAsync).toHaveBeenCalledWith(
                'https://example.com/model.onnx',
                '/mock/documents/pose_latest.onnx'
            );
            expect(consoleSpy).toHaveBeenCalledWith(
                'Reloading session with model at:',
                '/mock/documents/pose_latest.onnx'
            );
            consoleSpy.mockRestore();
        });

        it('should not reload session if MD5 mismatch', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            (client.get as jest.Mock).mockResolvedValue({
                data: {
                    success: true,
                    data: {
                        hasUpdate: true,
                        data: {
                            version: '2.0.0',
                            downloadUrl: 'https://example.com/model.onnx',
                            md5: 'abc123'
                        }
                    }
                }
            });
            (FileSystem.downloadAsync as jest.Mock).mockResolvedValue({
                uri: '/mock/documents/pose_latest.onnx'
            });
            (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
                md5: 'wrong-hash'
            });

            await checkAndUpdateModel();

            expect(consoleSpy).not.toHaveBeenCalledWith(
                'Reloading session with model at:',
                expect.any(String)
            );
            consoleSpy.mockRestore();
        });
    });
});
