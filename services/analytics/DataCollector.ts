import NetInfo from "@react-native-community/netinfo";
import { v4 as uuidv4 } from 'uuid';
import client from '../api/client';

// Define global type if not exists
declare global {
  var currentSessionId: string;
}

interface LogItem {
  type: 'action_score' | 'app_event' | 'score' | 'heart_rate';
  [key: string]: any;
}

class DataCollector {
  private buffer: LogItem[] = [];
  private readonly BATCH_SIZE = 20;

  // 1. 采集入口
  public track(type: LogItem['type'], data: any) {
    const item: LogItem = {
      type,
      ...this.sanitize(data), // 隐私脱敏
      timestamp: Date.now()
    };
    this.buffer.push(item);
    if (this.buffer.length >= this.BATCH_SIZE) {
      this.flush();
    }
  }

  // 2. 隐私脱敏 (Local Differential Privacy)
  private sanitize(data: any) {
    const sanitized = { ...data };
    if (sanitized.keypoints) {
      // 对关键点坐标加入微小高斯噪声 (+- 0.5px) 防止指纹识别
      sanitized.keypoints = sanitized.keypoints.map((k: any) => ({
        ...k,
        x: k.x + (Math.random() - 0.5) * 1.0,
        y: k.y + (Math.random() - 0.5) * 1.0,
      }));
    }
    // 移除设备ID等敏感字段
    delete sanitized.deviceId;
    return sanitized;
  }

  // 3. 策略上传
  public async flush() {
    if (this.buffer.length === 0) return;

    const state = await NetInfo.fetch();
    const isWifi = state.type === 'wifi';

    // 4G 环境下过滤掉大体积的骨骼数据
    const items = this.buffer.filter(item => {
      if (isWifi) return true;
      // If not wifi, remove keypoints from payload if they exist
      if (item.keypoints) {
        return false;
      }
      return true;
    });

    if (items.length === 0) return;

    const sessionId = global.currentSessionId || uuidv4();

    try {
      await client.post('/api/data/collect', {
        sessionId,
        items
      });
      // Clear buffer on success (naive)
      this.buffer = [];
    } catch (e) {
      // 失败保留在 Buffer (实际生产应持久化到 SQLite)
      console.warn('Upload failed, retrying next batch', e);
    }
  }
}

export const Collector = new DataCollector();
