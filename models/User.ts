import mongoose, { Schema, models, model } from 'mongoose';

const UserSchema = new Schema({
    // 登录信息
    phone: String,
    wechatOpenId: String, // 微信唯一标识
    wechatUnionId: String,

    // 个人资料
    nickname: { type: String, default: "健身爱好者" },
    avatar: { type: String, default: "" }, // 微信头像 URL

    // 用户的“书架” (仅展示已添加的内容)
    myMoves: [{ type: Schema.Types.ObjectId, ref: 'Move' }],
    mySessions: [{ type: Schema.Types.ObjectId, ref: 'Session' }],

    // 统计数据
    stats: {
        totalWorkouts: { type: Number, default: 0 },
        totalMinutes: { type: Number, default: 0 },
        accuracyAvg: { type: Number, default: 0 },
        activeDays: { type: Number, default: 0 }
    },

    createdAt: { type: Date, default: Date.now },
});

export const User = models.User || model('User', UserSchema);