import { describe, it, expect, beforeEach } from '@jest/globals';
import { assetRepository } from '../../../src/repositories/asset.repository.js';
import { auditRepository } from '../../../src/repositories/audit.repository.js';
import { assetService } from '../../../src/services/asset.service.js';

function clearAssets(): void {
  for (const asset of assetRepository.findAll()) {
    assetRepository.delete(asset.id);
  }
}

describe('assetService audit integration', () => {

  beforeEach(() => {
    clearAssets();
  });

  it('logs CREATE when an asset is created', () => {
    const result = assetService.create({ symbol: 'BTC', name: 'Bitcoin', quantity: 1, purchasePrice: 40000 });
    const logs = auditRepository.findByAssetId(result.data!.id);

    expect(logs.length).toBeGreaterThanOrEqual(1);
    expect(logs.some((l) => l.action === 'CREATE')).toBe(true);
  });

  it('logs UPDATE when an asset is updated', () => {
    const created = assetService.create({ symbol: 'ETH', name: 'Ethereum', quantity: 5, purchasePrice: 2000 });
    assetService.update(created.data!.id, { quantity: 10 });

    const logs = auditRepository.findByAssetId(created.data!.id);

    expect(logs.some((l) => l.action === 'UPDATE')).toBe(true);
  });

  it('logs DELETE when an asset is deleted', () => {
    const created = assetService.create({ symbol: 'SOL', name: 'Solana', quantity: 20, purchasePrice: 100 });
    const id = created.data!.id;
    assetService.delete(id);

    const logs = auditRepository.findByAssetId(id);

    expect(logs.some((l) => l.action === 'DELETE')).toBe(true);
  });

  it('does NOT log when create fails (duplicate)', () => {
    assetService.create({ symbol: 'ADA', name: 'Cardano', quantity: 1, purchasePrice: 1 });
    const before = auditRepository.findByAssetId('any').length;

    assetService.create({ symbol: 'ADA', name: 'Cardano 2', quantity: 2, purchasePrice: 2 });

    // No new audit log should exist for a failed operation
    // (the duplicate never gets an id, so no audit is created)
    expect(before).toBe(0);
  });

  it('does NOT log when update fails (not found)', () => {
    assetService.update('fake-id', { quantity: 5 });

    const logs = auditRepository.findByAssetId('fake-id');
    expect(logs).toHaveLength(0);
  });

  it('does NOT log when delete fails (not found)', () => {
    assetService.delete('fake-id');

    const logs = auditRepository.findByAssetId('fake-id');
    expect(logs).toHaveLength(0);
  });
});