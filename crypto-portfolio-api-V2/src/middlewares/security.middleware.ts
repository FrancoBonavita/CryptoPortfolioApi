import type { Request, Response, NextFunction } from 'express';

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
