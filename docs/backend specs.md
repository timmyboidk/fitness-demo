# 后端架构与 API 规范 (Backend Architecture & API Specification)

## 1. 架构设计 (Technical Architecture)

### 1.1 设计理念
采用 **模块化单体 (Modular Monolith)** 架构。通过清晰的 Maven 模块划分（`fitness-user`, `fitness-content`, `fitness-ai`, `fitness-data`, `fitness-pay`），实现在单一代码仓库中保持高内聚低耦合。未来可根据业务负载（如 AI 模块）轻松剥离为独立微服务。

### 1.2 技术栈选型 (Tech Stack)
| 领域                | 选型              | 版本   | 说明                                                              |
| :------------------ | :---------------- | :----- | :---------------------------------------------------------------- |
| **语言**            | **Java 21 (LTS)** | 21     | 核心特性：虚拟线程 (Virtual Threads) 实现海量数据采集的高并发处理 |
| **框架**            | **Spring Boot**   | 3.5.x  | 现代化的应用框架，内置可观测性支持                                |
| **数据访问**        | **MyBatis-Plus**  | 3.5.9  | 极速开发 CRUD，支持 Lambda 表达式                                 |
| **关系型数据库**    | **MySQL**         | 8.0    | 用于核心业务事务 (Tx) 存储                                        |
| **时序/分析数据库** | **Apache Doris**  | Latest | 经由 Kafka 消费录入，用于大规模埋点数据实时分析                   |
| **分布式缓存**      | **Redis**         | 7.0    | Session 管理、限流（令牌桶）、用户信息热点缓存                    |
| **消息队列**        | **Kafka**         | 7.5.0  | 采用 Kraft 模式。用于削峰填谷，连接数据采集与分析层               |
| **部署容载**        | **Docker + K8s**  | -      | 生产环境基于阿里云 ACK                                            |

---

## 2. 数据库设计 (Database Schema)

### 2.1 核心表结构

#### 用户表 (`user`)
| 字段             | 类型        | 描述                  |
| :--------------- | :---------- | :-------------------- |
| id               | BIGINT (PK) | 用户唯一 ID (自增)    |
| phone            | VARCHAR(32) | 手机号 (AES 加密存储) |
| nickname         | VARCHAR(64) | 用户昵称              |
| avatar_url       | VARCHAR(255)| 头像 URL              |
| open_id          | VARCHAR(64) | 微信 OpenID (唯一)    |
| difficulty_level | VARCHAR(32) | NOVICE/SKILLED/EXPERT |
| is_vip           | TINYINT(1)  | 是否为 VIP (0/1)      |
| vip_expire_time  | DATETIME    | VIP 过期时间          |
| total_score      | INT         | 累计评分              |
| total_duration   | INT         | 累计训练时长 (秒)     |
| total_calories   | INT         | 累计消耗热量 (kcal)   |
| push_token       | VARCHAR(255)| 消息推送 Token        |

#### 动作定义表 (`move`)
| 字段           | 类型         | 描述                           |
| :------------- | :----------- | :----------------------------- |
| id             | VARCHAR(32)  | 动作编码 (PK, 如 `m_squat`)    |
| name           | VARCHAR(64)  | 动作名称                       |
| difficulty     | VARCHAR(32)  | 适用等级                       |
| model_url      | VARCHAR(255) | ONNX 模型下载地址              |
| scoring_config | JSON         | 包含角度阈值、判定灵敏度等配置 |
| is_vip         | TINYINT(1)   | 是否为 VIP 专属 (0/1)          |

#### 训练课程表 (`training_session`)
| 字段       | 类型        | 描述                |
| :--------- | :---------- | :------------------ |
| id         | BIGINT (PK) | 课程 ID (自增)      |
| name       | VARCHAR(64) | 课程标题            |
| difficulty | VARCHAR(32) | 课程整体难度        |
| duration   | INT         | 预估训练时长 (分钟) |
| is_vip     | TINYINT(1)  | 是否为 VIP 专属 (0/1) |

#### 课程-动作关系表 (`session_move_relation`)
| 字段             | 类型   | 描述                     |
| :--------------- | :----- | :----------------------- |
| session_id       | BIGINT | 对应课程 ID              |
| move_id          | BIGINT | 对应动作 ID              |
| sort_order       | INT    | 在该课中的序号           |
| duration_seconds | INT    | 该组动作的执行时长或次数 |

---

## 3. API 参考 (API Reference)

```
| 状态码 | 描述 |
| :--- | :--- |
| **200** | 操作成功 |
| **400** | 参数验证失败 (Bad Request) |
| **401** | Token 失效或未登录 (Unauthorized) |
| **403** | 权限不足 (如非 VIP 访问 PRO 动作) |
| **429** | 请求过于频繁 (Rate Limit) |
| **500** | 业务逻辑错误或系统崩溃 |

**响应格式示例:**
```json
{
  "success": true,
  "code": "200",
  "message": "操作成功",
  "data": { ... },
  "timestamp": 1700000000000
}
```

### 3.1 身份认证 (`fitness-user`)

#### 1. 统一登录接口
**端点:** `POST /api/auth`

**请求示例:**
```json
{
  "type": "login_phone",
  "phone": "13800138000",
  "code": "1234"
}
```
**字段说明:**
- `type`: 登录类型，可选 `login_phone` (手机号) 或 `login_wechat` (微信)。
- `phone`: 手机号，仅在 `type` 为 `login_phone` 时必填。
- `code`: 验证码或微信授权 `code`。

**响应示例:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "nickname": "GymHero",
    "phone": "138****8000",
    "avatar": "https://oss.com/avatar.jpg",
    "token": "eyJhbG..."
  }
}
```
**字段说明:**
- `id`: 用户唯一 ID。
- `nickname`: 用户昵称。
- `phone`: 脱敏后的手机号。
- `avatar`: 头像链接。
- `token`: 后续请求需携带的 JWT Token (放入 `Authorization: Bearer <token>`)。

#### 2. 用户引导/初始化设置
**端点:** `POST /api/auth/onboarding`

**请求示例:**
```json
{
  "userId": "1",
  "difficultyLevel": "expert"
}
```
**字段说明:**
- `userId`: 用户 ID。
- `difficultyLevel`: 设定的初始难度 (`novice`, `skilled`, `expert`)。

**响应示例:**
```json
{
  "success": true,
  "data": {
    "scoringTolerance": 5,
    "recommendedPlan": "plan_starter"
  }
}
```

---

### 3.2 动作与内容 (`fitness-content`)

#### 1. 获取内容库
**端点:** `GET /api/library`

**请求参数:**
- `difficultyLevel` (Optional): 难度过滤，默认为 `novice`。

**响应示例:**
```json
{
  "success": true,
  "data": {
    "moves": [
      {
        "id": "m_squat",
        "name": "深蹲",
        "modelUrl": "https://oss.com/squat.onnx",
        "scoringConfig": { "angleThreshold": 20 }
      }
    ],
    "sessions": [
      {
        "id": "s_101",
        "name": "晨间唤醒",
        "difficulty": "novice",
        "duration": 15
      }
    ]
  }
}
```
**字段说明:**
- `moves`: 动作列表。`scoringConfig` 包含算法判别所需的阈值。
- `sessions`: 训练课列表。`duration` 为预估分钟数。

---

### 3.3 AI 评分与模型 (`fitness-ai`)

#### 1. 动作实时评分
**端点:** `POST /api/ai/score`

**请求示例:**
```json
{
  "moveId": "m_squat",
  "data": {
    "keypoints": [
      { "x": 0.5, "y": 0.5, "score": 0.9 }
    ],
    "userId": "1"
  }
}
```
**字段说明:**
- `moveId`: 正在进行的动作 ID。
- `data.keypoints`: 人体 17 个关键点坐标及置信度。

**响应示例:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "score": 85,
    "feedback": ["下蹲深度完美", "注意膝盖不要内扣"]
  }
}
```
**字段说明:**
- `score`: 本次动作的得分 (0-100)。
- `feedback`: 针对性的反馈文本列表。

#### 2. 模型版本检查
**端点:** `GET /api/core/models/latest`

**请求参数:**
- `platform`: `ios` 或 `android`。
- `currentVersion`: 当前设备上的模型版本。

**响应示例:**
```json
{
  "success": true,
  "data": {
    "hasUpdate": true,
    "data": {
      "version": "1.1.0",
      "downloadUrl": "https://oss.com/pose_v1.1.onnx",
      "md5": "a3f8...",
      "forceUpdate": false
    }
  }
}
```

---

### 3.4 数据采集 (`fitness-data`)

#### 1. 埋点数据批量上报
**端点:** `POST /api/data/collect`

**请求示例:**
```json
{
  "sessionId": "s_789",
  "items": [
    { "type": "score", "moveId": "m_squat", "score": 90 },
    { "type": "heart_rate", "value": 120 }
  ]
}
```
**字段说明:**
- `sessionId`: 当前训练会话 ID。
- `items`: 混合数据项列表，将直接被打入 Kafka。

---

### 3.5 个人中心与社交 (`fitness-social`)

#### 1. 获取个人训练统计 (Stats)
**端点:** `GET /api/user/stats`
**响应示例:**
```json
{
  "success": true,
  "data": {
    "weeklyDuration": 120,
    "totalCalories": 1500,
    "completionRate": 85,
    "history": [
      { "date": "2024-01-01", "duration": 30, "calories": 400 }
    ]
  }
}
```

#### 2. 全球排行榜 (Leaderboard)
**端点:** `GET /api/social/leaderboard`
**参数:** `type` (daily/weekly/all)
**响应示例:**
```json
{
  "success": true,
  "data": [
    { "rank": 1, "nickname": "GymHero", "score": 12500, "avatar": "..." },
    { "rank": 2, "nickname": "FitQueen", "score": 11800, "avatar": "..." }
  ]
}
```

#### 3. 动态广场 (Social Feed)
**端点:** `GET /api/social/feed`
**响应示例:**
```json
{
  "success": true,
  "data": [
    {
      "id": "f_1",
      "user": "GymHero",
      "content": "完成了晨间唤醒训练！",
      "type": "workout_complete",
      "time": "5分钟前"
    }
  ]
}
```

---

### 3.6 支付与会员 (`fitness-pay`)

#### 1. 支付凭证验证 (IAP Verification)
**端点:** `POST /api/pay/verify`
**描述:** 验证受 Apple/Android 收据凭证并升级用户为 VIP。

**请求示例:**
```json
{
  "userId": "1",
  "planId": "yearly",
  "receipt": "MIIS6AYJKoZIhvcNAQcCoIIS2TCCEtUCAQEx...",
  "platform": "ios"
}
```
**字段说明:**
- `userId`: 欲升级的用户 ID。
- `planId`: 订阅计划 (`monthly`, `quarterly`, `yearly`)。
- `receipt`: 苹果支付返回的 Base64 凭证内容。
- `platform`: `ios` 或 `android`。

**响应示例:**
```json
{
  "success": true,
  "data": {
    "isVip": true,
    "expireTime": 1735689600000,
    "planName": "年度计划"
  }
}
```
**逻辑流程:**
1. **确认**: 后端调用 Apple `verifyReceipt` 接口验证原始凭证。
2. **校验**: 检查凭证中的 `bundle_id` 和 `product_id` (与 `planId` 匹配)。
3. **更新**: 扣款确认后，在 `user` 表中标记用户为 VIP 并设置过期时间。
4. **事务**: 记录支付流水到 `payment_order` 表。

---

## 4. 数据流转路径 (Data Flow)

### 4.1 核心评分流
1. **客户端**: 运行 Pose Estimation 获取人体关键点。
2. **边缘计算 (可选)**: 客户端运行 ONNX 执行初步判定。
3. **上报**: 调用 `/api/ai/score` 进行云端复核。
4. **持久化**: 结果通过 Kafka 发送，`fitness-data` 消费者将其存入 MySQL (积分更新) 和 Doris (深度分析)。

### 4.2 支付与订阅流 (IAP Loop)
1. **起手**: 客户端通过 `iapService.purchase(planId)` 发起苹果支付请求。
2. **支付**: 弹出系统支付框，用户输入指纹/面容确认。
3. **回调**: 苹果支付成功后，`InAppPurchases` 触发 `setPurchaseListener` 回调。
4. **验证**: 客户端获取 `transactionReceipt`，调用 `/api/pay/verify` 将凭证发往后端。
5. **升级**: 后端验证通过后返回成功，客户端弹窗提示并返回，首页状态通过 Token/Profile 更新。

### 4.3 模型交付与分发
1. **供应商/模型组**: 上传训练好的 `.onnx` 文件至 OSS。
2. **后端管理**: 更新 `move` 表中的 `model_url`。

---

## 5. LLM 指令集：后端开发任务 (LLM Prompt for Backend Implementation)

> **Context**: 你是一位资深 Java 后端架构师，需要根据上述规范实现 `fitness-pay` 模块。
>
> **Task**:
> 1. 创建 `PaymentController` 处理收据验证请求。
> 2. 实现 `AppleIAPService` 集成苹果远程验证接口 (`https://buy.itunes.apple.com/verifyReceipt`)。
> 3. 实现收据去重逻辑，防止重放攻击 (Replay Attack)。
> 4. 使用 Spring 事务确保用户信息更新与订单记录的一致性。
> 5. **核心约束**: 必须处理 Sandbox 环境与 Production 环境的切换逻辑。
