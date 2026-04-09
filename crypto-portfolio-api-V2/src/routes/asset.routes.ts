import { Router } from 'express';
import { assetController } from '../controllers/asset.controller.js';
import { validateCreateAsset, validateUpdateAsset } from '../middlewares/validation.middleware.js';

export const assetRouter = Router();

assetRouter.get('/', assetController.getAll);
assetRouter.get('/:id', assetController.getById);
assetRouter.post('/', validateCreateAsset, assetController.create);
assetRouter.put('/:id', validateUpdateAsset, assetController.update);
assetRouter.delete('/:id', assetController.delete);
