import type { Request, Response } from 'express';
import { assetService } from '../services/asset.service.js';
import type { CreateAssetDto, UpdateAssetDto } from '../models/asset.model.js';

// Express 5 types params as string | string[] — this helper narrows it safely.
function getParam(req: Request, name: string): string {
  const value = req.params[name];
  return Array.isArray(value) ? value[0]! : value ?? '';
}

export const assetController = {

  getAll(_req: Request, res: Response): void {
    const assets = assetService.getAll();
    res.json({ success: true, data: assets });
  },

  getById(req: Request, res: Response): void {
    const result = assetService.getById(getParam(req, 'id'));

    if (result.error) {
      res.status(404).json({ success: false, error: result.error });
      return;
    }

    res.json({ success: true, data: result.data });
  },

  create(req: Request, res: Response): void {
    const dto = req.body as CreateAssetDto;
    const result = assetService.create(dto);

    if (result.error) {
      res.status(409).json({ success: false, error: result.error });
      return;
    }

    res.status(201).json({ success: true, data: result.data });
  },

  update(req: Request, res: Response): void {
    const dto = req.body as UpdateAssetDto;
    const result = assetService.update(getParam(req, 'id'), dto);

    if (result.error) {
      const status = result.error === 'Asset not found' ? 404 : 409;
      res.status(status).json({ success: false, error: result.error });
      return;
    }

    res.json({ success: true, data: result.data });
  },

  delete(req: Request, res: Response): void {
    const result = assetService.delete(getParam(req, 'id'));

    if (result.error) {
      res.status(404).json({ success: false, error: result.error });
      return;
    }

    res.status(204).send();
  },
};
