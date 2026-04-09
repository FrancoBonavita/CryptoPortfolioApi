import { describe, expect, it } from '@jest/globals';
import type { Asset, CreateAssetDto, UpdateAssetDto } from '../../../src/models/asset.model.js';

describe('Asset model interfaces', () => {

  it('Asset has all required fields with correct types', () => {
    const asset: Asset = {
      id: '123',
      symbol: 'BTC',
      name: 'Bitcoin',
      quantity: 1.5,
      purchasePrice: 42000,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(typeof asset.id).toBe('string');
    expect(typeof asset.symbol).toBe('string');
    expect(typeof asset.name).toBe('string');
    expect(typeof asset.quantity).toBe('number');
    expect(typeof asset.purchasePrice).toBe('number');
    expect(asset.createdAt).toBeInstanceOf(Date);
    expect(asset.updatedAt).toBeInstanceOf(Date);
  });

  it('CreateAssetDto excludes id and timestamps', () => {
    const dto: CreateAssetDto = {
      symbol: 'ETH',
      name: 'Ethereum',
      quantity: 10,
      purchasePrice: 2200,
    };

    expect(dto).not.toHaveProperty('id');
    expect(dto).not.toHaveProperty('createdAt');
    expect(dto).not.toHaveProperty('updatedAt');
  });

  it('UpdateAssetDto allows partial fields', () => {
    const partial: UpdateAssetDto = { quantity: 5 };

    expect(partial.quantity).toBe(5);
    expect(partial.symbol).toBeUndefined();
    expect(partial.name).toBeUndefined();
    expect(partial.purchasePrice).toBeUndefined();
  });
});
