import * as FileSystem from 'expo-file-system/legacy';
import { InferenceSession } from 'onnxruntime-react-native';
import { Logger } from './Logger';

const MODEL_DIR = FileSystem.documentDirectory + 'models/';
const MODEL_FILE_NAME = 'pose_detection.onnx';

export const modelService = {
    /**
     * Initializes the model directory.
     */
    async init(): Promise<void> {
        const dirInfo = await FileSystem.getInfoAsync(MODEL_DIR);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(MODEL_DIR, { intermediates: true });
        }
    },

    /**
     * Downloads the model from a remote URL or uses a bundled asset if available.
     * For this demo, we assume the model might be bundled or downloaded.
     * @param url Remote URL to download the ONNX model from.
     */
    async loadModel(url?: string): Promise<string> {
        await this.init();

        const destination = MODEL_DIR + MODEL_FILE_NAME;
        const fileInfo = await FileSystem.getInfoAsync(destination);

        if (fileInfo.exists) {
            Logger.info('ModelService', "Model already exists at:", { destination });
            return destination;
        }

        if (url) {
            Logger.info('ModelService', "Downloading model from:", { url });
            const { uri } = await FileSystem.downloadAsync(url, destination);
            Logger.info('ModelService', "Model downloaded to:", { uri });
            return uri;
        } else {
            // Fallback or error if no URL provided and no local file
            // In a real app, you might bundle a default model
            throw new Error("No model URL provided and no cached model found.");
        }
    },

    /**
     * Creates an ONNX Inference Session.
     * @param modelPath Local file URI of the model.
     */
    async createSession(modelPath: string): Promise<InferenceSession> {
        Logger.info('ModelService', "Creating Inference Session with model:", { modelPath });
        try {
            // 'file://' prefix might need stripping depending on platform and library version
            // onnxruntime-react-native typically handles file paths well
            const session = await InferenceSession.create(modelPath);
            return session;
        } catch (e) {
            Logger.error('ModelService', "Failed to create inference session:", { error: e });
            throw e;
        }
    }
};
