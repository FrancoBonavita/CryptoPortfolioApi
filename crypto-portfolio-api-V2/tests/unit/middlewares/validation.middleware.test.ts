import type { Request, Response, NextFunction } from 'express';
import { validateCreateAsset, validateUpdateAsset } from '../../../src/middlewares/validation.middleware.js';
import { describe, expect, it, jest } from '@jest/globals';

function mockResponse(): Response {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res as unknown as Response;
}

function mockRequest(body: unknown): Request {
  return { body } as unknown as Request;
}

describe('validateCreateAsset', () => {

  it('calls next() when body is valid', () => {
    const req = mockRequest({ symbol: 'BTC', name: 'Bitcoin', quantity: 1, purchasePrice: 40000 });
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    validateCreateAsset(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 400 when all fields are missing', () => {
    const req = mockRequest({});
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    validateCreateAsset(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();

    const errors = (res.json as jest.Mock).mock.calls[0]![0] as { errors: string[] };
    expect(errors.errors).toHaveLength(4);
  });

  it('returns 400 when symbol is empty string', () => {
    const req = mockRequest({ symbol: '', name: 'Bitcoin', quantity: 1, purchasePrice: 40000 });
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    validateCreateAsset(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when quantity is not a number', () => {
    const req = mockRequest({ symbol: 'BTC', name: 'Bitcoin', quantity: 'abc', purchasePrice: 40000 });
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    validateCreateAsset(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when quantity is Infinity', () => {
    const req = mockRequest({ symbol: 'BTC', name: 'Bitcoin', quantity: Infinity, purchasePrice: 40000 });
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    validateCreateAsset(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('validateUpdateAsset', () => {

  it('calls next() when body is valid (partial)', () => {
    const req = mockRequest({ quantity: 5 });
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    validateUpdateAsset(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('calls next() when body is empty', () => {
    const req = mockRequest({});
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    validateUpdateAsset(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('returns 400 when a provided field has wrong type', () => {
    const req = mockRequest({ quantity: 'not a number' });
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    validateUpdateAsset(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
