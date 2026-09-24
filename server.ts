import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Helper mapping for Indian tickers to Yahoo Finance tickers
function mapIndianSymbolToYahooTicker(rawSymbol: string): string[] {
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
  if (s === 'GRSE') {
    return ['GRSE.NS', 'GRSE.BO'];
  }
  if (s === 'BEL') {
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

  return [`${s}.NS`, `${s}.BO`];
}

async function fetchYahooQuote(ticker: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as any;
  const meta = data?.chart?.result?.[0]?.meta;
  if (!meta || meta.regularMarketPrice === undefined) {
    throw new Error('No price in response');
  }
  const currentPrice = Number(meta.regularMarketPrice);
  const prevClose = Number(meta.previousClose || meta.chartPreviousClose || currentPrice);
  const dayChangePercent = prevClose > 0 ? Number((((currentPrice - prevClose) / prevClose) * 100).toFixed(2)) : 0;

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

// Live real-time single quote endpoint
app.get('/api/quote', async (req, res) => {
  const symbol = String(req.query.symbol || '').trim();
  if (!symbol) {
    return res.status(400).json({ error: 'symbol query parameter is required' });
  }

  const tickersToTry = mapIndianSymbolToYahooTicker(symbol);
  for (const ticker of tickersToTry) {
    try {
      const quote = await fetchYahooQuote(ticker);
      return res.json({ success: true, symbol, ...quote });
    } catch {
      // try next
    }
  }

  return res.status(404).json({
    success: false,
    symbol,
    error: `Could not fetch live quote for ${symbol}`
  });
});

// Live real-time batch quotes endpoint
app.get('/api/quotes', async (req, res) => {
  const symbolsRaw = String(req.query.symbols || '');
  const symbols = symbolsRaw.split(',').map((s) => s.trim()).filter(Boolean);
  const results: Record<string, any> = {};

  await Promise.all(
    symbols.map(async (sym) => {
      const tickersToTry = mapIndianSymbolToYahooTicker(sym);
      for (const ticker of tickersToTry) {
        try {
          const q = await fetchYahooQuote(ticker);
          results[sym] = q;
          return;
        } catch {
          // try next
        }
      }
    })
  );

  return res.json({ success: true, quotes: results });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);
