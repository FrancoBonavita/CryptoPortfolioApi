import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { marketService } from '../../../src/services/market.service.js';

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

describe('marketService', () => {

  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('getPrice', () => {

    it('returns price data for a known symbol', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          bitcoin: { usd: 65000, usd_24h_change: 2.5 },
        }),
      });

      const result = await marketService.getPrice('BTC');

      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
      expect(result.data!.symbol).toBe('BTC');
      expect(result.data!.priceUsd).toBe(65000);
      expect(result.data!.changePercent24h).toBe(2.5);
    });

    it('returns error for an unknown symbol', async () => {
      const result = await marketService.getPrice('FAKECOIN');
      expect(result.error).toContain('Unknown symbol');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('returns error when API responds with non-OK status', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 429 });
      const result = await marketService.getPrice('BTC');
      expect(result.error).toContain('unavailable');
    });

    it('returns error when fetch throws (network failure)', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      const result = await marketService.getPrice('BTC');
      expect(result.error).toContain('Network error');
    });

    it('returns error when API response has no data for the asset', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });
      const result = await marketService.getPrice('BTC');
      expect(result.error).toContain('No market data found');
    });

    it('is case-insensitive for symbol lookup', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ethereum: { usd: 3000, usd_24h_change: -1.2 },
        }),
      });

      const result = await marketService.getPrice('eth');
      expect(result.data).toBeDefined();
      expect(result.data!.symbol).toBe('ETH');
    });
  });
});
