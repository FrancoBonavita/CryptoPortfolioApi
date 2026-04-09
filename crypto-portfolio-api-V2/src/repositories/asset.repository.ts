import crypto from 'node:crypto';
import type { Asset, CreateAssetDto, UpdateAssetDto } from '../models/asset.model.js';

// The single source of truth — no other file reads or writes this array.
const assets: Asset[] = [];

export const assetRepository = {

  findAll(): Asset[] {
    return [...assets];
  },

  findById(id: string): Asset | undefined {
    return assets.find((asset) => asset.id === id);
  },

  findBySymbol(symbol: string): Asset | undefined {
    return assets.find((asset) => asset.symbol === symbol.toUpperCase());
  },

  create(dto: CreateAssetDto): Asset {
    const now = new Date();

    const newAsset: Asset = {
      id: crypto.randomUUID(),
      symbol: dto.symbol.toUpperCase(),
      name: dto.name,
      quantity: dto.quantity,
      purchasePrice: dto.purchasePrice,
      createdAt: now,
      updatedAt: now,
    };

    assets.push(newAsset);
    return newAsset;
  },

  update(id: string, dto: UpdateAssetDto): Asset | undefined {
    const index = assets.findIndex((asset) => asset.id === id);
    if (index === -1) return undefined;

    const existing = assets[index]!;

    const updated: Asset = {
      ...existing,
      ...(dto.symbol !== undefined && { symbol: dto.symbol.toUpperCase() }),
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.quantity !== undefined && { quantity: dto.quantity }),
      ...(dto.purchasePrice !== undefined && { purchasePrice: dto.purchasePrice }),
      updatedAt: new Date(),
    };

    assets[index] = updated;
    return updated;
  },

  delete(id: string): boolean {
    const index = assets.findIndex((asset) => asset.id === id);
    if (index === -1) return false;

    assets.splice(index, 1);
    return true;
  },
};
