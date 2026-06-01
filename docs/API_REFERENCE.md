# 后端开发任务与 API 规约 (Backend Task & API Reference)

该文档定义了 Fitness App 的后端业务逻辑及全量接口规约。它可以直接作为提示词 (Prompt) 赋予后端工程师或 AI 代码助手，以实现与当前前端应用完全对齐的后端服务。

---

## 1. 核心开发目标
实现一个基于 Spring Boot 3 的单体后端，管理用户身份、训练内容、AI 评分反馈以及 IAP 支付闭环。

## 2. 基础规范 (Base Specs)
*   **Base URL**: `http://<server-ip>:8080`
*   **认证**: 除登录接口外，Header 必须包含 `Authorization: Bearer <JWT_TOKEN>`。
*   **通用响应外壳**:
```json
{
  "success": true,
  "code": "200",
  "message": "操作成功",
  "data": {},
  "timestamp": 1706342400000
}
```

---

## 3. 接口详细规约

### 3.1 身份认证模块 (`fitness-auth`)

#### 1) 统一登录 (POST `/api/auth`)
请求时通过 `type` 字段区分登录方式。

**请求**:
```json
{
  "type": "login_phone",
  "phone": "13800138000",
  "code": "1234"
}
```

**微信登录**:
```json
{
  "type": "login_wechat",
  "payload": { "code": "wx_auth_code_xyz" }
}
```

**响应 (Data)**:
```json
{
  "id": "u_001",
  "nickname": "健身达人",
  "avatar": "https://...",
  "token": "eyJhbG...",
  "isVip": false,
  "difficultyLevel": "novice"
}
```

#### 2) 用户新手引导设置 (POST `/api/auth/onboarding`)
**请求**: `{ "userId": "u_001", "difficultyLevel": "skilled" }`

**响应 (Data)**:
```json
{
  "status": "updated",
  "scoringTolerance": 5,
  "recommendedPlan": "plan_starter"
}
```

---

### 3.2 内容库模块 (`fitness-library`)

#### 1) 同步库数据 (GET `/api/library`)
**查询参数**: `difficultyLevel=skilled` (可选)

**响应 (Data)**:
```json
{
  "moves": [
    {
      "id": "m_001",
      "name": "波比跳",
      "level": "中级",
      "icon": "figure.run",
      "isVisible": true,
      "isVip": false,
      "modelUrl": "https://...",
      "scoringConfig": { "angleThreshold": 45 }
    }
  ],
  "sessions": [
    {
      "id": "s_001",
      "name": "燃脂课程",
      "duration": 20,
      "count": "4 个动作",
      "color": "#D1D1D6",
      "isVisible": true,
      "isVip": true,
      "moveIds": ["m_001", "m_002"]
    }
  ]
}
```

#### 2) 用户添加内容 (POST `/api/library`)
**请求**:
```json
{
  "type": "add_item",
  "payload": {
    "userId": "u_001",
    "itemId": "m_001",
    "itemType": "move"
  }
}
```
**说明**：`itemType` 可选 `move` 或 `session`。

**响应 (Data)**:
```json
{
  "user": {
    "id": "u_001",
    "myMoves": [{ "id": "m_001", "name": "波比跳", ... }],
    "mySessions": []
  }
}
```

#### 3) 查询动作列表 (GET `/api/moves`)
**响应 (Data)**: 动作对象数组
```json
[
  { "id": "m_001", "name": "Push Up", "level": "Beginner", "category": "Strength" }
]
```

---

### 3.3 AI 核心与监控模块 (`fitness-ai-analytics`)

#### 1) AI 实时动作评分 (POST `/api/ai/score`)
**请求**:
```json
{
  "moveId": "m_001",
  "data": {
    "keypoints": [{ "x": 0.5, "y": 0.2, "score": 0.9 }],
    "userId": "u_001"
  }
}
```

**响应 (Data)**:
```json
{
  "score": 95,
  "feedback": ["手臂伸直", "核心收紧"],
  "feedbackCodes": ["SUCCESS_GOOD_FORM"]
}
```

#### 2) 批量采集上传 (POST `/api/data/collect`)
**请求**:
```json
{
  "sessionId": "guid_123",
  "items": [
    { "type": "score", "moveId": "m_001", "score": 88, "timestamp": 1706342400000 },
    { "type": "heart_rate", "value": 145, "timestamp": 1706342405000 }
  ]
}
```

**响应 (Data)**: `{ "recorded": true }`

#### 3) 模型版本检查 (GET `/api/core/models/latest`)
**参数**: `platform=ios&currentVersion=1.0.0`

**响应 (Data)**:
```json
{
  "hasUpdate": true,
  "data": {
    "version": "1.1.0",
    "downloadUrl": "https://oss.com/pose_v1.1.onnx",
    "md5": "a3f8...",
    "forceUpdate": false
  }
}
```

---

### 3.4 支付与会员中心 (`fitness-pay`)

#### 1) 会员凭证校验 (POST `/api/pay/verify`)
**请求**:
```json
{
  "userId": "u_001",
  "planId": "yearly",
  "receipt": "MIIS6AYJKoZIhvcNAQc...",
  "platform": "ios"
}
```

**响应 (Data)**:
```json
{
  "isVip": true,
  "expireTime": 1735689600000,
  "planName": "年度订阅"
}
```

---

### 3.5 个人广场与统计 (`fitness-social`)

#### 1) 获取训练统计 (GET `/api/user/stats`)
**响应 (Data)**:
```json
{
  "weeklyDuration": 120,
  "totalCalories": 1500,
  "completionRate": 85,
  "history": [
    { "date": "2024-01-20", "duration": 30, "calories": 400 }
  ]
}
```

#### 2) 获取排行榜 (GET `/api/social/leaderboard`)
**参数**: `type=weekly` (可选 daily/weekly/all)

**响应 (Data)**:
```json
[
  { "rank": 1, "nickname": "训练营课代表", "score": 12500, "avatar": "..." },
  { "rank": 2, "nickname": "周六坚持健身", "score": 11800, "avatar": "..." }
]
```

#### 3) 动态广场 (GET `/api/social/feed`)
**响应 (Data)**:
```json
[
  { "id": "f_1", "user": "Jack", "content": "完成了 HIIT 训练", "type": "workout_complete", "time": "5分钟前" }
]
```

---

## 4. 后端关键业务逻辑要求
1.  **支付幂等性**：服务器必须验证 `receipt` 中的 `transaction_id` 是否已被处理，避免重复充值。
2.  **安全性**：所有 API 请求需验证 JWT。敏感数据（如手机号）在数据库中需加密。
3.  **权限拦截**：
    *   若用户非 VIP，访问 `isVip: true` 的内容应返回 `403 Forbidden`。
    *   AI 评分接口应校验用户是否有权对该动作进行训练。
4.  **错误处理映射**:
    *   `400`: 参数校验失败。
    *   `401`: 未认证。
    *   `403`: 权限不足（如非 VIP 访问 PRO 动作）。
    *   `429`: AI 服务限流。

## 5. 变更记录
| 版本 | 日期 | 变更说明 |
|:---|:---|:---|
| v2.0 | 2026-06-01 | Auth 端点统一为 `POST /api/auth`；新增 `POST /api/library`、`GET /api/moves`；补齐模型检查、统计、社交、数据采集接口；修正响应字段（`isVip`、`feedbackCodes`）；统一响应外壳 |
| v1.0 | - | 初始版本 |
