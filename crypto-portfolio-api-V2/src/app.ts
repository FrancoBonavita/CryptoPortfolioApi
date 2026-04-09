import express from 'express';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';
import { cors, securityHeaders, rateLimiter } from './middlewares/security.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { apiRouter } from './routes/index.js';

const app = express();

// ── Global middlewares (order matters) ──────────────────────────────────────
// 1. Security headers on every response
app.use(securityHeaders);

// 2. CORS before anything else so preflight OPTIONS resolve immediately
app.use(cors);

// 3. Rate limiter before body parsing — reject abusers early, save resources
app.use(rateLimiter);

// 4. Parse JSON bodies
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api', apiRouter);

// Health check — useful for Docker, load balancers, uptime monitors
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// ── Error handler (must be registered last) ─────────────────────────────────
app.use(errorHandler);

// ── Start server ────────────────────────────────────────────────────────────
app.listen(config.port, () => {
  logger.info(`Server running on http://localhost:${config.port}`, {
    environment: config.nodeEnv,
  });
});
