import { Router } from 'express';
import { marketController } from '../controllers/market.controller.js';
import { marketRateLimiter } from '../middlewares/rate-limit.middleware.js';

export const marketRouter = Router();

marketRouter.get('/:symbol', marketRateLimiter, marketController.getPrice);