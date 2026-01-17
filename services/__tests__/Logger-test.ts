import { Logger, LogLevel } from '../Logger';

describe('Logger Service', () => {
    let consoleDebugSpy: jest.SpyInstance;
    let consoleInfoSpy: jest.SpyInstance;
    let consoleWarnSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        // 监视 console 方法
        consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
        consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        // 如果可能，重置 Logger 状态。但它是一个单例。
        // 我们只需添加一个新的传输器或验证默认行为。
        // 由于没有清除方法，很难清除传输器，我们将通过验证构造函数中添加的默认传输器所调用的 console 方法来进行测试。
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should log debug messages', () => {
        Logger.debug('Test', 'Debug message');
        expect(consoleDebugSpy).toHaveBeenCalledWith(expect.stringContaining('[DEBUG] [Test] Debug message'));
    });

    it('should log info messages', () => {
        Logger.info('Test', 'Info message');
        expect(consoleInfoSpy).toHaveBeenCalledWith(expect.stringContaining('[INFO] [Test] Info message'));
    });

    it('should log warn messages', () => {
        Logger.warn('Test', 'Warn message');
        expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('[WARN] [Test] Warn message'));
    });

    it('should log error messages', () => {
        Logger.error('Test', 'Error message');
        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('[ERROR] [Test] Error message'));
    });

    it('should include meta data in logs', () => {
        Logger.info('Test', 'Message with meta', { key: 'value' });
        expect(consoleInfoSpy).toHaveBeenCalledWith(expect.stringContaining('{"key":"value"}'));
    });

    it('should respect custom transports', () => {
        const mockTransport = jest.fn();
        Logger.addTransport(mockTransport);

        Logger.info('Test', 'Transport check');

        expect(mockTransport).toHaveBeenCalledWith(LogLevel.INFO, 'Test', 'Transport check', undefined);
    });

    it('should filter logs below min level', () => {
        Logger.setMinLevel(LogLevel.WARN);

        Logger.info('Test', 'Should be ignored');
        Logger.warn('Test', 'Should be logged');

        expect(consoleInfoSpy).not.toHaveBeenCalledWith(expect.stringContaining('Should be ignored'));
        expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Should be logged'));

        // 重置最小日志级别
        Logger.setMinLevel(LogLevel.DEBUG);
    });
});
