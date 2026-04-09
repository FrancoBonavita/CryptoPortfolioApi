import type { Request, Response } from 'express';
import { assetController } from '../../../src/controllers/asset.controller.js';
import { assetRepository } from '../../../src/repositories/asset.repository.js';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

function clearAll(): void {
  const all = assetRepository.findAll();
  for (const asset of all) {
    assetRepository.delete(asset.id);
  }
}

function mockResponse(): Response {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
  return res as unknown as Response;
}

function mockRequest(overrides: { params?: Record<string, string>; body?: unknown }): Request {
  return {
    params: overrides.params ?? {},
    body: overrides.body ?? {},
  } as unknown as Request;
}

describe('assetController', () => {

  beforeEach(() => {
    clearAll();
  });

  describe('getAll', () => {

    it('returns 200 with empty array', () => {
      const req = mockRequest({});
      const res = mockResponse();
      assetController.getAll(req, res);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: [] });
    });

    it('returns 200 with assets', () => {
      assetRepository.create({ symbol: 'BTC', name: 'Bitcoin', quantity: 1, purchasePrice: 40000 });
      const req = mockRequest({});
      const res = mockResponse();
      assetController.getAll(req, res);
      const call = (res.json as jest.Mock).mock.calls[0]![0] as { data: unknown[] };
      expect(call.data).toHaveLength(1);
    });
  });

  describe('getById', () => {

    it('returns 200 when asset exists', () => {
      const asset = assetRepository.create({ symbol: 'BTC', name: 'Bitcoin', quantity: 1, purchasePrice: 40000 });
      const req = mockRequest({ params: { id: asset.id } });
      const res = mockResponse();
      assetController.getById(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('returns 404 when asset does not exist', () => {
      const req = mockRequest({ params: { id: 'fake-id' } });
      const res = mockResponse();
      assetController.getById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('create', () => {

    it('returns 201 on successful creation', () => {
      const req = mockRequest({ body: { symbol: 'BTC', name: 'Bitcoin', quantity: 1, purchasePrice: 40000 } });
      const res = mockResponse();
      assetController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('returns 409 on duplicate symbol', () => {
      assetRepository.create({ symbol: 'BTC', name: 'Bitcoin', quantity: 1, purchasePrice: 40000 });
      const req = mockRequest({ body: { symbol: 'BTC', name: 'Bitcoin 2', quantity: 2, purchasePrice: 50000 } });
      const res = mockResponse();
      assetController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(409);
    });
  });

  describe('update', () => {

    it('returns 200 on successful update', () => {
      const asset = assetRepository.create({ symbol: 'BTC', name: 'Bitcoin', quantity: 1, purchasePrice: 40000 });
      const req = mockRequest({ params: { id: asset.id }, body: { quantity: 5 } });
      const res = mockResponse();
      assetController.update(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('returns 404 when asset does not exist', () => {
      const req = mockRequest({ params: { id: 'fake-id' }, body: { quantity: 5 } });
      const res = mockResponse();
      assetController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('delete', () => {

    it('returns 204 on successful deletion', () => {
      const asset = assetRepository.create({ symbol: 'BTC', name: 'Bitcoin', quantity: 1, purchasePrice: 40000 });
      const req = mockRequest({ params: { id: asset.id } });
      const res = mockResponse();
      assetController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('returns 404 when asset does not exist', () => {
      const req = mockRequest({ params: { id: 'fake-id' } });
      const res = mockResponse();
      assetController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
