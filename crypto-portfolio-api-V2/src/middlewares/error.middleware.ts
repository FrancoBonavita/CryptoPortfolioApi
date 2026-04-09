import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { config } from '../config/env.js';

// Express recognises this as an error middleware because it has 4 parameters.
// Must keep all four even if unused — that's how Express identifies it.
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  logger.error('Unhandled error', { message: err.message, stack: err.stack });

  // In development, include the message for easier debugging.
  // In production, never leak internal details to the client.
  const message = config.nodeEnv === 'development'
    ? err.message
    : 'Internal server error';

  res.status(500).json({ success: false, error: message });
}
