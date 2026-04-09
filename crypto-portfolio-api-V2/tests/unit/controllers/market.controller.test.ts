import type { Request, Response } from 'express';
import { marketController } from '../../../src/controllers/market.controller.js';
import * as marketServiceModule from '../../../src/services/market.service.js';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

function mockResponse(): Response {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res as unknown as Response;
}

function mockRequest(params: Record<string, string>): Request {
  return { params } as unknown as Request;
}

describe('marketController', () => {

  let getPriceSpy: jest.SpyInstance;

  beforeEach(() => {
    getPriceSpy = jest.spyOn(marketServiceModule.marketService, 'getPrice');
  });

  afterEach(() => {
    getPriceSpy.mockRestore();
  });

  it('returns 200 with price data on success', async () => {
    getPriceSpy.mockResolvedValueOnce({
      data: { symbol: 'BTC', name: 'bitcoin', priceUsd: 65000, changePercent24h: 2.5 },
    });

    const req = mockRequest({ symbol: 'BTC' });
    const res = mockResponse();
    await marketController.getPrice(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('returns 502 when service returns an error', async () => {
    getPriceSpy.mockResolvedValueOnce({ error: 'Market data unavailable' });

    const req = mockRequest({ symbol: 'BTC' });
    const res = mockResponse();
    await marketController.getPrice(req, res);
    expect(res.status).toHaveBeenCalledWith(502);
  });

  it('returns 400 when symbol param is missing', async () => {
    const req = mockRequest({});
    const res = mockResponse();
    await marketController.getPrice(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(getPriceSpy).not.toHaveBeenCalled();
  });
});
