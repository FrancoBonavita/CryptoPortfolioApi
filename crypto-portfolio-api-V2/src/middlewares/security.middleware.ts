import type { Request, Response, NextFunction } from 'express';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

// ── Rate limiter (in-memory, per IP) ────────────────────────────────────────
// Simple sliding-window counter. Good enough for a single-instance monolith.
// Replace with Redis-backed limiter if you ever scale horizontally.

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip ?? req.socket.remoteAddress ?? 'unknown';
  const now = Date.now();
  const record = requestCounts.get(ip);

  // First request or window expired — start fresh.
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + config.rateLimitWindowMs });
    next();
    return;
  }

  record.count++;

  if (record.count > config.rateLimitMaxRequests) {
    logger.warn('Rate limit exceeded', { ip });
    res.status(429).json({ success: false, error: 'Too many requests. Please try again later.' });
    return;
  }

  next();
}

// ── Security headers ────────────────────────────────────────────────────────
// Lightweight alternative to helmet — covers the essentials without a dependency.

export function securityHeaders(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '0');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'none'");
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.removeHeader('X-Powered-By');
  next();
}

// ── CORS ─────────────────────────────────────────────────────────────────────
// Wide open for development. In production, replace '*' with your actual domain.

export function cors(req: Request, res: Response, next: NextFunction): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Preflight requests get an immediate 204 — no need to hit the router.
  if (req.method === 'OPTIONS') {
    res.status(204).send();
    return;
  }

  next();
}
