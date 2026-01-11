import * as FileSystem from 'expo-file-system';
import client from '../api/client';

async function checkVersion(platform: string, currentVersion: string) {
    try {
        const response = await client.get('/api/core/models/latest', {
            params: { platform, currentVersion }
        });
        const data = response.data;
        if (data.success) {
            return data.data; // { hasUpdate, data: { version, downloadUrl, md5 } }
        }
        return { hasUpdate: false };
    } catch (e) {
        console.error('Check version error:', e);
        return { hasUpdate: false };
    }
}

// Placeholder for reload
async function reloadInferenceSession(uri: string) {
    console.log('Reloading session with model at:', uri);
}

const currentLocalVersion = "1.0.0";

export async function checkAndUpdateModel() {
    // 1. 检查云端版本
    const result = await checkVersion('ios', currentLocalVersion);
    if (!result.hasUpdate) return;

    const data = result.data;
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
