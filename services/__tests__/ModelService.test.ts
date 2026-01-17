import * as FileSystem from 'expo-file-system/legacy';
import { InferenceSession } from 'onnxruntime-react-native';
import { Logger } from '../Logger';
import { modelService } from '../ModelService';

// Mock dependencies (模拟依赖)
jest.mock('expo-file-system/legacy', () => ({
    documentDirectory: 'file:///mock/doc/dir/',
    getInfoAsync: jest.fn(),
    makeDirectoryAsync: jest.fn(),
    downloadAsync: jest.fn(),
}));

jest.mock('onnxruntime-react-native', () => ({
    InferenceSession: {
        create: jest.fn(),
    },
}));

jest.mock('../Logger', () => ({
    Logger: {
        info: jest.fn(),
        error: jest.fn(),
    },
}));

describe('ModelService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('init', () => {
        it('should create directory if it does not exist', async () => {
            (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: false });

            await modelService.init();

            expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledWith(
                expect.stringContaining('models/'),
                { intermediates: true }
            );
        });

        it('should not create directory if it exists', async () => {
            (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: true });

            await modelService.init();

            expect(FileSystem.makeDirectoryAsync).not.toHaveBeenCalled();
        });
    });

    describe('loadModel', () => {
        it('should return local path if model already exists', async () => {
            (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: true });

            const result = await modelService.loadModel();

            expect(result).toContain('models/pose_detection.onnx');
            expect(Logger.info).toHaveBeenCalledWith('ModelService', 'Model already exists at:', expect.any(Object));
        });

        it('should download model if it does not exist and URL is provided', async () => {
            // 第一次检查目录 (init) - 不存在
            // 第二次检查文件 - 不存在
            (FileSystem.getInfoAsync as jest.Mock)
                .mockResolvedValueOnce({ exists: true }) // dir
                .mockResolvedValueOnce({ exists: false }); // file

            (FileSystem.downloadAsync as jest.Mock).mockResolvedValue({ uri: 'file:///downloaded/file.onnx' });

            const result = await modelService.loadModel('http://example.com/model.onnx');

            expect(FileSystem.downloadAsync).toHaveBeenCalled();
            expect(result).toBe('file:///downloaded/file.onnx');
        });

        it('should throw error if model missing and no URL provided', async () => {
            (FileSystem.getInfoAsync as jest.Mock)
                .mockResolvedValueOnce({ exists: true }) // dir
                .mockResolvedValueOnce({ exists: false }); // file

            await expect(modelService.loadModel()).rejects.toThrow("No model URL provided");
        });
    });

    describe('createSession', () => {
        it('should create an inference session successfully', async () => {
            const mockSession = { handle: 123 };
            (InferenceSession.create as jest.Mock).mockResolvedValue(mockSession);

            const session = await modelService.createSession('file:///model.onnx');

            expect(InferenceSession.create).toHaveBeenCalledWith('file:///model.onnx');
            expect(session).toBe(mockSession);
        });

        it('should log error and throw if session creation fails', async () => {
            const error = new Error("Session failed");
            (InferenceSession.create as jest.Mock).mockRejectedValue(error);

            await expect(modelService.createSession('file:///model.onnx')).rejects.toThrow("Session failed");
            expect(Logger.error).toHaveBeenCalled();
        });
    });
});
