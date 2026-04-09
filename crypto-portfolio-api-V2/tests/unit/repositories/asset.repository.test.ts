import { beforeEach, describe, expect, it } from '@jest/globals';
import { assetRepository } from '../../../src/repositories/asset.repository.js';

function clearAll(): void {
  const all = assetRepository.findAll();
  for (const asset of all) {
    assetRepository.delete(asset.id);
  }
}

describe('assetRepository', () => {

  beforeEach(() => {
    clearAll();
  });

  describe('create', () => {

    it('creates an asset and assigns an id and timestamps', () => {
      const asset = assetRepository.create({
        symbol: 'BTC',
        name: 'Bitcoin',
        quantity: 1.5,
        purchasePrice: 42000,
      });

      expect(typeof asset.id).toBe('string');
      expect(asset.id.length).toBeGreaterThan(0);
      expect(asset.symbol).toBe('BTC');
      expect(asset.name).toBe('Bitcoin');
      expect(asset.quantity).toBe(1.5);
      expect(asset.purchasePrice).toBe(42000);
      expect(asset.createdAt).toBeInstanceOf(Date);
      expect(asset.updatedAt).toBeInstanceOf(Date);
    });

    it('uppercases the symbol', () => {
      const asset = assetRepository.create({
        symbol: 'eth',
        name: 'Ethereum',
        quantity: 10,
        purchasePrice: 2200,
      });

      expect(asset.symbol).toBe('ETH');
    });
  });

  describe('findAll', () => {

    it('returns empty array when no assets exist', () => {
      expect(assetRepository.findAll()).toEqual([]);
    });

    it('returns all created assets', () => {
      assetRepository.create({ symbol: 'BTC', name: 'Bitcoin', quantity: 1, purchasePrice: 40000 });
      assetRepository.create({ symbol: 'ETH', name: 'Ethereum', quantity: 5, purchasePrice: 2000 });

      expect(assetRepository.findAll()).toHaveLength(2);
    });

    it('returns a copy — mutating the result does not affect the store', () => {
      assetRepository.create({ symbol: 'BTC', name: 'Bitcoin', quantity: 1, purchasePrice: 40000 });

      const result = assetRepository.findAll();
      result.pop();

      expect(assetRepository.findAll()).toHaveLength(1);
    });
  });

  describe('findById', () => {

    it('returns the asset if it exists', () => {
      const created = assetRepository.create({ symbol: 'BTC', name: 'Bitcoin', quantity: 1, purchasePrice: 40000 });
      const found = assetRepository.findById(created.id);

      expect(found).toBeDefined();
      expect(found!.id).toBe(created.id);
    });

    it('returns undefined for a non-existent id', () => {
      expect(assetRepository.findById('does-not-exist')).toBeUndefined();
    });
  });

  describe('findBySymbol', () => {

    it('finds by symbol case-insensitively', () => {
      assetRepository.create({ symbol: 'BTC', name: 'Bitcoin', quantity: 1, purchasePrice: 40000 });

      expect(assetRepository.findBySymbol('btc')).toBeDefined();
      expect(assetRepository.findBySymbol('BTC')).toBeDefined();
      expect(assetRepository.findBySymbol('Btc')).toBeDefined();
    });

    it('returns undefined for unknown symbol', () => {
      expect(assetRepository.findBySymbol('XYZ')).toBeUndefined();
    });
  });

  describe('update', () => {

    it('updates only the provided fields', () => {
      const created = assetRepository.create({ symbol: 'BTC', name: 'Bitcoin', quantity: 1, purchasePrice: 40000 });
      const updated = assetRepository.update(created.id, { quantity: 5 });

      expect(updated).toBeDefined();
      expect(updated!.quantity).toBe(5);
      expect(updated!.symbol).toBe('BTC');
      expect(updated!.name).toBe('Bitcoin');
      expect(updated!.purchasePrice).toBe(40000);
    });

    it('updates the updatedAt timestamp', () => {
      const created = assetRepository.create({ symbol: 'BTC', name: 'Bitcoin', quantity: 1, purchasePrice: 40000 });
      const updated = assetRepository.update(created.id, { quantity: 5 });

      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('returns undefined for a non-existent id', () => {
      expect(assetRepository.update('fake-id', { quantity: 5 })).toBeUndefined();
    });
  });

  describe('delete', () => {

    it('removes the asset and returns true', () => {
      const created = assetRepository.create({ symbol: 'BTC', name: 'Bitcoin', quantity: 1, purchasePrice: 40000 });

      expect(assetRepository.delete(created.id)).toBe(true);
      expect(assetRepository.findById(created.id)).toBeUndefined();
    });

    it('returns false for a non-existent id', () => {
      expect(assetRepository.delete('fake-id')).toBe(false);
    });
  });
});
