import { describe, it, expect, beforeEach } from '@jest/globals';
import { auditRepository } from '../../../src/repositories/audit.repository.js';

describe('auditRepository', () => {

  describe('create', () => {

    it('creates an audit log with correct fields', () => {
      const log = auditRepository.create('asset-123', 'CREATE');

      expect(typeof log.id).toBe('string');
      expect(log.assetId).toBe('asset-123');
      expect(log.action).toBe('CREATE');
      expect(log.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('findByAssetId', () => {

    it('returns only logs for the given asset', () => {
      auditRepository.create('asset-1', 'CREATE');
      auditRepository.create('asset-2', 'CREATE');
      auditRepository.create('asset-1', 'UPDATE');

      const logs = auditRepository.findByAssetId('asset-1');

      expect(logs).toHaveLength(2);
      expect(logs.every((l) => l.assetId === 'asset-1')).toBe(true);
    });

    it('returns logs sorted chronologically', () => {
      auditRepository.create('asset-1', 'CREATE');
      auditRepository.create('asset-1', 'UPDATE');
      auditRepository.create('asset-1', 'DELETE');

      const logs = auditRepository.findByAssetId('asset-1');

      for (let i = 1; i < logs.length; i++) {
        expect(logs[i]!.timestamp.getTime()).toBeGreaterThanOrEqual(logs[i - 1]!.timestamp.getTime());
      }
    });

    it('returns empty array for unknown asset', () => {
      expect(auditRepository.findByAssetId('nonexistent')).toEqual([]);
    });
  });
});