import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';
import { mapIndianSymbolToYahooTicker, fetchYahooQuote } from './src/utils/quoteFetcher.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function liveQuotePlugin(): Plugin {
  return {
    name: 'live-quote-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || '', 'http://localhost:3000');

        if (url.pathname === '/api/quote') {
          const symbol = url.searchParams.get('symbol') || '';
          res.setHeader('Content-Type', 'application/json');

          if (!symbol) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'symbol query parameter is required' }));
            return;
          }

          try {
            const tickers = mapIndianSymbolToYahooTicker(symbol);
            for (const ticker of tickers) {
              try {
                const quote = await fetchYahooQuote(ticker);
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true, symbol, ...quote }));
                return;
              } catch {
                // try next
              }
            }
            res.statusCode = 404;
            res.end(JSON.stringify({ success: false, symbol, error: `Quote not found for ${symbol}` }));
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: e?.message || 'Server error' }));
          }
          return;
        }

        if (url.pathname === '/api/quotes') {
          const symbols = (url.searchParams.get('symbols') || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
          res.setHeader('Content-Type', 'application/json');

          const results: Record<string, any> = {};
          await Promise.all(
            symbols.map(async (sym) => {
              const tickers = mapIndianSymbolToYahooTicker(sym);
              for (const ticker of tickers) {
                try {
                  const q = await fetchYahooQuote(ticker);
                  results[sym] = q;
                  return;
                } catch {
                  // next
                }
              }
            })
          );

          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, quotes: results }));
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), liveQuotePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
