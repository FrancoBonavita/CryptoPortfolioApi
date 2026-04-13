import { describe, it, expect } from '@jest/globals';
import { logger } from '../../../src/utils/logger.js';

describe('logger', () => {

  it('exports a pino logger with info method', () => {
    expect(typeof logger.info).toBe('function');
  });

  it('exports a pino logger with warn method', () => {
    expect(typeof logger.warn).toBe('function');
  });

  it('exports a pino logger with error method', () => {
    expect(typeof logger.error).toBe('function');
  });
});