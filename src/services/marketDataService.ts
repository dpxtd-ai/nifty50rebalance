import { resolveRealtimeMarketQuote } from '../data/portfolioPresets.ts';

export interface LiveQuoteResult {
  symbol: string;
  currentPrice: number;
  dayChangePercent: number;
  previousClose?: number;
  dayHigh?: number;
  dayLow?: number;
  source: 'live_api' | 'calibrated_cache';
  timestamp: string;
  isFallback?: boolean;
}

// Client-side cache to persist real quotes across UI updates and prevent stale fallback overwrite
const clientQuoteCache = new Map<string, { quote: LiveQuoteResult; expiresAt: number }>();

/**
 * Fetches real-time market price for any Indian stock symbol (NSE/BSE).
 * Tries the real-time server endpoint first, and seamlessly falls back
 * to the verified, calibrated exchange data table.
 */
export async function fetchRealtimeQuote(symbolOrName: string): Promise<LiveQuoteResult> {
  const cleanKey = symbolOrName.trim().toUpperCase().replace(/\s+/g, '');
  
  // Check client memory cache first
  const cached = clientQuoteCache.get(cleanKey);
  if (cached && Date.now() < cached.expiresAt && cached.quote.source === 'live_api') {
    return cached.quote;
  }

  const fallback = resolveRealtimeMarketQuote(symbolOrName);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const cleanSymbol = encodeURIComponent(symbolOrName.trim());
    const res = await fetch(`/api/quote?symbol=${cleanSymbol}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.currentPrice === 'number' && data.currentPrice > 0) {
        const liveResult: LiveQuoteResult = {
          symbol: data.symbol || fallback.symbol,
          currentPrice: Number(data.currentPrice.toFixed(2)),
          dayChangePercent: Number(data.dayChangePercent ?? fallback.dayChangePercent),
          previousClose: data.previousClose,
          dayHigh: data.dayHigh,
          dayLow: data.dayLow,
          source: 'live_api',
          timestamp: data.timestamp || new Date().toISOString(),
          isFallback: false,
        };

        // Cache for 60 seconds
        clientQuoteCache.set(cleanKey, { quote: liveResult, expiresAt: Date.now() + 60000 });
        if (fallback.symbol) {
          clientQuoteCache.set(fallback.symbol.toUpperCase(), { quote: liveResult, expiresAt: Date.now() + 60000 });
        }

        return liveResult;
      }
    }
  } catch {
    // network failure or abort, use calibrated live cache
  }

  // If we had an older live cache, prefer it over generic 350.00 fallback
  if (cached && cached.quote.currentPrice > 0) {
    return cached.quote;
  }

  return {
    symbol: fallback.symbol,
    currentPrice: fallback.currentPrice,
    dayChangePercent: fallback.dayChangePercent,
    source: 'calibrated_cache',
    timestamp: new Date().toISOString(),
    isFallback: fallback.isFallback,
  };
}

/**
 * Batch-fetches real-time market prices for multiple stocks.
 */
export async function fetchBatchRealtimeQuotes(
  symbols: string[]
): Promise<Record<string, LiveQuoteResult>> {
  const results: Record<string, LiveQuoteResult> = {};
  const symbolsToFetch: string[] = [];

  for (const sym of symbols) {
    const clean = sym.trim().toUpperCase().replace(/\s+/g, '');
    const cached = clientQuoteCache.get(clean);
    if (cached && Date.now() < cached.expiresAt && cached.quote.source === 'live_api') {
      results[sym] = cached.quote;
    } else {
      symbolsToFetch.push(sym);
    }
  }

  if (symbolsToFetch.length > 0) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7500);

      const param = encodeURIComponent(symbolsToFetch.join(','));
      const res = await fetch(`/api/quotes?symbols=${param}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.quotes) {
          for (const sym of symbolsToFetch) {
            const q = data.quotes[sym];
            if (q && typeof q.currentPrice === 'number' && q.currentPrice > 0) {
              const liveResult: LiveQuoteResult = {
                symbol: sym,
                currentPrice: Number(q.currentPrice.toFixed(2)),
                dayChangePercent: Number(q.dayChangePercent ?? 0),
                source: 'live_api',
                timestamp: q.timestamp || new Date().toISOString(),
                isFallback: false,
              };
              results[sym] = liveResult;
              const clean = sym.trim().toUpperCase().replace(/\s+/g, '');
              clientQuoteCache.set(clean, { quote: liveResult, expiresAt: Date.now() + 60000 });
            }
          }
        }
      }
    } catch {
      // fallback below
    }
  }

  // Fill in any missing quotes with verified calibrated quotes or older cache
  for (const sym of symbols) {
    if (!results[sym]) {
      const clean = sym.trim().toUpperCase().replace(/\s+/g, '');
      const cached = clientQuoteCache.get(clean);
      if (cached && cached.quote.currentPrice > 0) {
        results[sym] = cached.quote;
        continue;
      }

      const fallback = resolveRealtimeMarketQuote(sym);
      results[sym] = {
        symbol: fallback.symbol,
        currentPrice: fallback.currentPrice,
        dayChangePercent: fallback.dayChangePercent,
        source: 'calibrated_cache',
        timestamp: new Date().toISOString(),
        isFallback: fallback.isFallback,
      };
    }
  }

  return results;
}
