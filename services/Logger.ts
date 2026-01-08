export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}

type LogTransport = (level: LogLevel, category: string, message: string, meta?: any) => void;

class LoggerService {
    private transports: LogTransport[] = [];
    private minLevel: LogLevel = LogLevel.DEBUG; // Default to DEBUG for now

    constructor() {
        // Default Console Transport
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

    addTransport(transport: LogTransport) {
        this.transports.push(transport);
    }

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
