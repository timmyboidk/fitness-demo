/**
 * @file User.ts
 * @description 用户数据模型 (Mongoose Schema)。
 * 定义了用户的基本信息、认证标识、关联数据引用以及统计指标。
 */

import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    // --- 认证信息 ---
    phone: String, // 手机号
    wechatOpenId: String, // 微信唯一标识 (OpenID)
    wechatUnionId: String, // 微信开放平台唯一标识 (UnionID)

    // --- 个人资料 ---
    nickname: { type: String, default: "健身爱好者" },
    avatar: { type: String, default: "" }, // 头像 URL (通常来自微信或 S3)
    difficultyLevel: { type: String, default: "novice" }, // 训练难度偏好 (novice/skilled/expert)

    // --- 用户资产 (关联引用) ---
    // 用户的“书架” (仅展示已添加的 moves 和 sessions)
    myMoves: [{ type: Schema.Types.ObjectId, ref: 'Move' }],
    mySessions: [{ type: Schema.Types.ObjectId, ref: 'Session' }],

    // --- 运动统计数据 ---
    stats: {
        totalWorkouts: { type: Number, default: 0 }, // 总训练次数
        totalMinutes: { type: Number, default: 0 }, // 总训练时长 (分钟)
        accuracyAvg: { type: Number, default: 0 }, // 平均动作准确率 (%)
        activeDays: { type: Number, default: 0 } // 累计活跃天数
    },

    createdAt: { type: Date, default: Date.now },
});

export const User = models.User || model('User', UserSchema);