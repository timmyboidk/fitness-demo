/**
 * @file LibraryService.ts
 * @description 负责处理动作库和训练课程的数据获取与管理。
 * 提供与后端API交互的方法，用于获取标准动作列表和训练计划。
 */

import client from './api/client';

/**
 * 代表一个独立的训练动作
 * @property id 唯一标识符
 * @property name 动作名称 (如: 深蹲)
 * @property modelUrl 姿态模型文件的URL地址
 * @property scoringConfig AI评分相关的配置参数
 */
export interface Move {
    id: string;
    name: string;
    modelUrl: string;
    scoringConfig: any;
}

/**
 * 代表一个完整的训练课程
 * @property id 唯一标识符
 * @property name 课程名称
 * @property difficulty 难度等级 (如: Beginner, Advanced)
 * @property duration 预计耗时 (分钟)
 */
export interface Session {
    id: string;
    name: string;
    difficulty: string;
    duration: number;
}

/**
 * 训练库API响应结构
 */
export interface LibraryResponse {
    moves: Move[];
    sessions: Session[];
}

/**
 * 训练内容服务类
 * 负责从后端获取动作和课程数据
 */
export class LibraryService {
    /**
     * 根据难度等级获取动作库列表。
     *
     * @param difficultyLevel - (可选) 过滤的难度等级
     * @returns {Promise<LibraryResponse | null>} 返回包含动作和课程的响应对象，如果请求失败则返回 null
     */
    async fetchLibrary(difficultyLevel?: string): Promise<LibraryResponse | null> {
        try {
            const response = await client.get('/api/library', {
                params: { difficultyLevel }
            });
            const data = response.data;
            if (data.success) {
                return data.data;
            }
            return null;
        } catch (e) {
            console.error('Fetch library error:', e);
            return null;
        }
    }

    /**
     * 添加项目到用户的个人库
     * 注意: 当前后端API可能未完全支持此功能，这是一个预留接口
     *
     * @param userId - 用户ID
     * @param itemId - 项目ID
     * @param itemType - 项目类型 ('move' 或 'session')
     * @returns {Promise<any>} API响应结果
     */
    async addItem(userId: string, itemId: string, itemType: 'move' | 'session') {
        // Based on the spec, there isn't a direct 'addItem' endpoint in fitness-content,
        // but let's assume it's part of the library management if needed.
        // For now, keeping the structure but updating to client.
        try {
            const response = await client.post('/api/library', {
                type: 'add_item',
                payload: { userId, itemId, itemType }
            });
            return response.data;
        } catch (e) {
            console.error('Add item error:', e);
            return { success: false, error: 'Network Error' };
        }
    }
}

export const libraryService = new LibraryService();
