# AI 模型需求规格说明书 (AI Model Requirements Specification)

## 1. 概述 (Overview)
本文档定义了健身应用中使用的 AI 计算机视觉模型的功能和非功能需求。这些模型主要负责 2D 姿态估计、动作评分以及单目视频的 3D 人体生成。目标是为开发团队提供可执行的验收标准。

## 2. 功能需求 (Functional Requirements)

### 2.1 2D 姿态估计模型 (Pose Estimation)
此模型负责从 RGB 帧中提取人体骨骼关键点。

*   **输入规范 (Input Specs):**
    *   **格式:** RGB 图像流 (NV21/YUV420 转 RGB)。
    *   **张量形状 (Tensor Shape):** `[1, 256, 256, 3]` 或 `[1, 192, 192, 3]` (需在预处理阶段进行 Padding 和 Resize)。
    *   **像素值范围:** 归一化至 `[0, 1]` 或 `[-1, 1]`。
*   **输出规范 (Output Specs):**
    *   **关键点:** 17 点 (COCO 拓扑) 或 33 点 (BlazePose 拓扑)。
    *   **输出张量:** `[1, 17, 3]` (x, y, visibility) 或 heatmap + offset。
    *   **后处理:** 必须包含 Non-Maximum Suppression (NMS) 逻辑（如果模型未内置）。
*   **验收标准:**
    *   在遮挡情况下（如深蹲时大腿遮挡小腿），模型的推测必须符合人体解剖学约束。

### 2.2 动作评分与分析 (Movement Scoring & Analysis)
基于时间序列的关键点数据评估动作质量。

*   **输入数据:**
    *   `KeypointSequence`: 长度为 `T` 的滑动窗口 (例如 T=30 帧)。
    *   `MoveReference`: 动作的标准模板（包含关键角度的允许公差）。
*   **核心算法逻辑:**
    1.  **阶段识别 (Phase Recognition):** 使用状态机识别 `Eccentric` (离心), `Concentric` (向心), `Isometric` (等长) 阶段。
    2.  **角度计算 (Compute Angles):** 实时计算关键关节角度 (例如膝关节、髋关节)。
    3.  **评分函数:** $Score = 100 - \sum (w_i \times |Angle_{user} - Angle_{ref}|)$。
*   **输出:**
    *   `Score` (Int): 0-100。
    *   `FeedbackCode` (String): e.g., "ERR_KNEE_VALGUS" (膝外翻)。

### 2.3 3D 人体生成 (3D Human Generation) - [NEW]
从 2D 视频流实时重建 3D Mesh。

*   **输入规范:**
    *   **源:** 单目 2D RGB 视频流 (720p, 30fps)。
    *   **相机参数:** 内参矩阵 (Intrinsics) 需根据设备 FOV 估算。
*   **模型架构:**
    *   **骨干网:** MobileNetV3 或 EfficientNet-Lite (轻量级)。
    *   **Head:** SMPL Head 或直接 Mesh Regressor。
*   **输出规范:**
    *   **SMPL 参数:** `Pose` (72维旋转向量), `Shape` (10维 Beta 系数), `Trans` (3维全局位移)。
    *   **Mesh:** 包含 6890 个定点 (SMPL 标准) 或简化版 (2000-3000 顶点) 以优化移动端渲染。
*   **渲染一致性:**
    *   生成的 Mesh 必须与原视频的 2D 投影误差 < 15像素。

## 3. 非功能需求 (Non-Functional Requirements)

### 3.1 参考性能基准 (Reference Performance Benchmarks)
*(注: 以下数据作为优化目标参考，非绝对拒收标准，需结合实际体验判定)*

| 指标                   | 目标参考值 | 备注                          |
| :--------------------- | :--------- | :---------------------------- |
| **初始化时间**         | < 500ms    | 模型加载时间                  |
| **单帧推理 (iOS)**     | < 33ms     | iPhone 12 及以上 (NPU CoreML) |
| **单帧推理 (Android)** | < 40ms     | Snapdragon 865, GPU Delegate  |
| **显存占用**           | < 400MB    | 包含模型权重 + 中间张量       |
| **冷启动峰值功耗**     | < 3.5W     | 防止瞬间掉电                  |

### 3.2 准确度参考指标 (Accuracy Reference Metrics)
*   **2D PCK@0.2:** > 90% (Percentage of Correct Keypoints)。
*   **3D MPJPE:** < 70mm。
*   **PA-MPJPE:** < 50mm。

### 3.3 滤波器配置 (Smoothing)
为防止 3D 模型“抖动”，必须在输出端应用滤波器：
*   **算法:** One Euro Filter 或 Kalman Filter。
*   **参数:** $MinCutoff = 1.0 Hz$, $Beta = 0.007$。

---

## 4. 模型交付检查单 (Model Delivery Checklist)

在模型正式集成到 App 之前，算法团队需完成以下自查并提供证明材料：

### 4.1 格式与规范
- [ ] **文件格式:** 提供 `.onnx` (FP32) 用于跨平台，以及 `.tflite` (INT8/FP16) 用于 Android NPU 加速，`.mlpackage` 用于 iOS CoreML。
- [ ] **元数据:** 模型文件内嵌 Metadata，包含 Version Code, Input Shape (`NxHxWxC`), Output Map。
- [ ] **接口对齐:** 输入输出 Tensor 名称与 `3d_implementation_plan.md` 定义完全一致。

### 4.2 质量验证 (Quality Assurance)
- [ ] **防抖测试:** 在静止状态下（如 T-Pose），关键点/Mesh 顶点的抖动幅度 < 2mm (标准差)。
- [ ] **遮挡鲁棒性:** 模拟下半身遮挡（如半身入镜），模型不应产生飞点或严重形变（允许输出低置信度，但不能输出错误坐标）。
- [ ] **极端角度:** 能够处理侧身 90 度和背身 180 度的姿态估计，不出现左右肢体反转。
- [ ] **光照适应性:** 在低光环境 (10 lux) 和强逆光环境下，仍能检测到人体轮廓。

### 4.3 性能合规
- [ ] **热测试:** 连续运行 15 分钟，目标样机（例：iPhone 11）背部温度不超过 42℃。
- [ ] **内存泄漏:** 连续推理 10000 帧，内存增长 < 10MB。
- [ ] **Crash Free:** 跑通 Standard Validation Set (1000 videos) 无崩溃。

## 5. 交付物清单 (Deliverables)
1.  **模型文件包:** 包含所有针对不同平台的优化版本。
2.  **测试报告 (PDF):** 包含上述 Checklist 的逐项测试结果截图/日志。
3.  **Demo 工程:** 一个最小化的 Python 或 C++ 脚本，演示如何预处理 Input 并解析 Output。
