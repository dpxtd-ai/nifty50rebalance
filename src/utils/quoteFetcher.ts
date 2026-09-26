/**
 * Live market quote fetcher for Indian NSE/BSE securities.
 */

// In-memory cache with 45-second TTL to prevent rate-limiting and ensure blazing fast responses
interface CachedQuote {
  data: any;
  expiresAt: number;
}
const quoteCache = new Map<string, CachedQuote>();

export function mapIndianSymbolToYahooTicker(rawSymbol: string): string[] {
  let s = rawSymbol.trim().toUpperCase().replace(/\s+/g, '');

  if (s.startsWith('NSE:')) {
    s = s.replace('NSE:', '').trim();
  } else if (s.startsWith('BSE:')) {
    s = s.replace('BSE:', '').trim();
    if (!s.endsWith('.BO')) {
      return [`${s}.BO`, `${s}.NS`];
    }
  }

  if (s.endsWith('.NS') || s.endsWith('.BO')) {
    return [s];
  }

  if (s === 'NIFTY' || s === 'NIFTY50' || s === 'NIFTY_50' || s === '^NSEI' || s.includes('NIFTY50INDEX')) {
    return ['^NSEI'];
  }
  if (s === 'SENSEX' || s === '^BSESN' || s.includes('BSE30')) {
    return ['^BSESN'];
  }
  if (s === 'BANKNIFTY' || s === 'NIFTYBANK' || s === '^NSEBANK') {
    return ['^NSEBANK'];
  }

  if (s === 'NALCO' || s === 'NATIONALUM' || s.includes('ALUMIN')) {
    return ['NATIONALUM.NS', 'NATIONALUM.BO'];
  }
  if (s === 'COCHINSHIP' || s.includes('COCHIN') || s.includes('SHIPYARD')) {
    return ['COCHINSHIP.NS', 'COCHINSHIP.BO'];
  }
  if (s === 'ZOMATO' || s.includes('ETERNAL')) {
    return ['ETERNAL.NS', 'ZOMATO.NS', 'ZOMATO.BO'];
  }
  if (s === 'TRENT') {
    return ['TRENT.NS', 'TRENT.BO'];
  }
  if (s === 'MAZDOCK' || s.includes('MAZAGON')) {
    return ['MAZDOCK.NS', 'MAZDOCK.BO'];
  }
  if (s === 'GRSE' || s.includes('GARDENREACH')) {
    return ['GRSE.NS', 'GRSE.BO'];
  }
  if (s === 'BEL' || s.includes('BHARATELECTRONIC')) {
    return ['BEL.NS', 'BEL.BO'];
  }
  if (s === 'JIOFIN') {
    return ['JIOFIN.NS', 'JIOFIN.BO'];
  }
  if (s === 'INDUSINDBK') {
    return ['INDUSINDBK.NS', 'INDUSINDBK.BO'];
  }
  if (s === 'BPCL') {
    return ['BPCL.NS', 'BPCL.BO'];
  }
  if (s === 'TATAMOTORS') {
    return ['TMPV.NS', 'TATAMOTORS.NS', 'TATAMOTORS.BO'];
  }
  if (s === 'SUZLON') {
    return ['SUZLON.NS', 'SUZLON.BO'];
  }
  if (s === 'RVNL') {
    return ['RVNL.NS', 'RVNL.BO'];
  }
  if (s === 'IRFC') {
    return ['IRFC.NS', 'IRFC.BO'];
  }
  if (s === 'IREDA') {
    return ['IREDA.NS', 'IREDA.BO'];
  }
  if (s === 'DIXON') {
    return ['DIXON.NS', 'DIXON.BO'];
  }
  if (s === 'POLYCAB') {
    return ['POLYCAB.NS', 'POLYCAB.BO'];
  }
  if (s === 'CDSL') {
    return ['CDSL.NS', 'CDSL.BO'];
  }
  if (s === 'BSE') {
    return ['BSE.NS', 'BSE.BO'];
  }
  if (s === 'HAL') {
    return ['HAL.NS', 'HAL.BO'];
  }
  if (s === 'BDL') {
    return ['BDL.NS', 'BDL.BO'];
  }
  if (s === 'RELIANCE') {
    return ['RELIANCE.NS', 'RELIANCE.BO'];
  }
  if (s === 'HDFCBANK') {
    return ['HDFCBANK.NS', 'HDFCBANK.BO'];
  }
  if (s === 'ICICIBANK') {
    return ['ICICIBANK.NS', 'ICICIBANK.BO'];
  }
  if (s === 'SBIN') {
    return ['SBIN.NS', 'SBIN.BO'];
  }
  if (s === 'TCS') {
    return ['TCS.NS', 'TCS.BO'];
  }
  if (s === 'INFY') {
    return ['INFY.NS', 'INFY.BO'];
  }
  if (s === 'ITC') {
    return ['ITC.NS', 'ITC.BO'];
  }
  if (s === 'BHARTIARTL') {
    return ['BHARTIARTL.NS', 'BHARTIARTL.BO'];
  }
  if (s === 'VEDL') {
    return ['VEDL.NS', 'VEDL.BO'];
  }
  if (s === 'TATACONSUM') {
    return ['TATACONSUM.NS', 'TATACONSUM.BO'];
  }
  if (s === 'WIPRO') {
    return ['WIPRO.NS', 'WIPRO.BO'];
  }
  if (s === 'HCLTECH') {
    return ['HCLTECH.NS', 'HCLTECH.BO'];
  }
  if (s === 'ADANIENT') {
    return ['ADANIENT.NS', 'ADANIENT.BO'];
  }
  if (s === 'ADANIPORTS') {
    return ['ADANIPORTS.NS', 'ADANIPORTS.BO'];
  }
  if (s === 'KOTAKBANK') {
    return ['KOTAKBANK.NS', 'KOTAKBANK.BO'];
  }
  if (s === 'LT') {
    return ['LT.NS', 'LT.BO'];
  }
  if (s === 'AXISBANK') {
    return ['AXISBANK.NS', 'AXISBANK.BO'];
  }
  if (s === 'MARUTI') {
    return ['MARUTI.NS', 'MARUTI.BO'];
  }
  if (s === 'TITAN') {
    return ['TITAN.NS', 'TITAN.BO'];
  }
  if (s === 'BAJFINANCE') {
    return ['BAJFINANCE.NS', 'BAJFINANCE.BO'];
  }

  // Generic fallback: first NSE, then BSE
  return [`${s}.NS`, `${s}.BO`];
}

export async function fetchYahooQuote(ticker: string) {
  // Check memory cache first
  const cached = quoteCache.get(ticker);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  // Hosts to try: query2 is usually faster and less restricted, then query1
  const hosts = ['https://query2.finance.yahoo.com', 'https://query1.finance.yahoo.com'];
  let lastError: any = null;

  for (const host of hosts) {
    const url = `${host}/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`;
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: AbortSignal.timeout(3500),
      });

      if (!res.ok) {
        lastError = new Error(`HTTP ${res.status}`);
        continue;
      }

      const data = (await res.json()) as any;
      const meta = data?.chart?.result?.[0]?.meta;
      if (!meta || meta.regularMarketPrice === undefined || meta.regularMarketPrice === null) {
        lastError = new Error('No price found in quote feed');
        continue;
      }

      const currentPrice = Number(meta.regularMarketPrice);
      const prevClose = Number(meta.previousClose || meta.chartPreviousClose || currentPrice);
      const dayChangePercent =
        prevClose > 0 ? Number((((currentPrice - prevClose) / prevClose) * 100).toFixed(2)) : 0;

      const result = {
        ticker,
        currentPrice,
        previousClose: prevClose,
        dayChangePercent,
        dayHigh: meta.regularMarketDayHigh || currentPrice,
        dayLow: meta.regularMarketDayLow || currentPrice,
        fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: meta.fiftyTwoWeekLow,
        currency: meta.currency || 'INR',
        exchange: meta.fullExchangeName || 'NSE',
        timestamp: new Date().toISOString(),
      };

      // Store in cache for 45 seconds
      quoteCache.set(ticker, {
        data: result,
        expiresAt: Date.now() + 45000,
      });

      return result;
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error(`Failed to fetch quote for ${ticker}`);
}
