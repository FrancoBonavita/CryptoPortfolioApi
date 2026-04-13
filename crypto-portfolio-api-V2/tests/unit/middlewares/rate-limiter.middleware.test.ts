import { describe, it, expect } from '@jest/globals';
import { marketRateLimiter } from '../../../src/middlewares/rate-limit.middleware.js';

describe('marketRateLimiter', () => {

  it('exports a middleware function', () => {
    expect(typeof marketRateLimiter).toBe('function');
  });
});