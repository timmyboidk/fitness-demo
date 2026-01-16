/**
 * @file usePoseModel.test.ts
 * @description usePoseModel Hook 单元测试。
 * 验证模型加载、会话创建以及错误处理流程。
 * 测试默认参数和异常场景。
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { Logger } from '../../services/Logger';
import { modelService } from '../../services/ModelService';
import { usePoseModel } from '../usePoseModel';

// Mock services (服务层)
jest.mock('../../services/ModelService', () => ({
    modelService: {
        loadModel: jest.fn(),
        createSession: jest.fn(),
    },
}));

jest.mock('../../services/Logger', () => ({
    Logger: {
        info: jest.fn(),
        error: jest.fn(),
    },
}));

describe('usePoseModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize session successfully', async () => {
        const mockSession = { handle: 123 };
        (modelService.loadModel as jest.Mock).mockResolvedValue('/path/to/model.onnx');
        (modelService.createSession as jest.Mock).mockResolvedValue(mockSession);

        const { result } = renderHook(() => usePoseModel('http://example.com/model.onnx'));

        expect(result.current).toBeNull();

        await waitFor(() => {
            expect(result.current).toBe(mockSession);
        });

        expect(modelService.loadModel).toHaveBeenCalledWith('http://example.com/model.onnx');
        expect(modelService.createSession).toHaveBeenCalledWith('/path/to/model.onnx');
        expect(Logger.info).toHaveBeenCalledWith('usePoseModel', 'Model loaded successfully');
    });

    it('should use default model url if none provided', async () => {
        const mockSession = { handle: 123 };
        (modelService.loadModel as jest.Mock).mockResolvedValue('/path/to/default.onnx');
        (modelService.createSession as jest.Mock).mockResolvedValue(mockSession);

        const { result } = renderHook(() => usePoseModel());

        await waitFor(() => {
            expect(result.current).toBe(mockSession);
        });

        expect(modelService.loadModel).toHaveBeenCalledWith('https://example.com/model.onnx');
    });

    it('should handle errors during model loading', async () => {
        const error = new Error('Download failed');
        (modelService.loadModel as jest.Mock).mockRejectedValue(error);

        const { result } = renderHook(() => usePoseModel('http://example.com/bad.onnx'));

        await waitFor(() => {
            expect(Logger.error).toHaveBeenCalledWith('usePoseModel', 'Failed to load model', { error });
        });

        expect(result.current).toBeNull();
    });

    it('should handle errors during session creation', async () => {
        (modelService.loadModel as jest.Mock).mockResolvedValue('/path/to/model.onnx');
        const error = new Error('Session creation failed');
        (modelService.createSession as jest.Mock).mockRejectedValue(error);

        const { result } = renderHook(() => usePoseModel('http://example.com/model.onnx'));

        await waitFor(() => {
            expect(Logger.error).toHaveBeenCalledWith('usePoseModel', 'Failed to load model', { error });
        });

        expect(result.current).toBeNull();
    });
});
