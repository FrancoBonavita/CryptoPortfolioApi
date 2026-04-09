import type { Request, Response, NextFunction } from 'express';

// Validates the body for POST /assets.
// Dependency-free — no Zod or Joi needed at this scale.
export function validateCreateAsset(req: Request, res: Response, next: NextFunction): void {
  const { symbol, name, quantity, purchasePrice } = req.body as Record<string, unknown>;
  const errors: string[] = [];

  if (typeof symbol !== 'string' || symbol.trim().length === 0) {
    errors.push('symbol is required and must be a non-empty string');
  }

  if (typeof name !== 'string' || name.trim().length === 0) {
    errors.push('name is required and must be a non-empty string');
  }

  if (typeof quantity !== 'number' || !Number.isFinite(quantity)) {
    errors.push('quantity is required and must be a finite number');
  }

  if (typeof purchasePrice !== 'number' || !Number.isFinite(purchasePrice)) {
    errors.push('purchasePrice is required and must be a finite number');
  }

  if (errors.length > 0) {
    res.status(400).json({ success: false, errors });
    return;
  }

  next();
}

// Validates the body for PUT /assets/:id.
// All fields optional — only checks the ones that are present.
export function validateUpdateAsset(req: Request, res: Response, next: NextFunction): void {
  const body = req.body as Record<string, unknown>;
  const errors: string[] = [];

  if ('symbol' in body && (typeof body['symbol'] !== 'string' || (body['symbol'] as string).trim().length === 0)) {
    errors.push('symbol must be a non-empty string');
  }

  if ('name' in body && (typeof body['name'] !== 'string' || (body['name'] as string).trim().length === 0)) {
    errors.push('name must be a non-empty string');
  }

  if ('quantity' in body && (typeof body['quantity'] !== 'number' || !Number.isFinite(body['quantity'] as number))) {
    errors.push('quantity must be a finite number');
  }

  if ('purchasePrice' in body && (typeof body['purchasePrice'] !== 'number' || !Number.isFinite(body['purchasePrice'] as number))) {
    errors.push('purchasePrice must be a finite number');
  }

  if (errors.length > 0) {
    res.status(400).json({ success: false, errors });
    return;
  }

  next();
}
