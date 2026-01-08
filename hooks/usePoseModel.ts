import { InferenceSession } from 'onnxruntime-react-native';
import { useEffect, useState } from 'react';
import { Logger } from '../services/Logger';
import { modelService } from '../services/ModelService';

export function usePoseModel(modelUrl?: string) {
    const [session, setSession] = useState<InferenceSession | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const modelPath = await modelService.loadModel(modelUrl || "https://example.com/model.onnx");
                const sess = await modelService.createSession(modelPath);
                setSession(sess);
                Logger.info('usePoseModel', "Model loaded successfully");
            } catch (e) {
                Logger.error('usePoseModel', "Failed to load model", { error: e });
            }
        })();
    }, [modelUrl]);

    return session;
}
