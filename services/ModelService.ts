import * as FileSystem from 'expo-file-system/legacy';
import { InferenceSession } from 'onnxruntime-react-native';
import { Logger } from './Logger';

const MODEL_DIR = FileSystem.documentDirectory + 'models/';
const MODEL_FILE_NAME = 'pose_detection.onnx';

export const modelService = {
    /**
     * 初始化模型目录。
     */
    async init(): Promise<void> {
        const dirInfo = await FileSystem.getInfoAsync(MODEL_DIR);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(MODEL_DIR, { intermediates: true });
        }
    },

    /**
     * 从远程 URL 下载模型或使用已捆绑的资源。
     * 在此演示中，我们假设模型可能被捆绑或需要下载。
     * @param url 远程 ONNX 模型下载地址。
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
            // 如果未提供 URL 且没有本地文件，则回退或报错
            // 在实际应用中，您可能会捆绑一个默认模型
            throw new Error("No model URL provided and no cached model found.");
        }
    },

    /**
     * 创建 ONNX 推理会话 (Inference Session)。
     * @param modelPath 模型文件的本地 URI。
     */
    async createSession(modelPath: string): Promise<InferenceSession> {
        Logger.info('ModelService', "Creating Inference Session with model:", { modelPath });
        try {
            // 'file://' 前缀可能需要根据平台和库版本进行剥离
            // onnxruntime-react-native 通常能很好地处理文件路径
            const session = await InferenceSession.create(modelPath);
            return session;
        } catch (e) {
            Logger.error('ModelService', "Failed to create inference session:", { error: e });
            throw e;
        }
    }
};
