/**
 * @file LibraryService.ts
 * @description 负责处理动作库和训练课程的数据获取与管理。
 * 提供与后端API交互的方法，用于获取标准动作列表和训练计划。
 */

import client from './api/client';

import { Move, Session } from '../types';

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

            if (data && data.success) {
                return data.data || { moves: [], sessions: [] };
            }

            console.error('获取训练库返回 success:false', data?.message);
            return null;
        } catch (e: any) {
            // 提供更详细的错误日志
            const errorMsg = e.response?.data?.message || e.message || '未知网络错误';
            console.error('获取训练库出错:', errorMsg, {
                status: e.response?.status,
                data: e.response?.data
            });
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
        // 根据规范，目前 fitness-content 模块中没有直接的 'addItem' 端点，
        // 但如果需要，我们可以假设它是库管理的一部分。
        // 暂时保留逻辑，并确保使用统一的 client 调用。
        try {
            const response = await client.post('/api/library', {
                type: 'add_item',
                payload: { userId, itemId, itemType }
            });
            return response.data;
        } catch (e) {
            console.error('添加项目出错:', e);
            return { success: false, error: '网络错误' };
        }
    }
}

export const libraryService = new LibraryService();
