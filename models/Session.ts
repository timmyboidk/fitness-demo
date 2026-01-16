/**
 * @file Session.ts
 * @description 训练课程数据模型。
 * 定义组合训练课程，包含多个有序的动作 (Moves)。
 */

import { Schema, model, models } from 'mongoose';

const SessionSchema = new Schema({
    name: { type: String, required: true }, // 课程名称
    desc: String, // 简短描述
    level: String, // 综合难度
    totalDuration: Number, // 预计总时长 (分钟)
    color: String, // UI 展示用的卡片主题色 Hex

    // --- 课程内容 ---
    // 课程由动作序列组成 (高内聚低耦合)，存储 Move 的 ObjectId引用
    moves: [{ type: Schema.Types.ObjectId, ref: 'Move' }],

    createdAt: { type: Date, default: Date.now },
});

export const Session = models.Session || model('Session', SessionSchema);