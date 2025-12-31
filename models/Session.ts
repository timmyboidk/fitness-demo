import mongoose, { Schema, models, model } from 'mongoose';

const SessionSchema = new Schema({
    name: { type: String, required: true },
    desc: String,
    level: String,
    totalDuration: Number, // 分钟
    color: String, // UI 主题色
    // 课程由动作序列组成 (高内聚低耦合)
    moves: [{ type: Schema.Types.ObjectId, ref: 'Move' }],
    createdAt: { type: Date, default: Date.now },
});

export const Session = models.Session || model('Session', SessionSchema);