import { Logger } from '../Logger';

describe('Logger', () => {
    let consoleInfoSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;
    let consoleWarnSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => { });
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should log info messages', () => {
        Logger.info('TestTag', 'Info message', { data: 1 });
        expect(consoleInfoSpy).toHaveBeenCalledWith(
            expect.stringContaining('[INFO] [TestTag] Info message {"data":1}')
        );
    });

    it('should log error messages', () => {
        Logger.error('TestTag', 'Error message', new Error('oops'));
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('[ERROR] [TestTag] Error message {}')
        );
    });

    it('should log warning messages', () => {
        Logger.warn('TestTag', 'Warn message');
        expect(consoleWarnSpy).toHaveBeenCalledWith(
            expect.stringContaining('[WARN] [TestTag] Warn message')
        );
    });
});
