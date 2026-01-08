import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { Worklets } from 'react-native-worklets-core';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { useCameraPermissions } from '../hooks/useCameraPermissions';
import { usePoseModel } from '../hooks/usePoseModel';

interface PoseDetectorCameraProps {
    onInferenceResult?: (result: any) => void;
    modelUrl?: string; // Optional: download URL if not cached
    facing?: 'front' | 'back';
}

export const PoseDetectorCamera = memo(function PoseDetectorCamera({ onInferenceResult, modelUrl, facing = 'back' }: PoseDetectorCameraProps) {
    const device = useCameraDevice(facing);
    const hasPermission = useCameraPermissions();
    const session = usePoseModel(modelUrl);
    const { resize } = useResizePlugin();

    const handleInference = Worklets.createRunOnJS((output: any) => {
        if (onInferenceResult) {
            onInferenceResult(output);
        }
    });

    const frameProcessor = useFrameProcessor((frame) => {
        'worklet';
        if (!session) return;

        // 1. Resize Frame to Model Input Size (e.g., 224x224 or 192x192 for MoveNet/PoseNet)
        // Adjust dimensions based on your specific ONNX model requirements
        const resized = resize(frame, {
            scale: {
                width: 192,
                height: 192,
            },
            pixelFormat: 'rgb',
            dataType: 'float32', // Depends on model input type (uint8 vs float32)
        });

        // 2. Prepare Tensor (This part is tricky in JS/Worklet without direct buffer access)
        // Ideally, pass 'resized' buffer to a native C++ function to run inference.
        // However, onnxruntime-react-native is JS-based.
        // Converting buffer to array in JS worklet is slow.
        // For "Industry Best Practice", we usually write a native JSI function here.
        // Since we are in JS-land for this demo:

        // NOTE: onnxruntime-react-native `run` cannot be called directly inside a worklet 
        // because it uses the JS bridge/HostObject which might not be fully worklet-safe 
        // or simply because it's async and "heavy".

        // Current Limitation: running synchronous inference in Frame Processor (Worklet) 
        // requires a C++ JSI binding for the ONNX Runtime. 
        // The `onnxruntime-react-native` library is primarily for the JS thread.

        // Workaround for pure JS: call runOnJS to offload inference (slower frame rate)
        // Or use `react-native-fast-tflite` which supports worklets if using TFLite.
        // Since request is strictly ONNX:

        // We will just log frame info here to prove pipeline connectivity.
        // Actual inference on JS thread:
        // runOnJS(runInference)(resizedArray);

        // console.log causes issues in worklets if not careful, but typically safe in RN dev mode.
        // Ideally we'd use a worklet-safe logger, but for this step we'll stick to console in worklets
        // or use runOnJS to log via our service if strictly needed.
        // For performance, logging every frame is bad practice. We'll comment it out or reduce it.
        // console.log(`Frame: ${frame.width}x${frame.height} -> Resized: ${resized.width}x${resized.height}`);
    }, [session]);

    if (!hasPermission) return <View style={styles.center}><Text>No Camera Permission</Text></View>;
    if (!device) return <View style={styles.center}><Text>No Device Found</Text></View>;

    return (
        <View style={StyleSheet.absoluteFill}>
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                frameProcessor={frameProcessor}
                pixelFormat="yuv" // VisionCamera standard
            />
        </View>
    );
});

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black'
    }
});
