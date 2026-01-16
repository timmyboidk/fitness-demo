/**
 * @file Move.ts
 * @description 动作数据模型。
 * 定义单个训练动作的属性，包括元数据、AI 模型路径和评分规则。
 */

import { Schema, model, models } from 'mongoose';

const MoveSchema = new Schema({
    name: { type: String, required: true }, // 动作名称
    category: String, // 分类: "Strength" (力量), "Cardio" (有氧) 等
    difficulty: String, // 难度: "初级", "中级", "高级"
    duration: Number, // 默认单组时长(秒)
    icon: String, // 对应前端 Ionicons 或 SF Symbols 的名称

    // --- AI 核心字段 ---
    onnxModelPath: String, // 专用的 ONNX 模型文件路径 e.g. "models/squat_v1.onnx"
    standardPoseData: Object, // 标准骨架序列数据 (JSON)，用于余弦相似度比对
    scoringRules: { // 评分规则配置 (如关注的角度、关键点权重)
        type: Map,
        of: String
    },

    createdAt: { type: Date, default: Date.now },
});

export const Move = models.Move || model('Move', MoveSchema);