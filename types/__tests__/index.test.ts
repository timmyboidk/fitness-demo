/**
 * @file types/__tests__/index.test.ts
 * @description Tests for strict data structure definitions.
 * Validates FeedbackCode enum, ScoringConfig structure,
 * LiveSessionState and WorkoutHistory interfaces.
 */

import {
    FeedbackCode,
    JointName,
    LiveSessionState,
    MovementPhase,
    PhaseDefinition,
    ReferenceAngle,
    ScoringConfig,
    WorkoutHistory,
    Keypoint,
    ScoreResponse,
    Move,
} from '../../types';

describe('FeedbackCode enum', () => {
    it('should contain all expected error codes', () => {
        expect(FeedbackCode.ERR_KNEE_VALGUS).toBe('ERR_KNEE_VALGUS');
        expect(FeedbackCode.ERR_ROUNDED_BACK).toBe('ERR_ROUNDED_BACK');
        expect(FeedbackCode.ERR_ELBOW_FLARE).toBe('ERR_ELBOW_FLARE');
        expect(FeedbackCode.ERR_SHALLOW_DEPTH).toBe('ERR_SHALLOW_DEPTH');
        expect(FeedbackCode.ERR_ASYMMETRIC_LOAD).toBe('ERR_ASYMMETRIC_LOAD');
        expect(FeedbackCode.ERR_HIP_SHIFT).toBe('ERR_HIP_SHIFT');
        expect(FeedbackCode.ERR_NECK_HYPEREXTENSION).toBe('ERR_NECK_HYPEREXTENSION');
    });

    it('should contain all expected warning codes', () => {
        expect(FeedbackCode.WARN_TOO_FAST).toBe('WARN_TOO_FAST');
        expect(FeedbackCode.WARN_TOO_SLOW).toBe('WARN_TOO_SLOW');
        expect(FeedbackCode.WARN_PARTIAL_ROM).toBe('WARN_PARTIAL_ROM');
        expect(FeedbackCode.WARN_UNSTABLE_BASE).toBe('WARN_UNSTABLE_BASE');
    });

    it('should contain all expected success codes', () => {
        expect(FeedbackCode.SUCCESS_PERFECT_REP).toBe('SUCCESS_PERFECT_REP');
        expect(FeedbackCode.SUCCESS_GOOD_FORM).toBe('SUCCESS_GOOD_FORM');
        expect(FeedbackCode.SUCCESS_IMPROVED).toBe('SUCCESS_IMPROVED');
    });

    it('should have exactly 14 codes', () => {
        const codeValues = Object.values(FeedbackCode);
        expect(codeValues).toHaveLength(14);
    });
});

describe('ScoringConfig', () => {
    const validReferenceAngle: ReferenceAngle = {
        jointName: 'LEFT_KNEE',
        targetAngleDeg: 90,
        toleranceDeg: 10,
        weight: 0.8,
    };

    const validPhase: PhaseDefinition = {
        phase: 'eccentric',
        durationMs: 2000,
        referenceAngles: [validReferenceAngle],
    };

    const validConfig: ScoringConfig = {
        referenceAngles: [validReferenceAngle],
        phases: [validPhase],
        minConfidenceThreshold: 0.6,
        maxRepDurationMs: 10000,
    };

    it('should accept a valid ScoringConfig', () => {
        expect(validConfig.referenceAngles).toHaveLength(1);
        expect(validConfig.phases).toHaveLength(1);
        expect(validConfig.minConfidenceThreshold).toBe(0.6);
        expect(validConfig.maxRepDurationMs).toBe(10000);
    });

    it('should have valid phase definitions', () => {
        const phase = validConfig.phases[0];
        expect(phase.phase).toBe('eccentric');
        expect(phase.durationMs).toBeGreaterThan(0);
        expect(phase.referenceAngles).toHaveLength(1);
    });

    it('should enforce reference angle structure', () => {
        const angle = validConfig.referenceAngles[0];
        expect(angle.jointName).toBe('LEFT_KNEE');
        expect(angle.targetAngleDeg).toBeGreaterThanOrEqual(0);
        expect(angle.targetAngleDeg).toBeLessThanOrEqual(360);
        expect(angle.toleranceDeg).toBeGreaterThan(0);
        expect(angle.weight).toBeGreaterThan(0);
        expect(angle.weight).toBeLessThanOrEqual(1);
    });

    it('should validate movement phase types', () => {
        const validPhases: MovementPhase[] = ['eccentric', 'concentric', 'isometric'];
        validPhases.forEach(p => {
            const def: PhaseDefinition = { phase: p, durationMs: 1000, referenceAngles: [] };
            expect(def.phase).toBe(p);
        });
    });
});

describe('LiveSessionState', () => {
    it('should create a valid initial session state', () => {
        const state: LiveSessionState = {
            sessionId: 's1',
            currentMoveIndex: 0,
            currentRepCount: 0,
            currentPhase: 'concentric',
            accumulatedScore: 0,
            elapsedMs: 0,
            activeFeedbackCodes: [],
            isPaused: false,
            isComplete: false,
        };

        expect(state.sessionId).toBe('s1');
        expect(state.currentMoveIndex).toBe(0);
        expect(state.currentRepCount).toBe(0);
        expect(state.isPaused).toBe(false);
        expect(state.isComplete).toBe(false);
    });

    it('should track active feedback codes', () => {
        const state: LiveSessionState = {
            sessionId: 's1',
            currentMoveIndex: 0,
            currentRepCount: 3,
            currentPhase: 'eccentric',
            accumulatedScore: 85,
            elapsedMs: 45000,
            activeFeedbackCodes: [FeedbackCode.WARN_TOO_FAST, FeedbackCode.ERR_KNEE_VALGUS],
            isPaused: false,
            isComplete: false,
        };

        expect(state.activeFeedbackCodes).toContain(FeedbackCode.WARN_TOO_FAST);
        expect(state.activeFeedbackCodes).toContain(FeedbackCode.ERR_KNEE_VALGUS);
        expect(state.activeFeedbackCodes).toHaveLength(2);
    });
});

describe('WorkoutHistory', () => {
    it('should create a valid workout record', () => {
        const history: WorkoutHistory = {
            id: 'wh_001',
            sessionId: 's1',
            userId: 'u_123',
            timestamp: Date.now(),
            totalScore: 92,
            repsCompleted: 15,
            durationMs: 1200000,
            movesCompleted: ['m_run', 'm_yoga'],
            frequentFeedbackCodes: [
                { code: FeedbackCode.SUCCESS_GOOD_FORM, count: 10 },
                { code: FeedbackCode.WARN_TOO_FAST, count: 3 },
            ],
            averageRepScore: 88.5,
            peakRepScore: 97,
        };

        expect(history.id).toBe('wh_001');
        expect(history.totalScore).toBe(92);
        expect(history.repsCompleted).toBe(15);
        expect(history.movesCompleted).toHaveLength(2);
        expect(history.frequentFeedbackCodes).toHaveLength(2);
        expect(history.averageRepScore).toBeLessThanOrEqual(history.peakRepScore);
    });

    it('should handle feedback frequency tracking', () => {
        const history: WorkoutHistory = {
            id: 'wh_002',
            sessionId: 's2',
            userId: 'u_123',
            timestamp: Date.now(),
            totalScore: 75,
            repsCompleted: 20,
            durationMs: 2400000,
            movesCompleted: ['m_strength_trad'],
            frequentFeedbackCodes: [
                { code: FeedbackCode.ERR_ROUNDED_BACK, count: 8 },
                { code: FeedbackCode.ERR_KNEE_VALGUS, count: 5 },
                { code: FeedbackCode.SUCCESS_IMPROVED, count: 3 },
            ],
            averageRepScore: 72,
            peakRepScore: 91,
        };

        const errors = history.frequentFeedbackCodes.filter(f => f.code.startsWith('ERR'));
        expect(errors).toHaveLength(2);

        const totalFeedbackCount = history.frequentFeedbackCodes.reduce((sum, f) => sum + f.count, 0);
        expect(totalFeedbackCount).toBe(16);
    });
});

describe('Move with ScoringConfig', () => {
    it('should accept a Move with optional ScoringConfig', () => {
        const move: Move = {
            id: 'm_test',
            name: 'Test Move',
            level: 'Intermediate',
            icon: 'figure.run',
            isVisible: true,
            scoringConfig: {
                referenceAngles: [
                    { jointName: 'LEFT_KNEE', targetAngleDeg: 90, toleranceDeg: 15, weight: 0.7 },
                ],
                phases: [
                    {
                        phase: 'eccentric',
                        durationMs: 2000,
                        referenceAngles: [
                            { jointName: 'LEFT_KNEE', targetAngleDeg: 170, toleranceDeg: 10, weight: 0.7 },
                        ],
                    },
                ],
                minConfidenceThreshold: 0.5,
                maxRepDurationMs: 8000,
            },
        };

        expect(move.scoringConfig).toBeDefined();
        expect(move.scoringConfig!.referenceAngles).toHaveLength(1);
        expect(move.scoringConfig!.phases).toHaveLength(1);
    });

    it('should accept a Move without ScoringConfig', () => {
        const move: Move = {
            id: 'm_basic',
            name: 'Basic Move',
            level: 'Easy',
            icon: 'figure.stand',
            isVisible: true,
        };

        expect(move.scoringConfig).toBeUndefined();
    });
});

describe('ScoreResponse with feedbackCodes', () => {
    it('should include both feedback strings and codes', () => {
        const response: ScoreResponse = {
            success: true,
            score: 85,
            feedback: ['Good form overall', 'Watch your knee alignment'],
            feedbackCodes: [FeedbackCode.SUCCESS_GOOD_FORM, FeedbackCode.WARN_PARTIAL_ROM],
        };

        expect(response.feedbackCodes).toHaveLength(2);
        expect(response.feedback).toHaveLength(2);
        expect(response.feedbackCodes).toContain(FeedbackCode.SUCCESS_GOOD_FORM);
    });
});

describe('Keypoint', () => {
    it('should accept keypoint with optional name', () => {
        const kp: Keypoint = {
            x: 0.5,
            y: 0.3,
            score: 0.95,
            name: 'LEFT_SHOULDER',
        };

        expect(kp.name).toBe('LEFT_SHOULDER');
        expect(kp.score).toBeGreaterThan(0);
    });

    it('should accept keypoint without name', () => {
        const kp: Keypoint = {
            x: 0.2,
            y: 0.8,
            score: 0.7,
        };

        expect(kp.name).toBeUndefined();
    });
});
