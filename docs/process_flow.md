# 项目流程图文档

本文档包含了项目的依赖关系图和核心业务流程图。

## 1. 模块依赖关系图 (Dependency Graph)

此图展示了各个核心模块、服务与组件之间的调用与依赖关系。

```mermaid
graph TD
    %% 定义样式
    classDef app fill:#f9f,stroke:#333,stroke-width:2px;
    classDef component fill:#dfd,stroke:#333,stroke-width:2px;
    classDef service fill:#bbf,stroke:#333,stroke-width:2px;
    classDef infrastructure fill:#fbb,stroke:#333,stroke-width:2px;

    subgraph UI_Layer [表现层 (UI/App)]
        direction TB
        AppEntry["应用入口 (App.tsx)"]:::app --> AuthScreen["认证页面"]:::app
        AppEntry --> MainTabs["主导航"]:::app
        MainTabs --> WorkoutScreen["训练页面"]:::app
    end

    subgraph Component_Layer [组件层 (Components)]
        WorkoutScreen --> PoseCamera["姿态检测相机<br/>(PoseDetectorCamera)"]:::component
    end

    subgraph Service_Layer [服务层 (Services)]
        PoseCamera --> AIScoring["AI评分服务<br/>(AIScoringService)"]:::service
        PoseCamera --> DataCollector["数据采集服务<br/>(DataCollector)"]:::service
        
        AIScoring -.-> Logic{"评分逻辑"}
        
        DataCollector --> Privacy["隐私脱敏处理"]:::service
        Privacy --> Buffer["本地缓冲"]:::service
        
        ModelUpdater["模型更新服务<br/>(ModelUpdater)"]:::service
    end

    subgraph Infra_Layer [基础设施与后端 (Infra & Backend)]
        AuthService["认证服务"]:::service --> APIClient["API客户端"]:::infrastructure
        AIScoring --> APIClient
        Buffer --> APIClient
        ModelUpdater --> APIClient
        ModelUpdater --> FileSystem["本地文件系统"]:::infrastructure
        
        APIClient --> BackendServer(("后端服务器")):::infrastructure
    end

    %% 关系连线
    AuthScreen --> AuthService
```

## 2. 核心业务流程图 (Business Process Flow)

此图描述了用户从登录到完成一次AI辅助训练的完整业务流程。

```mermaid
sequenceDiagram
    autonumber
    actor User as 用户
    participant App as APP界面
    participant Camera as 姿态相机组件
    participant AI as AI评分服务
    participant Collector as 数据采集服务
    participant Backend as 后端服务器
    participant Updater as 模型更新服务

    %% 模型检查流程
    rect rgb(240, 248, 255)
        Note over Updater, Backend: 应用启动/后台检查
        Updater->>Backend: 检查模型版本 /checkVersion
        Backend-->>Updater: 返回版本信息(URL, MD5)
        alt 发现新版本
            Updater->>Backend: 下载新模型
            Updater->>Updater: 校验MD5 & 更新本地模型
        end
    end

    %% 训练流程
    User->>App: 打开应用 & 登录
    User->>App: 选择训练课程
    App->>Camera: 启动相机 & 加载模型
    activate Camera
    
    loop 实时帧处理 (每秒/每帧)
        Camera->>Camera: 捕捉视频帧
        Camera->>Camera: 本地模型推理(Pose Detection)
        
        par 评分反馈
            Camera->>AI: 发送关键点数据
            AI->>AI: 计算动作评分 & 生成反馈
            AI-->>App: 返回分数 & 语音/UI提示
            App-->>User: 实时展示纠正建议
        and 数据收集
            Camera->>Collector: 记录动作数据
            Collector->>Collector: 隐私脱敏(加噪)
            Collector->>Collector: 存入本地Buffer
        end
    end
    
    User->>App: 结束训练
    deactivate Camera
    
    %% 数据上报流程
    rect rgb(255, 240, 240)
        Note over Collector, Backend: 批量数据上报
        Collector->>Collector: 检查网络状态 (Wi-Fi/4G)
        alt Wi-Fi环境
            Collector->>Backend: 上报完整数据
        else 4G环境
            Collector->>Backend: 上报精简数据(无骨骼点)
        end
        Backend-->>Collector: 确认接收
    end

    App-->>User: 展示训练总结报告
```
