import type { Asset, CreateAssetDto, UpdateAssetDto } from '../models/asset.model.js';
import { assetRepository } from '../repositories/asset.repository.js';
import { auditRepository } from '../repositories/audit.repository.js';
import type { AuditLog } from '../models/audit.model.js';

interface ServiceResult<T> {
  data?: T;
  error?: string;
}

export const assetService = {

  getAll(): Asset[] {
    return assetRepository.findAll();
  },

  getById(id: string): ServiceResult<Asset> {
    const asset = assetRepository.findById(id);
    if (!asset) return { error: 'Asset not found' };
    return { data: asset };
  },

  create(dto: CreateAssetDto): ServiceResult<Asset> {
    if (dto.quantity < 0) return { error: 'Quantity must be non-negative' };
    if (dto.purchasePrice < 0) return { error: 'Purchase price must be non-negative' };

    const duplicate = assetRepository.findBySymbol(dto.symbol);
    if (duplicate) return { error: `Asset with symbol "${dto.symbol.toUpperCase()}" already exists` };

    const asset = assetRepository.create(dto);
    auditRepository.create(asset.id, 'CREATE');
    return { data: asset };
  },

  update(id: string, dto: UpdateAssetDto): ServiceResult<Asset> {
    if (dto.quantity !== undefined && dto.quantity < 0) return { error: 'Quantity must be non-negative' };
    if (dto.purchasePrice !== undefined && dto.purchasePrice < 0) return { error: 'Purchase price must be non-negative' };

    if (dto.symbol) {
      const duplicate = assetRepository.findBySymbol(dto.symbol);
      if (duplicate && duplicate.id !== id) {
        return { error: `Asset with symbol "${dto.symbol.toUpperCase()}" already exists` };
      }
    }

    const asset = assetRepository.update(id, dto);
    if (!asset) return { error: 'Asset not found' };

    auditRepository.create(id, 'UPDATE');
    return { data: asset };
  },

  delete(id: string): ServiceResult<null> {
    const deleted = assetRepository.delete(id);
    if (!deleted) return { error: 'Asset not found' };

    auditRepository.create(id, 'DELETE');
    return { data: null };
  },

  getHistory(assetId: string): ServiceResult<AuditLog[]> {
    const logs = auditRepository.findByAssetId(assetId);
    return { data: logs };
  },
};