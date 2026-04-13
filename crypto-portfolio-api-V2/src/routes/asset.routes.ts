// src/routes/asset.routes.ts
import { Router } from 'express';
import { assetController } from '../controllers/asset.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { createAssetSchema, updateAssetSchema } from '../models/asset.model.js';

export const assetRouter = Router();

assetRouter.get('/', assetController.getAll);
assetRouter.get('/:id', assetController.getById);
assetRouter.post('/', validate(createAssetSchema), assetController.create);
assetRouter.put('/:id', validate(updateAssetSchema), assetController.update);
assetRouter.delete('/:id', assetController.delete);
assetRouter.get('/:id/history', assetController.getHistory);