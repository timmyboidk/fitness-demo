/**
 * @file types/index.ts
 * @description Application-wide TypeScript interfaces and enums.
 *
 * Strict data structures for AI-powered fitness scoring,
 * real-time session tracking, and workout history.
 */

// ─────────────────────────────────────────────
//  Core User
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
//  Biomechanics – Joint & Angle Definitions
// ─────────────────────────────────────────────

/** Standard pose-estimation joint names (COCO-compatible). */
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
 * A single reference angle used to score form quality.
 * @property jointName   – The joint this angle is measured at.
 * @property targetAngleDeg – Ideal angle in degrees (0-360).
 * @property toleranceDeg   – Acceptable ± deviation before penalty.
 * @property weight         – Relative importance in composite score (0-1).
 */
export interface ReferenceAngle {
    jointName: JointName;
    targetAngleDeg: number;
    toleranceDeg: number;
    weight: number;
}

// ─────────────────────────────────────────────
//  Movement Phases
// ─────────────────────────────────────────────

/** Canonical movement phases for resistance exercises. */
export type MovementPhase = 'eccentric' | 'concentric' | 'isometric';

/**
 * Defines expected body geometry and timing for a single phase.
 * @property phase           – Which phase this definition covers.
 * @property durationMs      – Expected duration of this phase.
 * @property referenceAngles – Target joint angles specific to this phase.
 */
export interface PhaseDefinition {
    phase: MovementPhase;
    durationMs: number;
    referenceAngles: ReferenceAngle[];
}

// ─────────────────────────────────────────────
//  Scoring Configuration
// ─────────────────────────────────────────────

/**
 * Full scoring configuration attached to each Move.
 * Replaces the former `scoringConfig?: any`.
 *
 * @property referenceAngles         – Global (phase-agnostic) reference angles.
 * @property phases                  – Phase-specific angle targets and timings.
 * @property minConfidenceThreshold  – Minimum keypoint confidence to accept a frame (0-1).
 * @property maxRepDurationMs        – Timeout for a single rep before it's discarded.
 */
export interface ScoringConfig {
    referenceAngles: ReferenceAngle[];
    phases: PhaseDefinition[];
    minConfidenceThreshold: number;
    maxRepDurationMs: number;
}

// ─────────────────────────────────────────────
//  AI Feedback Codes
// ─────────────────────────────────────────────

/**
 * Discrete feedback codes produced by the AI scoring engine.
 * Grouped by severity: ERR (form error), WARN (tempo/ROM), SUCCESS (positive).
 */
export enum FeedbackCode {
    // ── Form Errors ──
    ERR_KNEE_VALGUS         = 'ERR_KNEE_VALGUS',
    ERR_ROUNDED_BACK        = 'ERR_ROUNDED_BACK',
    ERR_ELBOW_FLARE         = 'ERR_ELBOW_FLARE',
    ERR_SHALLOW_DEPTH       = 'ERR_SHALLOW_DEPTH',
    ERR_ASYMMETRIC_LOAD     = 'ERR_ASYMMETRIC_LOAD',
    ERR_HIP_SHIFT           = 'ERR_HIP_SHIFT',
    ERR_NECK_HYPEREXTENSION = 'ERR_NECK_HYPEREXTENSION',

    // ── Warnings ──
    WARN_TOO_FAST           = 'WARN_TOO_FAST',
    WARN_TOO_SLOW           = 'WARN_TOO_SLOW',
    WARN_PARTIAL_ROM        = 'WARN_PARTIAL_ROM',
    WARN_UNSTABLE_BASE      = 'WARN_UNSTABLE_BASE',

    // ── Success ──
    SUCCESS_PERFECT_REP     = 'SUCCESS_PERFECT_REP',
    SUCCESS_GOOD_FORM       = 'SUCCESS_GOOD_FORM',
    SUCCESS_IMPROVED        = 'SUCCESS_IMPROVED',
}

// ─────────────────────────────────────────────
//  Move & Session (Library Entities)
// ─────────────────────────────────────────────

export interface Move {
    id: string;
    name: string;
    level: string;
    icon: string; // SF Symbol icon name
    isVisible: boolean;
    modelUrl?: string;
    scoringConfig?: ScoringConfig;
}

export interface Session {
    id: string;
    name: string;
    time: string;       // e.g. "20 分钟"
    duration?: number;   // minutes
    count: string;       // e.g. "4 个动作"
    color: string;
    isVisible: boolean;
    moveIds: string[];
    difficulty?: string;
}

// ─────────────────────────────────────────────
//  AI Scoring API Contracts
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
//  Live Session State (Real-time Tracking)
// ─────────────────────────────────────────────

/**
 * Tracks the real-time state of an active workout.
 * Designed to be held in-memory and flushed to WorkoutHistory on completion.
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
//  Workout History (Persisted)
// ─────────────────────────────────────────────

/**
 * A completed workout record, persisted for progress charting.
 *
 * @property frequentFeedbackCodes – Aggregated feedback for trend analysis.
 * @property averageRepScore       – Mean score across all reps.
 * @property peakRepScore          – Best individual rep score achieved.
 */
export interface WorkoutHistory {
    id: string;
    sessionId: string;
    userId: string;
    timestamp: number;       // Unix epoch ms
    totalScore: number;
    repsCompleted: number;
    durationMs: number;
    movesCompleted: string[];
    frequentFeedbackCodes: { code: FeedbackCode; count: number }[];
    averageRepScore: number;
    peakRepScore: number;
}
