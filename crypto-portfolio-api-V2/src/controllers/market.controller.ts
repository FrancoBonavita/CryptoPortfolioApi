import type { Request, Response } from 'express';
import { marketService } from '../services/market.service.js';

function getParam(req: Request, name: string): string {
  const value = req.params[name];
  return Array.isArray(value) ? value[0]! : value ?? '';
}

export const marketController = {

  async getPrice(req: Request, res: Response): Promise<void> {
    const symbol = getParam(req, 'symbol');

    if (!symbol) {
      res.status(400).json({ success: false, error: 'Symbol parameter is required' });
      return;
    }

    const result = await marketService.getPrice(symbol);

    if (result.error) {
      res.status(502).json({ success: false, error: result.error });
      return;
    }

    res.json({ success: true, data: result.data });
  },
};
