/**
 * @file library.ts
 * @description 动作库状态管理 Store。
 * 维护应用全局的动作(Moves)和训练课程(Sessions)数据。
 * 支持数据同步、可见性切换和状态订阅通知。
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Move, Session } from '../types';
export { Move, Session };

// 辅助函数: 首字母大写
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// 预置动作数据 (基于 assets/icons)
// 所有图标名称均对应 SF Symbols
export const INITIAL_MOVES: Move[] = [
    { id: 'm_arms_open', name: '双臂张开', level: '初级', icon: 'figure.arms.open', isVisible: false },
    { id: 'm_boxing', name: '拳击常态', level: '中级', icon: 'figure.boxing', isVisible: false },
    { id: 'm_cooldown', name: '放松拉伸', level: '初级', icon: 'figure.cooldown', isVisible: false },
    { id: 'm_core_training', name: '核心训练', level: '中级', icon: 'figure.core.training', isVisible: false },
    { id: 'm_cross_training', name: '交叉训练', level: '高级', icon: 'figure.cross.training', isVisible: false },
    { id: 'm_dance', name: '舞蹈健身', level: '有氧', icon: 'figure.dance', isVisible: false },
    { id: 'm_elliptical', name: '椭圆机', level: '有氧', icon: 'figure.elliptical', isVisible: false },
    { id: 'm_fall', name: '倒地保护', level: '初级', icon: 'figure.fall', isVisible: false },
    { id: 'm_flexibility', name: '柔韧训练', level: '初级', icon: 'figure.flexibility', isVisible: false },
    { id: 'm_gymnastics', name: '体操', level: '高级', icon: 'figure.gymnastics', isVisible: false },
    { id: 'm_handball', name: '手球', level: '中级', icon: 'figure.handball', isVisible: false },
    { id: 'm_hiit', name: 'HIIT', level: '高强度', icon: 'figure.highintensity.intervaltraining', isVisible: false },
    { id: 'm_indoor_cycle', name: '动感单车', level: '有氧', icon: 'figure.indoor.cycle', isVisible: false },
    { id: 'm_indoor_rowing', name: '室内划船', level: '全等级', icon: 'figure.indoor.rowing', isVisible: false },
    { id: 'm_jumprope', name: '跳绳', level: '有氧', icon: 'figure.jumprope', isVisible: false },
    { id: 'm_kickboxing', name: '自由搏击', level: '高强度', icon: 'figure.kickboxing', isVisible: false },
    { id: 'm_martial_arts', name: '武术', level: '高级', icon: 'figure.martial.arts', isVisible: false },
    { id: 'm_mind_body', name: '身心合一', level: '初级', icon: 'figure.mind.and.body', isVisible: false },
    { id: 'm_mixed_cardio', name: '混合有氧', level: '中级', icon: 'figure.mixed.cardio', isVisible: false },
    { id: 'm_pilates', name: '普拉提', level: '中级', icon: 'figure.pilates', isVisible: false },
    { id: 'm_play', name: '运动游戏', level: '初级', icon: 'figure.play', isVisible: false },
    { id: 'm_rolling', name: '泡沫轴放松', level: '初级', icon: 'figure.rolling', isVisible: false },
    { id: 'm_run', name: '跑步', level: '有氧', icon: 'figure.run', isVisible: true },
    { id: 'm_run_treadmill', name: '跑步机', level: '有氧', icon: 'figure.run.treadmill', isVisible: false },
    { id: 'm_stair_stepper', name: '踏步机', level: '有氧', icon: 'figure.stair.stepper', isVisible: false },
    { id: 'm_stairs', name: '爬楼梯', level: '有氧', icon: 'figure.stairs', isVisible: false },
    { id: 'm_stand_dress', name: '站姿调整', level: '初级', icon: 'figure.stand.dress', isVisible: false },
    { id: 'm_stand', name: '站立', level: '初级', icon: 'figure.stand', isVisible: false },
    { id: 'm_step_training', name: '踏板操', level: '中级', icon: 'figure.step.training', isVisible: false },
    { id: 'm_strength_func', name: '功能性力量', level: '中级', icon: 'figure.strengthtraining.functional', isVisible: false },
    { id: 'm_strength_trad', name: '传统力量', level: '高级', icon: 'figure.strengthtraining.traditional', isVisible: true },
    { id: 'm_figure', name: '基础体态', level: '初级', icon: 'figure', isVisible: false },
    { id: 'm_taichi', name: '太极', level: '初级', icon: 'figure.taichi', isVisible: false },
    { id: 'm_track_field', name: '田径', level: '中级', icon: 'figure.track.and.field', isVisible: false },
    { id: 'm_walk_dep', name: '出发', level: '初级', icon: 'figure.walk.departure', isVisible: false },
    { id: 'm_walk_motion', name: '行走姿态', level: '初级', icon: 'figure.walk.motion', isVisible: false },
    { id: 'm_walk', name: '健走', level: '初级', icon: 'figure.walk', isVisible: true },
    { id: 'm_walk_treadmill', name: '跑步机健走', level: '有氧', icon: 'figure.walk.treadmill', isVisible: false },
    { id: 'm_wave', name: '招手动作', level: '初级', icon: 'figure.wave', isVisible: false },
    { id: 'm_yoga', name: '瑜伽', level: '全等级', icon: 'figure.yoga', isVisible: true },
];

export const INITIAL_SESSIONS: Session[] = [
    {
        id: 's1', name: 'HIIT 燃脂核心', time: '20 分钟', count: '4 个动作', color: '#FF3B30', isVisible: true,
        moveIds: ['m_hiit', 'm_core_training', 'm_boxing', 'm_jumprope']
    },
    {
        id: 's2', name: '腿部力量轰炸', time: '45 分钟', count: '4 个动作', color: '#CCFF00', isVisible: true,
        moveIds: ['m_strength_trad', 'm_stairs', 'm_run', 'm_flexibility']
    },
    {
        id: 's3', name: '晨间唤醒瑜伽', time: '15 分钟', count: '3 个动作', color: '#5AC8FA', isVisible: true,
        moveIds: ['m_yoga', 'm_mind_body', 'm_cooldown']
    },
    {
        id: 's4', name: '腹肌撕裂者', time: '15 分钟', count: '3 个动作', color: '#FF9500', isVisible: false,
        moveIds: ['m_core_training', 'm_strength_func', 'm_rolling']
    },
    {
        id: 's5', name: '全身拉伸', time: '10 分钟', count: '3 个动作', color: '#AF52DE', isVisible: false,
        moveIds: ['m_flexibility', 'm_cooldown', 'm_yoga']
    },
];

import { libraryService } from '../services/LibraryService';

/**
 * 全局动作库 Store
 * 单例模式，管理内存中的动作和课程数据
 */
class LibraryStore {
    moves: Move[] = [...INITIAL_MOVES];
    sessions: Session[] = [...INITIAL_SESSIONS];
    listeners: (() => void)[] = [];

    /**
     * 同步数据
     * 从后端API拉取最新的动作和课程列表，并与本地状态合并。
     * 自动处理用户偏好的难度等级。
     */
    async sync() {
        try {
            const userStr = await AsyncStorage.getItem('user');
            let difficultyLevel;
            if (userStr) {
                const user = JSON.parse(userStr);
                difficultyLevel = user.difficultyLevel;
            }

            const data = await libraryService.fetchLibrary(difficultyLevel);
            if (data) {
                if (data.moves) {
                    // 更新动作列表，保留本地的 isVisible 状态 (防止用户自定义的显示设置被覆盖)
                    this.moves = data.moves.map(newMove => {
                        const existing = this.moves.find(m => m.id === newMove.id);
                        return {
                            ...newMove,
                            isVisible: existing ? existing.isVisible : (newMove as any).isVisible || false,
                            level: (newMove as any).level || '全等级',
                            icon: (newMove as any).icon || 'figure.run'
                        };
                    });
                }
                if (data.sessions) {
                    this.sessions = data.sessions.map(newSession => {
                        const existing = this.sessions.find(s => s.id === newSession.id);
                        return {
                            ...newSession,
                            isVisible: existing ? existing.isVisible : (newSession as any).isVisible || false,
                            time: (newSession as any).time || `${newSession.duration} 分钟`,
                            count: (newSession as any).count || '多个动作',
                            color: (newSession as any).color || '#CCFF00',
                            moveIds: (newSession as any).moveIds || []
                        };
                    });
                }
                this.notify();
            }
        } catch (e) {
            console.error('LibraryStore sync error:', e);
        }
    }

    /**
     * 获取所有动作列表
     */
    getMoves() {
        return this.moves;
    }

    /**
     * 获取所有课程列表
     */
    getSessions() {
        return this.sessions;
    }

    /**
     * 获取指定课程包含的所有动作详情
     * @param sessionId - 课程ID
     */
    getSessionMoves(sessionId: string): Move[] {
        const session = this.sessions.find(s => s.id === sessionId);
        if (!session) return [];
        return session.moveIds.map(id => this.moves.find(m => m.id === id)).filter(Boolean) as Move[];
    }

    /**
     * 切换动作的可见性 (添加/移除)
     * @param id - 动作ID
     */
    toggleMoveVisibility(id: string) {
        const move = this.moves.find(m => m.id === id);
        if (move) {
            move.isVisible = !move.isVisible;
            this.notify();
        }
    }

    /**
     * 切换课程的可见性
     * @param id - 课程ID
     */
    toggleSessionVisibility(id: string) {
        const session = this.sessions.find(s => s.id === id);
        if (session) {
            session.isVisible = !session.isVisible;
            this.notify();
        }
    }

    /**
     * 订阅 Store 变更
     * @param listener - 回调函数
     * @returns {Function} 取消订阅的函数
     */
    subscribe(listener: () => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    /**
     * 通知所有订阅者
     * @private
     */
    notify() {
        this.listeners.forEach(l => l());
    }
}


export const libraryStore = new LibraryStore();
