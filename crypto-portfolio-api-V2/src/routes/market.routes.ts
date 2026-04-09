import { Router } from 'express';
import { marketController } from '../controllers/market.controller.js';

export const marketRouter = Router();

marketRouter.get('/:symbol', marketController.getPrice);
