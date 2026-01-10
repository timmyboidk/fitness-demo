import * as FileSystem from 'expo-file-system';

// Mock API function for checkVersion since api/models might not exist yet
async function checkVersion(platform: string, currentVersion: string) {
    // In real app, fetch from /api/core/models/latest
    return {
        hasUpdate: false,
        data: {
            version: '1.0.0',
            downloadUrl: '',
            md5: ''
        }
    };
}
// Placeholder for reload
async function reloadInferenceSession(uri: string) {
    console.log('Reloading session with model at:', uri);
}

const currentLocalVersion = "1.0.0";

export async function checkAndUpdateModel() {
    // 1. 检查云端版本
    const { hasUpdate, data } = await checkVersion('ios', currentLocalVersion);
    if (!hasUpdate) return;

    if (!data.downloadUrl) return;

    // 2. 下载新模型到应用沙盒
    const downloadRes = await FileSystem.downloadAsync(
        data.downloadUrl,
        FileSystem.documentDirectory + 'pose_latest.onnx'
    );

    // 3. 校验 MD5 (关键步骤，防篡改)
    const checksum = await FileSystem.getInfoAsync(downloadRes.uri, { md5: true });
    if (checksum.md5 === data.md5) {
        // 4. 重启推理 Session 加载新路径
        await reloadInferenceSession(downloadRes.uri);
    }
}
