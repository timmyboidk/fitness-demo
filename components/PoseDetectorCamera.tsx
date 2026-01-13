import { CameraView } from 'expo-camera';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

interface PoseDetectorCameraProps {
    onInferenceResult?: (result: any) => void;
    modelUrl?: string;
    facing?: 'front' | 'back';
}

export const PoseDetectorCamera = memo(function PoseDetectorCamera({ onInferenceResult, modelUrl, facing = 'back' }: PoseDetectorCameraProps) {
    // Note: Inference is currently disabled in this simplified camera view
    // to ensure stability for the demo.

    return (
        <View style={StyleSheet.absoluteFill}>
            <CameraView
                style={StyleSheet.absoluteFill}
                facing={facing}
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
