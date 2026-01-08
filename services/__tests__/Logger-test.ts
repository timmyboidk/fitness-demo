import { Logger, LogLevel } from '../Logger';

describe('Logger Service', () => {
    let consoleDebugSpy: jest.SpyInstance;
    let consoleInfoSpy: jest.SpyInstance;
    let consoleWarnSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        // Spy on console methods
        consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
        consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        // Reset Logger state if possible, but it's a singleton.
        // We can just add a new transport or verify default behavior.
        // Since we can't easily clear transports without a clear method, we'll verify via console calls 
        // which are used by the default transport added in constructor.
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

        // Reset min level
        Logger.setMinLevel(LogLevel.DEBUG);
    });
});
