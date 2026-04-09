import type { Request, Response, NextFunction } from 'express';
import { securityHeaders, cors } from '../../../src/middlewares/security.middleware.js';
import { describe, expect, it, jest } from '@jest/globals';

function mockResponse(): Response {
  const res = {
    setHeader: jest.fn(),
    removeHeader: jest.fn(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
  return res as unknown as Response;
}

function mockRequest(overrides?: Partial<Request>): Request {
  return {
    method: 'GET',
    ip: '127.0.0.1',
    socket: { remoteAddress: '127.0.0.1' },
    ...overrides,
  } as unknown as Request;
}

describe('securityHeaders', () => {

  it('sets all security headers and calls next', () => {
    const req = mockRequest();
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    securityHeaders(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
    expect(res.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
    expect(res.setHeader).toHaveBeenCalledWith('Referrer-Policy', 'no-referrer');
    expect(res.removeHeader).toHaveBeenCalledWith('X-Powered-By');
    expect(next).toHaveBeenCalled();
  });
});

describe('cors', () => {

  it('sets CORS headers and calls next for non-OPTIONS requests', () => {
    const req = mockRequest({ method: 'GET' });
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    cors(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    expect(next).toHaveBeenCalled();
  });

  it('returns 204 immediately for OPTIONS preflight', () => {
    const req = mockRequest({ method: 'OPTIONS' });
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    cors(req, res, next);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
