/**
 * @file usePoseModel.test.ts
 * @description Unit tests for usePoseModel hook
 */

import { renderHook, waitFor } from '@testing-library/react-native';

// Mock dependencies
jest.mock('../../services/Logger', () => ({
    Logger: {
        info: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock('../../services/ModelService', () => ({
    modelService: {
        loadModel: jest.fn(),
        createSession: jest.fn(),
    },
}));

import { Logger } from '../../services/Logger';
import { modelService } from '../../services/ModelService';
import { usePoseModel } from '../usePoseModel';

describe('usePoseModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return null initially', () => {
        (modelService.loadModel as jest.Mock).mockResolvedValue('/path/to/model');
        (modelService.createSession as jest.Mock).mockResolvedValue({ id: 'session1' });

        const { result } = renderHook(() => usePoseModel());

        expect(result.current).toBeNull();
    });

    it('should load model and create session successfully', async () => {
        const mockSession = { id: 'session1', run: jest.fn() };
        (modelService.loadModel as jest.Mock).mockResolvedValue('/path/to/model');
        (modelService.createSession as jest.Mock).mockResolvedValue(mockSession);

        const { result } = renderHook(() => usePoseModel('https://example.com/custom.onnx'));

        await waitFor(() => {
            expect(result.current).toBe(mockSession);
        });

        expect(modelService.loadModel).toHaveBeenCalledWith('https://example.com/custom.onnx');
        expect(Logger.info).toHaveBeenCalledWith('usePoseModel', 'Model loaded successfully');
    });

    it('should use default model URL when not provided', async () => {
        const mockSession = { id: 'session1' };
        (modelService.loadModel as jest.Mock).mockResolvedValue('/path/to/model');
        (modelService.createSession as jest.Mock).mockResolvedValue(mockSession);

        renderHook(() => usePoseModel());

        await waitFor(() => {
            expect(modelService.loadModel).toHaveBeenCalledWith('https://example.com/model.onnx');
        });
    });

    it('should handle model loading error', async () => {
        const mockError = new Error('Load failed');
        (modelService.loadModel as jest.Mock).mockRejectedValue(mockError);

        const { result } = renderHook(() => usePoseModel());

        await waitFor(() => {
            expect(Logger.error).toHaveBeenCalledWith(
                'usePoseModel',
                'Failed to load model',
                { error: mockError }
            );
        });

        expect(result.current).toBeNull();
    });

    it('should handle session creation error', async () => {
        const mockError = new Error('Session creation failed');
        (modelService.loadModel as jest.Mock).mockResolvedValue('/path/to/model');
        (modelService.createSession as jest.Mock).mockRejectedValue(mockError);

        const { result } = renderHook(() => usePoseModel());

        await waitFor(() => {
            expect(Logger.error).toHaveBeenCalled();
        });

        expect(result.current).toBeNull();
    });

    it('should reload model when modelUrl changes', async () => {
        const mockSession1 = { id: 'session1' };
        const mockSession2 = { id: 'session2' };
        (modelService.loadModel as jest.Mock)
            .mockResolvedValueOnce('/path/to/model1')
            .mockResolvedValueOnce('/path/to/model2');
        (modelService.createSession as jest.Mock)
            .mockResolvedValueOnce(mockSession1)
            .mockResolvedValueOnce(mockSession2);

        const { result, rerender } = renderHook(
            ({ url }) => usePoseModel(url),
            { initialProps: { url: 'https://example.com/model1.onnx' } }
        );

        await waitFor(() => {
            expect(result.current).toBe(mockSession1);
        });

        rerender({ url: 'https://example.com/model2.onnx' });

        await waitFor(() => {
            expect(result.current).toBe(mockSession2);
        });
    });
});
