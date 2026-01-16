/**
 * @file PoseDetectorCamera.tsx
 * @description 姿态检测相机组件。
 * 封装 Expo Camera，旨在集成实时姿态估计模型 (Inference)。
 * 目前处于演示模式，主要负责渲染相机预览流。
 */

import { CameraView } from 'expo-camera';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

/**
 * 相机组件属性接口
 * @property onInferenceResult (可选) 当模型推理完成时的回调函数
 * @property modelUrl (可选) 姿态检测模型的URL
 * @property facing 摄像头朝向 ('front' | 'back')
 */
interface PoseDetectorCameraProps {
    onInferenceResult?: (result: any) => void;
    modelUrl?: string;
    facing?: 'front' | 'back';
}

/**
 * 姿态检测相机
 * 使用 React.memo 优化渲染性能
 */
export const PoseDetectorCamera = memo(function PoseDetectorCamera({ onInferenceResult, modelUrl, facing = 'back' }: PoseDetectorCameraProps) {
    // 注意: 当前演示版本禁用了实时推理功能，
    // 以确保在演示环境下的稳定性。

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
