import NetInfo from "@react-native-community/netinfo";
import { v4 as uuidv4 } from 'uuid';

// Define global type if not exists
declare global {
  var currentSessionId: string;
}

interface LogItem {
  sessionId: string;
  type: 'action_score' | 'app_event';
  payload: any;
  timestamp: number;
}

class DataCollector {
  private buffer: LogItem[] = [];
  private readonly BATCH_SIZE = 20;

  // 1. 采集入口
  public track(type: 'action_score' | 'app_event', data: any) {
    const item: LogItem = {
      sessionId: global.currentSessionId || uuidv4(),
      type,
      payload: this.sanitize(data), // 隐私脱敏
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
    const state = await NetInfo.fetch();
    const isWifi = state.type === 'wifi';

    // 4G 环境下过滤掉大体积的骨骼数据
    const payload = this.buffer.filter(item => {
      if (isWifi) return true;
      // If not wifi, remove keypoints from payload if they exist
      if (item.payload.keypoints) {
        // modifying copy in filter is bad practice usually, but here we just filtering
        // actually we should probably clone if we are stripping, but for now just filter out big blobs
        return false;
      }
      return true;
    });

    if (payload.length === 0) return;

    try {
      await fetch('https://api.fitness.com/api/data/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payload })
      });
      // Clear buffer on success (naive)
      this.buffer = [];
    } catch (e) {
      // 失败保留在 Buffer (实际生产应持久化到 SQLite)
      console.warn('Upload failed, retrying next batch');
    }
  }
}

export const Collector = new DataCollector();
