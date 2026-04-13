import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

// What we return to the controller — only the fields we care about.
export interface MarketPrice {
  readonly symbol: string;
  readonly name: string;
  readonly priceUsd: number;
  readonly changePercent24h: number;
}

interface ServiceResult<T> {
  data?: T;
  error?: string;
}

// Maps common ticker symbols to CoinGecko asset IDs.
const SYMBOL_MAP: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  ADA: 'cardano',
  DOT: 'polkadot',
  DOGE: 'dogecoin',
  XRP: 'ripple',
  AVAX: 'avalanche-2',
  LINK: 'chainlink',
  MATIC: 'matic-network',
};

function toCoinGeckoId(symbol: string): string | undefined {
  return SYMBOL_MAP[symbol.toUpperCase()];
}

export const marketService = {

  async getPrice(symbol: string): Promise<ServiceResult<MarketPrice>> {
    const assetId = toCoinGeckoId(symbol);

    if (!assetId) {
      return { error: `Unknown symbol "${symbol}". Supported: ${Object.keys(SYMBOL_MAP).join(', ')}` };
    }

    const url = `${config.marketApiBaseUrl}?ids=${assetId}&vs_currencies=usd&include_24hr_change=true`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) {
        logger.warn({ status: response.status, symbol }, 'Market API returned non-OK status');
        return { error: `Market data unavailable for "${symbol}"` };
      }

      const json = (await response.json()) as Record<string, { usd: number; usd_24h_change: number }>;

      const data = json[assetId];
      if (!data) {
        return { error: `No market data found for "${symbol}"` };
      }

      return {
        data: {
          symbol: symbol.toUpperCase(),
          name: assetId,
          priceUsd: data.usd,
          changePercent24h: data.usd_24h_change,
        },
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      logger.error({ symbol, error: message }, 'Failed to fetch market price');
      return { error: `Failed to fetch market data: ${message}` };
    }
  },
};
