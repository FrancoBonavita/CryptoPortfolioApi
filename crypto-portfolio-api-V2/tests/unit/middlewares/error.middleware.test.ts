import type { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../../src/middlewares/error.middleware.js';
import { describe, expect, it, jest } from '@jest/globals';

function mockResponse(): Response {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res as unknown as Response;
}

describe('errorHandler', () => {

  it('returns 500 with success false', () => {
    const err = new Error('Something broke');
    const req = {} as Request;
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);

    const body = (res.json as jest.Mock).mock.calls[0]![0] as { success: boolean; error: string };
    expect(body.success).toBe(false);
    expect(typeof body.error).toBe('string');
    expect(body.error.length).toBeGreaterThan(0);
  });
});
