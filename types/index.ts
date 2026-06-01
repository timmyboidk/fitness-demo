/**
 * @file types/index.ts
 * @description 应用程序范围内的 TypeScript 接口和枚举。
 *
 * 用于 AI 健身评分的严格数据结构、
 * 实时会话跟踪和锻炼历史记录。
 */

// ─────────────────────────────────────────────
//  核心用户
// ─────────────────────────────────────────────

export interface User {
    id: string;
    nickname: string;
    avatar: string;
    token: string;
    phone?: string;
    isVip: boolean;
    difficultyLevel?: 'novice' | 'skilled' | 'expert';
}

// ─────────────────────────────────────────────
//  生物力学 – 关节与角度定义
// ─────────────────────────────────────────────

/** 标准姿态估计关节名称（兼容 COCO）。 */
export type JointName =
    | 'LEFT_SHOULDER'
    | 'RIGHT_SHOULDER'
    | 'LEFT_ELBOW'
    | 'RIGHT_ELBOW'
    | 'LEFT_WRIST'
    | 'RIGHT_WRIST'
    | 'LEFT_HIP'
    | 'RIGHT_HIP'
    | 'LEFT_KNEE'
    | 'RIGHT_KNEE'
    | 'LEFT_ANKLE'
    | 'RIGHT_ANKLE'
    | 'NECK'
    | 'SPINE';

/**
 * 用于评分动作质量的单个参考角度。
 * @property jointName   – 测量此角度的关节。
 * @property targetAngleDeg – 理想角度（度，0-360）。
 * @property toleranceDeg   – 扣分前的允许偏差（±）。
 * @property weight         – 在综合评分中的相对重要性（0-1）。
 */
export interface ReferenceAngle {
    jointName: JointName;
    targetAngleDeg: number;
    toleranceDeg: number;
    weight: number;
}

// ─────────────────────────────────────────────
//  运动阶段
// ─────────────────────────────────────────────

/** 抗阻训练的规范运动阶段。 */
export type MovementPhase = 'eccentric' | 'concentric' | 'isometric';

/**
 * 定义单个阶段的预期身体几何和时序。
 * @property phase           – 此定义覆盖的阶段。
 * @property durationMs      – 此阶段的预期持续时间。
 * @property referenceAngles – 此阶段特定的目标关节角度。
 */
export interface PhaseDefinition {
    phase: MovementPhase;
    durationMs: number;
    referenceAngles: ReferenceAngle[];
}

// ─────────────────────────────────────────────
//  评分配置
// ─────────────────────────────────────────────

/**
 * 附加到每个动作的完整评分配置。
 * 取代之前的 `scoringConfig?: any`。
 *
 * @property referenceAngles         – 全局（与阶段无关）参考角度。
 * @property phases                  – 特定阶段的角度目标和时序。
 * @property minConfidenceThreshold  – 接受帧的最小关键点置信度（0-1）。
 * @property maxRepDurationMs        – 单次重复的超时时间，超时则丢弃。
 */
export interface ScoringConfig {
    referenceAngles: ReferenceAngle[];
    phases: PhaseDefinition[];
    minConfidenceThreshold: number;
    maxRepDurationMs: number;
}

// ─────────────────────────────────────────────
//  AI 反馈代码
// ─────────────────────────────────────────────

/**
 * AI 评分引擎生成的不同反馈代码。
 * 按严重程度分组：ERR（动作错误）、WARN（节奏/幅度）、SUCCESS（正面）。
 */
export enum FeedbackCode {
    // ── 动作错误 ──
    ERR_KNEE_VALGUS         = 'ERR_KNEE_VALGUS',
    ERR_ROUNDED_BACK        = 'ERR_ROUNDED_BACK',
    ERR_ELBOW_FLARE         = 'ERR_ELBOW_FLARE',
    ERR_SHALLOW_DEPTH       = 'ERR_SHALLOW_DEPTH',
    ERR_ASYMMETRIC_LOAD     = 'ERR_ASYMMETRIC_LOAD',
    ERR_HIP_SHIFT           = 'ERR_HIP_SHIFT',
    ERR_NECK_HYPEREXTENSION = 'ERR_NECK_HYPEREXTENSION',

    // ── 警告 ──
    WARN_TOO_FAST           = 'WARN_TOO_FAST',
    WARN_TOO_SLOW           = 'WARN_TOO_SLOW',
    WARN_PARTIAL_ROM        = 'WARN_PARTIAL_ROM',
    WARN_UNSTABLE_BASE      = 'WARN_UNSTABLE_BASE',

    // ── 成功 ──
    SUCCESS_PERFECT_REP     = 'SUCCESS_PERFECT_REP',
    SUCCESS_GOOD_FORM       = 'SUCCESS_GOOD_FORM',
    SUCCESS_IMPROVED        = 'SUCCESS_IMPROVED',
}

// ─────────────────────────────────────────────
//  动作与会话（库实体）
// ─────────────────────────────────────────────

export interface Move {
    id: string;
    name: string;
    level: string;
    icon: string; // SF Symbol 图标名称
    isVisible: boolean;
    modelUrl?: string;
    scoringConfig?: ScoringConfig;
}

export interface Session {
    id: string;
    name: string;
    time: string;       // e.g. "20 分钟"
    duration?: number;   // 分钟
    count: string;       // e.g. "4 个动作"
    color: string;
    isVisible: boolean;
    moveIds: string[];
    difficulty?: string;
}

// ─────────────────────────────────────────────
//  AI 评分 API 契约
// ─────────────────────────────────────────────

export interface Keypoint {
    x: number;
    y: number;
    score: number;
    name?: JointName;
}

export interface ScoreRequest {
    moveId: string;
    data: {
        keypoints: Keypoint[];
        userId: string;
    };
}

export interface ScoreResponse {
    success: boolean;
    score: number;
    feedback: string[];
    feedbackCodes: FeedbackCode[];
}

// ─────────────────────────────────────────────
//  实时会话状态（实时追踪）
// ─────────────────────────────────────────────

/**
 * 追踪进行中锻炼的实时状态。
 * 设计为保存在内存中，并在完成后写入 WorkoutHistory。
 */
export interface LiveSessionState {
    sessionId: string;
    currentMoveIndex: number;
    currentRepCount: number;
    currentPhase: MovementPhase;
    accumulatedScore: number;
    elapsedMs: number;
    activeFeedbackCodes: FeedbackCode[];
    isPaused: boolean;
    isComplete: boolean;
}

// ─────────────────────────────────────────────
//  锻炼历史（持久化）
// ─────────────────────────────────────────────

/**
 * 已完成的锻炼记录，持久化用于进度图表展示。
 *
 * @property frequentFeedbackCodes – 用于趋势分析的汇总反馈。
 * @property averageRepScore       – 所有重复的平均得分。
 * @property peakRepScore          – 达到的最佳单次重复得分。
 */
export interface WorkoutHistory {
    id: string;
    sessionId: string;
    userId: string;
    timestamp: number;       // Unix 纪元毫秒
    totalScore: number;
    repsCompleted: number;
    durationMs: number;
    movesCompleted: string[];
    frequentFeedbackCodes: { code: FeedbackCode; count: number }[];
    averageRepScore: number;
    peakRepScore: number;
}
