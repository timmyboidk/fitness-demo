/**
 * @file Logger.test.ts
 * @description Unit tests for Logger service
 */

import { Logger, LogLevel } from '../Logger';

describe('Logger', () => {
    let consoleSpy: { [key: string]: jest.SpyInstance };

    beforeEach(() => {
        consoleSpy = {
            debug: jest.spyOn(console, 'debug').mockImplementation(),
            info: jest.spyOn(console, 'info').mockImplementation(),
            warn: jest.spyOn(console, 'warn').mockImplementation(),
            error: jest.spyOn(console, 'error').mockImplementation(),
        };
        // Reset min level to DEBUG for each test
        Logger.setMinLevel(LogLevel.DEBUG);
    });

    afterEach(() => {
        Object.values(consoleSpy).forEach(spy => spy.mockRestore());
    });

    describe('log levels', () => {
        it('should log debug messages', () => {
            Logger.debug('TestCategory', 'Debug message');

            expect(consoleSpy.debug).toHaveBeenCalled();
            const logMsg = consoleSpy.debug.mock.calls[0][0];
            expect(logMsg).toContain('[DEBUG]');
            expect(logMsg).toContain('[TestCategory]');
            expect(logMsg).toContain('Debug message');
        });

        it('should log info messages', () => {
            Logger.info('TestCategory', 'Info message');

            expect(consoleSpy.info).toHaveBeenCalled();
            const logMsg = consoleSpy.info.mock.calls[0][0];
            expect(logMsg).toContain('[INFO]');
        });

        it('should log warn messages', () => {
            Logger.warn('TestCategory', 'Warn message');

            expect(consoleSpy.warn).toHaveBeenCalled();
            const logMsg = consoleSpy.warn.mock.calls[0][0];
            expect(logMsg).toContain('[WARN]');
        });

        it('should log error messages', () => {
            Logger.error('TestCategory', 'Error message');

            expect(consoleSpy.error).toHaveBeenCalled();
            const logMsg = consoleSpy.error.mock.calls[0][0];
            expect(logMsg).toContain('[ERROR]');
        });
    });

    describe('log formatting', () => {
        it('should include timestamp in ISO format', () => {
            Logger.info('Test', 'Message');

            const logMsg = consoleSpy.info.mock.calls[0][0];
            // Check for ISO timestamp pattern
            expect(logMsg).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
        });

        it('should include metadata when provided', () => {
            Logger.info('Test', 'Message', { userId: 123, action: 'click' });

            const logMsg = consoleSpy.info.mock.calls[0][0];
            expect(logMsg).toContain('"userId":123');
            expect(logMsg).toContain('"action":"click"');
        });

        it('should not include metadata when not provided', () => {
            Logger.info('Test', 'Message');

            const logMsg = consoleSpy.info.mock.calls[0][0];
            expect(logMsg).not.toContain('{}');
        });
    });

    describe('setMinLevel', () => {
        it('should filter out logs below min level', () => {
            Logger.setMinLevel(LogLevel.WARN);

            Logger.debug('Test', 'Debug msg');
            Logger.info('Test', 'Info msg');
            Logger.warn('Test', 'Warn msg');
            Logger.error('Test', 'Error msg');

            expect(consoleSpy.debug).not.toHaveBeenCalled();
            expect(consoleSpy.info).not.toHaveBeenCalled();
            expect(consoleSpy.warn).toHaveBeenCalled();
            expect(consoleSpy.error).toHaveBeenCalled();
        });

        it('should allow all logs when set to DEBUG', () => {
            Logger.setMinLevel(LogLevel.DEBUG);

            Logger.debug('Test', 'Debug');
            Logger.info('Test', 'Info');
            Logger.warn('Test', 'Warn');
            Logger.error('Test', 'Error');

            expect(consoleSpy.debug).toHaveBeenCalled();
            expect(consoleSpy.info).toHaveBeenCalled();
            expect(consoleSpy.warn).toHaveBeenCalled();
            expect(consoleSpy.error).toHaveBeenCalled();
        });

        it('should only allow errors when set to ERROR', () => {
            Logger.setMinLevel(LogLevel.ERROR);

            Logger.debug('Test', 'Debug');
            Logger.info('Test', 'Info');
            Logger.warn('Test', 'Warn');
            Logger.error('Test', 'Error');

            expect(consoleSpy.debug).not.toHaveBeenCalled();
            expect(consoleSpy.info).not.toHaveBeenCalled();
            expect(consoleSpy.warn).not.toHaveBeenCalled();
            expect(consoleSpy.error).toHaveBeenCalled();
        });
    });

    describe('addTransport', () => {
        it('should call custom transport', () => {
            const customTransport = jest.fn();
            Logger.addTransport(customTransport);

            Logger.info('CustomTest', 'Hello', { key: 'value' });

            expect(customTransport).toHaveBeenCalledWith(
                LogLevel.INFO,
                'CustomTest',
                'Hello',
                { key: 'value' }
            );
        });

        it('should call all transports', () => {
            const transport1 = jest.fn();
            const transport2 = jest.fn();
            Logger.addTransport(transport1);
            Logger.addTransport(transport2);

            Logger.warn('Multi', 'Test');

            expect(transport1).toHaveBeenCalled();
            expect(transport2).toHaveBeenCalled();
        });
    });
});
