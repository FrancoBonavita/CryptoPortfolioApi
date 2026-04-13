import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger.js';

// Specific rate limiter for /market/:id — 5 requests per minute per IP
export const marketRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    logger.warn('Market rate limit exceeded');
    res.status(429).json({
      success: false,
      error: 'Too many market requests. Limit is 5 per minute. Please try again later.',
    });
  },
});