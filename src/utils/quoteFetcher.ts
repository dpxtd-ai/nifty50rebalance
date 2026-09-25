/**
 * Live market quote fetcher for Indian NSE/BSE securities.
 */

export function mapIndianSymbolToYahooTicker(rawSymbol: string): string[] {
  const s = rawSymbol.trim().toUpperCase().replace(/\s+/g, '');

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
  if (s === 'NATIONALUM' || s.includes('ALUMIN')) {
    return ['NATIONALUM.NS', 'NATIONALUM.BO'];
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

  return [`${s}.NS`, `${s}.BO`];
}

export async function fetchYahooQuote(ticker: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = (await res.json()) as any;
  const meta = data?.chart?.result?.[0]?.meta;
  if (!meta || meta.regularMarketPrice === undefined) {
    throw new Error('No price found in quote feed');
  }

  const currentPrice = Number(meta.regularMarketPrice);
  const prevClose = Number(meta.previousClose || meta.chartPreviousClose || currentPrice);
  const dayChangePercent =
    prevClose > 0 ? Number((((currentPrice - prevClose) / prevClose) * 100).toFixed(2)) : 0;

  return {
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
    timestamp: new Date().toISOString()
  };
}
