// src/models/asset.model.ts
import { z } from 'zod';

// Zod schemas — single source of truth for validation AND types
export const createAssetSchema = z.object({
  symbol: z.string().trim().min(1, 'symbol is required'),
  name: z.string().trim().min(1, 'name is required'),
  quantity: z.number().finite('quantity must be a finite number'),
  purchasePrice: z.number().finite('purchasePrice must be a finite number'),
});

export const updateAssetSchema = createAssetSchema.partial();

// Derive TypeScript types FROM the schemas — no duplication
export type CreateAssetDto = z.infer<typeof createAssetSchema>;
export type UpdateAssetDto = z.infer<typeof updateAssetSchema>;

// The full Asset entity stays as a regular interface (not validated by Zod — it's internal)
export interface Asset {
  readonly id: string;
  readonly symbol: string;
  readonly name: string;
  readonly quantity: number;
  readonly purchasePrice: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}