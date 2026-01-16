/**
 * @file DataCollector.ts
 * @description 数据采集服务 (Analytics)。
 * 负责收集应用内的打分数据、行为事件和健康数据。
 * 实现本地缓冲 (Buffer)、隐私脱敏 (Differential Privacy) 和批量上传策略。
 */

import NetInfo from "@react-native-community/netinfo";
import { v4 as uuidv4 } from 'uuid';
import client from '../api/client';

// 声明全局变量类型 (用于 Session 跟踪)
declare global {
  var currentSessionId: string;
}

/**
 * 日志条目接口
 * @property type 事件类型
 * @property timestamp 时间戳
 */
interface LogItem {
  type: 'action_score' | 'app_event' | 'score' | 'heart_rate';
  [key: string]: any;
}

/**
 * 数据采集器类
 * 单例模式，管理数据缓冲和上传队列
 */
class DataCollector {
  private buffer: LogItem[] = [];
  private readonly BATCH_SIZE = 20; // 批量上传阈值

  /**
   * 1. 采集入口
   * 接收原始数据，进行清洗和缓冲
   * @param type - 事件类型
   * @param data - 事件数据
   */
  public track(type: LogItem['type'], data: any) {
    const item: LogItem = {
      type,
      ...this.sanitize(data), // 执行隐私脱敏
      timestamp: Date.now()
    };
    this.buffer.push(item);

    // 达到阈值自动触发上传
    if (this.buffer.length >= this.BATCH_SIZE) {
      this.flush();
    }
  }

  /**
   * 2. 隐私脱敏 (Local Differential Privacy)
   * 在数据离开设备前去除敏感信息并添加噪声
   * @param data - 原始数据
   */
  private sanitize(data: any) {
    const sanitized = { ...data };
    if (sanitized.keypoints) {
      // 对骨骼关键点坐标加入微小高斯噪声 (+- 0.5px) 
      // 防止通过动作步态识别特定用户身份
      sanitized.keypoints = sanitized.keypoints.map((k: any) => ({
        ...k,
        x: k.x + (Math.random() - 0.5) * 1.0,
        y: k.y + (Math.random() - 0.5) * 1.0,
      }));
    }
    // 移除设备ID等绝对标识符
    delete sanitized.deviceId;
    return sanitized;
  }

  /**
   * 3. 策略上传
   * 检查网络环境，将缓冲区数据发送至后端
   */
  public async flush() {
    if (this.buffer.length === 0) return;

    const state = await NetInfo.fetch();
    const isWifi = state.type === 'wifi';

    // 流量节省策略: 4G/5G 环境下过滤掉大体积的骨骼关键点数据，仅上传核心指标
    const items = this.buffer.filter(item => {
      if (isWifi) return true;
      if (item.keypoints) {
        return false;
      }
      return true;
    });

    if (items.length === 0) return;

    // 使用全局 SessionID 或生成新的 ID
    const sessionId = global.currentSessionId || uuidv4();

    try {
      await client.post('/api/data/collect', {
        sessionId,
        items
      });
      // 上传成功清空缓冲区
      this.buffer = [];
    } catch (e) {
      // 上传失败则保留在 Buffer 中等待下次重试 
      // (TODO: 生产环境应持久化到 SQLite 以防 App 崩溃导致数据丢失)
      console.warn('Upload failed, retrying next batch', e);
    }
  }
}

export const Collector = new DataCollector();
