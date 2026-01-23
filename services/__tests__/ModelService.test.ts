import * as FileSystem from 'expo-file-system/legacy';
import { InferenceSession } from 'onnxruntime-react-native';
import { modelService } from '../ModelService';

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

// Mock Logger to avoid cluttering test output
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
        it('should create model directory if it does not exist', async () => {
            (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: false });

            await modelService.init();

            expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledWith(
                expect.stringContaining('models/'),
                { intermediates: true }
            );
        });

        it('should do nothing if directory exists', async () => {
            (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: true });

            await modelService.init();

            expect(FileSystem.makeDirectoryAsync).not.toHaveBeenCalled();
        });
    });

    describe('loadModel', () => {
        it('should return path if model already exists', async () => {
            // First call for dir check (init), second call for file check
            (FileSystem.getInfoAsync as jest.Mock)
                .mockResolvedValueOnce({ exists: true }) // dir exists
                .mockResolvedValueOnce({ exists: true }); // file exists

            const path = await modelService.loadModel();

            expect(path).toContain('pose_detection.onnx');
            expect(FileSystem.downloadAsync).not.toHaveBeenCalled();
        });

        it('should download model if it does not exist and url provided', async () => {
            (FileSystem.getInfoAsync as jest.Mock)
                .mockResolvedValueOnce({ exists: true }) // dir exists
                .mockResolvedValueOnce({ exists: false }); // file NOT exists

            (FileSystem.downloadAsync as jest.Mock).mockResolvedValue({
                uri: 'file:///downloaded/model.onnx'
            });

            const path = await modelService.loadModel('http://example.com/model.onnx');

            expect(FileSystem.downloadAsync).toHaveBeenCalled();
            expect(path).toBe('file:///downloaded/model.onnx');
        });

        it('should throw error if model missing and no url provided', async () => {
            (FileSystem.getInfoAsync as jest.Mock)
                .mockResolvedValueOnce({ exists: true })
                .mockResolvedValueOnce({ exists: false });

            await expect(modelService.loadModel()).rejects.toThrow('No model URL provided');
        });
    });

    describe('createSession', () => {
        it('should create inference session successfully', async () => {
            (InferenceSession.create as jest.Mock).mockResolvedValue('mock-session');

            const session = await modelService.createSession('path/to/model');
            expect(session).toBe('mock-session');
        });

        it('should throw error on session creation failure', async () => {
            (InferenceSession.create as jest.Mock).mockRejectedValue(new Error('Init failed'));

            await expect(modelService.createSession('path/to/model')).rejects.toThrow('Init failed');
        });
    });
});
