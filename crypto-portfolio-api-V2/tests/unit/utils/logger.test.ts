import { describe, expect, it, jest } from '@jest/globals';
import { logger } from '../../../src/utils/logger.js';

describe('logger', () => {

  it('info outputs valid JSON with correct level', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

    logger.info('test message', { extra: 'data' });

    expect(spy).toHaveBeenCalledTimes(1);
    const output = JSON.parse(spy.mock.calls[0]![0] as string);
    expect(output.level).toBe('info');
    expect(output.message).toBe('test message');
    expect(output.extra).toBe('data');
    expect(output.timestamp).toBeDefined();

    spy.mockRestore();
  });

  it('warn outputs to console.warn', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    logger.warn('warning');

    expect(spy).toHaveBeenCalledTimes(1);
    const output = JSON.parse(spy.mock.calls[0]![0] as string);
    expect(output.level).toBe('warn');

    spy.mockRestore();
  });

  it('error outputs to console.error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    logger.error('failure', { code: 500 });

    expect(spy).toHaveBeenCalledTimes(1);
    const output = JSON.parse(spy.mock.calls[0]![0] as string);
    expect(output.level).toBe('error');
    expect(output.code).toBe(500);

    spy.mockRestore();
  });
});
