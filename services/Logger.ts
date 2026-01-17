export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}

/**
 * 日志传输函数类型定义
 * @param level 日志级别
 * @param category 日志分类
 * @param message 日志消息
 * @param meta (可选) 元数据
 */
type LogTransport = (level: LogLevel, category: string, message: string, meta?: any) => void;

class LoggerService {
    private transports: LogTransport[] = [];
    private minLevel: LogLevel = LogLevel.DEBUG; // 默认为 DEBUG 级别

    constructor() {
        // 默认控制台传输器
        this.addTransport((level, category, message, meta) => {
            if (level < this.minLevel) return;

            const timestamp = new Date().toISOString();
            const levelLabel = LogLevel[level];
            const metaString = meta ? ` ${JSON.stringify(meta)}` : '';

            const logMsg = `[${timestamp}] [${levelLabel}] [${category}] ${message}${metaString}`;

            switch (level) {
                case LogLevel.DEBUG:
                    console.debug(logMsg);
                    break;
                case LogLevel.INFO:
                    console.info(logMsg);
                    break;
                case LogLevel.WARN:
                    console.warn(logMsg);
                    break;
                case LogLevel.ERROR:
                    console.error(logMsg);
                    break;
            }
        });
    }

    /**
     * 添加日志传输器
     * @param transport 传输函数
     */
    addTransport(transport: LogTransport) {
        this.transports.push(transport);
    }

    /**
     * 设置最小日志级别
     * @param level 日志级别
     */
    setMinLevel(level: LogLevel) {
        this.minLevel = level;
    }

    debug(category: string, message: string, meta?: any) {
        this.log(LogLevel.DEBUG, category, message, meta);
    }

    info(category: string, message: string, meta?: any) {
        this.log(LogLevel.INFO, category, message, meta);
    }

    warn(category: string, message: string, meta?: any) {
        this.log(LogLevel.WARN, category, message, meta);
    }

    error(category: string, message: string, meta?: any) {
        this.log(LogLevel.ERROR, category, message, meta);
    }

    private log(level: LogLevel, category: string, message: string, meta?: any) {
        this.transports.forEach(transport => transport(level, category, message, meta));
    }
}

export const Logger = new LoggerService();
