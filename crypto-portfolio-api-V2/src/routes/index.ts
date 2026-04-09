import { Router } from 'express';
import { assetRouter } from './asset.routes.js';
import { marketRouter } from './market.routes.js';

export const apiRouter = Router();

apiRouter.use('/assets', assetRouter);
apiRouter.use('/market', marketRouter);
