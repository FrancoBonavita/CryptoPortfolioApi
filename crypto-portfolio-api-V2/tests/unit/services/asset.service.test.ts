import { assetService } from '../../../src/services/asset.service.js';
import { assetRepository } from '../../../src/repositories/asset.repository.js';
import { beforeEach, describe, expect, it } from '@jest/globals';

function clearAll(): void {
  const all = assetRepository.findAll();
  for (const asset of all) {
    assetRepository.delete(asset.id);
  }
}

describe('assetService', () => {

  beforeEach(() => {
    clearAll();
  });

  describe('create', () => {

    it('creates an asset successfully', () => {
      const result = assetService.create({
        symbol: 'BTC',
        name: 'Bitcoin',
        quantity: 1.5,
        purchasePrice: 42000,
      });

      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
      expect(result.data!.symbol).toBe('BTC');
    });

    it('rejects duplicate symbols', () => {
      assetService.create({ symbol: 'BTC', name: 'Bitcoin', quantity: 1, purchasePrice: 40000 });
      const result = assetService.create({ symbol: 'BTC', name: 'Bitcoin 2', quantity: 2, purchasePrice: 50000 });

      expect(result.error).toContain('already exists');
      expect(result.data).toBeUndefined();
    });

    it('rejects negative quantity', () => {
      const result = assetService.create({ symbol: 'ETH', name: 'Ethereum', quantity: -1, purchasePrice: 2000 });
      expect(result.error).toContain('non-negative');
    });

    it('rejects negative purchase price', () => {
      const result = assetService.create({ symbol: 'ETH', name: 'Ethereum', quantity: 1, purchasePrice: -100 });
      expect(result.error).toContain('non-negative');
    });
  });

  describe('getAll', () => {

    it('returns empty array when no assets exist', () => {
      expect(assetService.getAll()).toEqual([]);
    });

    it('returns all assets', () => {
      assetService.create({ symbol: 'BTC', name: 'Bitcoin', quantity: 1, purchasePrice: 40000 });
      assetService.create({ symbol: 'ETH', name: 'Ethereum', quantity: 5, purchasePrice: 2000 });
      expect(assetService.getAll()).toHaveLength(2);
    });
  });

  describe('getById', () => {

    it('returns the asset when it exists', () => {
      const created = assetService.create({ symbol: 'BTC', name: 'Bitcoin', quantity: 1, purchasePrice: 40000 });
      const result = assetService.getById(created.data!.id);
      expect(result.data).toBeDefined();
      expect(result.data!.symbol).toBe('BTC');
    });

    it('returns error for non-existent id', () => {
      const result = assetService.getById('fake-id');
      expect(result.error).toBe('Asset not found');
    });
  });

  describe('update', () => {

    it('updates fields successfully', () => {
      const created = assetService.create({ symbol: 'BTC', name: 'Bitcoin', quantity: 1, purchasePrice: 40000 });
      const result = assetService.update(created.data!.id, { quantity: 3 });
      expect(result.data).toBeDefined();
      expect(result.data!.quantity).toBe(3);
      expect(result.data!.symbol).toBe('BTC');
    });

    it('rejects changing symbol to one that already exists', () => {
      assetService.create({ symbol: 'BTC', name: 'Bitcoin', quantity: 1, purchasePrice: 40000 });
      const eth = assetService.create({ symbol: 'ETH', name: 'Ethereum', quantity: 5, purchasePrice: 2000 });
      const result = assetService.update(eth.data!.id, { symbol: 'BTC' });
      expect(result.error).toContain('already exists');
    });

    it('allows updating symbol to the same value', () => {
      const created = assetService.create({ symbol: 'BTC', name: 'Bitcoin', quantity: 1, purchasePrice: 40000 });
      const result = assetService.update(created.data!.id, { symbol: 'BTC' });
      expect(result.error).toBeUndefined();
      expect(result.data!.symbol).toBe('BTC');
    });

    it('rejects negative quantity on update', () => {
      const created = assetService.create({ symbol: 'BTC', name: 'Bitcoin', quantity: 1, purchasePrice: 40000 });
      const result = assetService.update(created.data!.id, { quantity: -5 });
      expect(result.error).toContain('non-negative');
    });

    it('returns error for non-existent id', () => {
      const result = assetService.update('fake-id', { quantity: 1 });
      expect(result.error).toBe('Asset not found');
    });
  });

  describe('delete', () => {

    it('deletes successfully', () => {
      const created = assetService.create({ symbol: 'BTC', name: 'Bitcoin', quantity: 1, purchasePrice: 40000 });
      const result = assetService.delete(created.data!.id);
      expect(result.error).toBeUndefined();
      expect(assetService.getAll()).toHaveLength(0);
    });

    it('returns error for non-existent id', () => {
      const result = assetService.delete('fake-id');
      expect(result.error).toBe('Asset not found');
    });
  });
});
