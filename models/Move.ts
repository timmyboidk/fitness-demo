import mongoose, { Schema, models, model } from 'mongoose';

const MoveSchema = new Schema({
    name: { type: String, required: true },
    category: String, // e.g. "Strength", "Cardio"
    difficulty: String, // "初级", "中级", "高级"
    duration: Number, // 默认时长(秒)
    icon: String, // Ionicons name
    // ONNX 与 AI 核心字段
    onnxModelPath: String, // 模型文件路径 e.g. "models/squat_v1.onnx"
    standardPoseData: Object, // 标准骨架数据 (JSON)
    scoringRules: { // 评分规则配置
        type: Map,
        of: String
    },
    createdAt: { type: Date, default: Date.now },
});

export const Move = models.Move || model('Move', MoveSchema);