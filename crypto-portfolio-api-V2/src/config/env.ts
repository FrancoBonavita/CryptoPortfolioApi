// Centralized environment configuration.
// Every module imports from here — process.env is never read directly elsewhere.
// Loaded via Node's native --env-file flag (no dotenv dependency).

interface Config {
  readonly port: number;
  readonly nodeEnv: string;
  readonly marketApiBaseUrl: string;
  readonly rateLimitWindowMs: number;
  readonly rateLimitMaxRequests: number;
}

function loadConfig(): Config {
  const port = parseInt(process.env['PORT'] ?? '3000', 10);
  const rateLimitWindowMs = parseInt(process.env['RATE_LIMIT_WINDOW_MS'] ?? '900000', 10);
  const rateLimitMaxRequests = parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] ?? '100', 10);

  // Fail fast if someone puts "abc" as a port
  if (Number.isNaN(port)) throw new Error('ENV: PORT must be a valid number');
  if (Number.isNaN(rateLimitWindowMs)) throw new Error('ENV: RATE_LIMIT_WINDOW_MS must be a valid number');
  if (Number.isNaN(rateLimitMaxRequests)) throw new Error('ENV: RATE_LIMIT_MAX_REQUESTS must be a valid number');

  return {
    port,
    nodeEnv: process.env['NODE_ENV'] ?? 'development',
    marketApiBaseUrl: process.env['MARKET_API_BASE_URL'] ?? 'https://api.coingecko.com/api/v3/simple/price',
    rateLimitWindowMs,
    rateLimitMaxRequests,
  };
}

export const config: Config = loadConfig();
