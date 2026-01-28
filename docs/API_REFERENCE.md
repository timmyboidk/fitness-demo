# API 参考文档 (API Reference)

该文档描述了 Fitness Demo 应用程序使用的 API 端点。由于这是一个前端优先的演示项目，这些端点目前在 `services/api/client.ts` 中进行模拟 (Mock)。

## 基础 URL (Base URL)
默认值：`http://10.0.0.169:8080` (在客户端中模拟)

---

## 身份认证 (Authentication) - `AuthService.ts`

### 登录 (Login)
验证用户身份并检索 JWT 令牌。
- **端点**: `POST /api/auth`
- **请求体**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": "user_123",
      "nickname": "演示用户",
      "token": "jwt_token...",
      "isVip": false
    }
  }
  ```

### 新手引导 (Onboarding)
提交初始用户偏好设置。
- **端点**: `POST /api/auth/onboarding`
- **请求体**:
  ```json
  {
    "userId": "user_123",
    "difficulty": "Beginner",
    "goals": ["Weight Loss"]
  }
  ```

### 升级与支付 (Upgrade & Payment)
验证 Apple/Android 支付收据并升级用户。
- **端点**: `POST /api/pay/verify`
- **请求体**:
  ```json
  {
    "userId": "user_123",
    "planId": "yearly",
    "receipt": "base64_receipt_content...",
    "platform": "ios"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "isVip": true,
      "expireTime": 1735689600000
    }
  }
  ```

---

## 训练库 (Library) - `LibraryService.ts`

### 获取训练库 (Get Library)
获取所有可用的动作和训练课程。
- **端点**: `GET /api/library`
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "moves": [ ... ],
      "sessions": [ ... ]
    }
  }
  ```

---

## AI 评分 (AI Scoring) - `AIScoringService.ts`

### 提交视频分析 (Submit Video Analysis)
发送动作数据进行 AI 评分。
- **端点**: `POST /api/ai/score`
- **请求体**:
  ```json
  {
    "moveId": "m1",
    "keypoints": [ ... ]
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "score": 92,
    "feedback": ["动作标准"]
  }
  ```

---

## 数据分析 (Analytics) - `DataCollector.ts`

### 收集数据 (Collect Data)
发送使用情况遥测数据。
- **端点**: `POST /api/data/collect`
- **请求体**:
  ```json
  {
    "event": "workout_complete",
    "timestamp": 1234567890
  }
  ```
