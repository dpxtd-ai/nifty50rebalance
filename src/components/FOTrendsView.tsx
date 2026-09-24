import React, { useState } from 'react';
import { FOTrendStock, FOSignalType } from '../types/index.ts';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Shield,
  Layers,
  Activity,
  SlidersHorizontal,
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';

interface FOTrendsViewProps {
  foStocks: FOTrendStock[];
  onSelectStock: (symbol: string) => void;
  onRefreshFOTicks: () => void;
  isRefreshing: boolean;
  lastUpdated: string;
}

export const FOTrendsView: React.FC<FOTrendsViewProps> = ({
  foStocks,
  onSelectStock,
  onRefreshFOTicks,
  isRefreshing,
  lastUpdated,
}) => {
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredStocks = foStocks.filter((stock) => {
    if (filterAction === 'buy') {
      if (stock.recommendation.action !== 'STRONG_BUY' && stock.recommendation.action !== 'BUY_ON_DIPS') return false;
    } else if (filterAction === 'sell') {
      if (stock.recommendation.action !== 'SELL_SHORT' && stock.recommendation.action !== 'BOOK_PROFIT_EXIT') return false;
    }

    if (filterCategory === 'inclusions' && stock.nifty50Category !== 'Inclusion Contender') return false;
    if (filterCategory === 'exclusions' && stock.nifty50Category !== 'Endangered Constituent') return false;

    return true;
  });

  const getActionBadgeClass = (action: FOSignalType) => {
    switch (action) {
      case 'STRONG_BUY':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40';
      case 'BUY_ON_DIPS':
        return 'bg-teal-500/15 text-teal-400 border border-teal-500/40';
      case 'SELL_SHORT':
        return 'bg-rose-500/15 text-rose-400 border border-rose-500/40';
      case 'BOOK_PROFIT_EXIT':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  const getOITrendBadgeClass = (trend: string) => {
    switch (trend) {
      case 'Long Buildup':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Short Covering':
        return 'text-teal-400 bg-teal-500/10 border-teal-500/30';
      case 'Short Buildup':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'Long Unwinding':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium tracking-wide uppercase">
            <span>DERIVATIVES INTELLIGENCE &amp; ALGORITHMIC SIGNALS</span>
            <span aria-hidden="true">·</span>
            <span>NIFTY 50 F&amp;O UNIVERSE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <span>Nifty 50 F&amp;O Live Trends &amp; Buy/Sell Signals</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-time Open Interest (OI) buildup, PCR, Max Pain, and high-probability algorithmic trade recommendations correlated with Nifty 50 rebalancing flows.
          </p>
        </div>

        {/* Action button & timestamp */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] text-slate-400">Live OI Cycle</div>
            <div className="text-xs font-mono text-amber-300">{lastUpdated}</div>
          </div>
          <button
            onClick={onRefreshFOTicks}
            disabled={isRefreshing}
            className="px-3.5 py-2 text-xs font-medium text-slate-900 bg-amber-400 hover:bg-amber-300 rounded transition-colors flex items-center gap-2 font-sans cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh F&amp;O Ticks</span>
          </button>
        </div>
      </div>

      {/* Top F&O Market Pulse Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>TOP BULLISH LONG SETUP</span>
            <span className="text-emerald-400 font-mono text-[11px]">+16.8% OI</span>
          </div>
          <div className="text-base font-bold font-mono text-white mt-1 flex items-center justify-between">
            <span>ZOMATO (Fut: ₹286.20)</span>
            <span className="text-xs text-emerald-400 font-sans font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
              STRONG BUY
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Long Buildup · PCR 1.42 · Call unwinding at 285 CE
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>TOP BEARISH BREAKDOWN SETUP</span>
            <span className="text-rose-400 font-mono text-[11px]">+19.4% OI</span>
          </div>
          <div className="text-base font-bold font-mono text-rose-300 mt-1 flex items-center justify-between">
            <span>INDUSINDBK (Fut: ₹976.20)</span>
            <span className="text-xs text-rose-400 font-sans font-medium bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/30">
              SELL / SHORT
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Short Buildup · Future Discount -₹4.30 · PCR 0.58
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>NIFTY 50 F&amp;O COMPOSITE PCR</span>
            <span className="text-cyan-400 font-mono text-[11px]">Healthy</span>
          </div>
          <div className="text-base font-bold font-mono text-cyan-300 mt-1 flex items-center justify-between">
            <span>1.18 (Bullish Bias)</span>
            <span className="text-xs text-slate-400 font-mono">Max Pain: 26,100</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Derivatives roll-over cost positive; inclusion contenders driving volume
          </div>
        </div>
      </div>

      {/* Filter and View Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter Signal:</span>
          </span>
          <button
            onClick={() => setFilterAction('all')}
            className={`px-3 py-1 rounded transition-colors ${
              filterAction === 'all'
                ? 'bg-slate-800 text-white font-medium border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Signals ({foStocks.length})
          </button>
          <button
            onClick={() => setFilterAction('buy')}
            className={`px-3 py-1 rounded transition-colors ${
              filterAction === 'buy'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            Buy Signals
          </button>
          <button
            onClick={() => setFilterAction('sell')}
            className={`px-3 py-1 rounded transition-colors ${
              filterAction === 'sell'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-medium'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            Sell / Short Signals
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Rebalance Group:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded px-2.5 py-1 text-xs focus:outline-none focus:border-amber-400 font-mono"
          >
            <option value="all">All Groups</option>
            <option value="inclusions">Inclusion Contenders (Zomato, Trent, JioFin)</option>
            <option value="exclusions">Endangered Constituents (IndusInd, BPCL, Wipro)</option>
          </select>
        </div>
      </div>

      {/* Stock Signal Cards */}
      <div className="space-y-4">
        {filteredStocks.map((stock) => (
          <div
            key={stock.id}
            className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-lg p-4 sm:p-5 transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              {/* Left Column: Ticker & Derivatives Profile */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => onSelectStock(stock.symbol)}
                      className="text-lg font-bold font-mono text-white hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{stock.symbol}</span>
                    </button>
                    <span className="text-xs text-slate-400 font-medium">
                      {stock.name}
                    </span>
                    <span className="text-[11px] font-sans text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                      {stock.nifty50Category}
                    </span>
                  </div>

                  {/* Recommendation Action Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded tracking-wide ${getActionBadgeClass(stock.recommendation.action)}`}>
                      {stock.recommendation.action.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {stock.recommendation.confidencePercent}% Confidence
                    </span>
                  </div>
                </div>

                {/* Price, Basis & Technical Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
                    <div className="text-slate-400 text-[11px]">Spot Price</div>
                    <div className="text-sm font-bold font-mono text-white mt-0.5 tabular-nums">
                      ₹{stock.spotPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`text-[10px] font-mono ${stock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                    </div>
                  </div>

                  <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
                    <div className="text-slate-400 text-[11px]">Future Price (Basis)</div>
                    <div className="text-sm font-bold font-mono text-white mt-0.5 tabular-nums">
                      ₹{stock.futurePrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`text-[10px] font-mono ${stock.basis >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      Basis: {stock.basis >= 0 ? '+' : ''}₹{stock.basis.toFixed(2)} {stock.basis >= 0 ? '(Prem)' : '(Disc)'}
                    </div>
                  </div>

                  <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
                    <div className="text-slate-400 text-[11px]">OI Change &amp; Setup</div>
                    <div className="text-sm font-bold font-mono text-white mt-0.5 tabular-nums">
                      {stock.oiChangePercent >= 0 ? '+' : ''}{stock.oiChangePercent}%
                    </div>
                    <div className={`text-[10px] font-mono border rounded px-1 mt-0.5 inline-block ${getOITrendBadgeClass(stock.oiTrend)}`}>
                      {stock.oiTrend}
                    </div>
                  </div>

                  <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
                    <div className="text-slate-400 text-[11px]">PCR &amp; Max Pain</div>
                    <div className="text-sm font-bold font-mono text-white mt-0.5 tabular-nums">
                      PCR: {stock.pcrRatio}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      Pain: ₹{stock.maxPainStrike}
                    </div>
                  </div>

                  <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80 col-span-2 sm:col-span-1">
                    <div className="text-slate-400 text-[11px]">VWAP &amp; RSI (14)</div>
                    <div className="text-sm font-bold font-mono text-white mt-0.5 tabular-nums">
                      ₹{stock.vwap.toFixed(2)}
                    </div>
                    <div className={`text-[10px] font-mono ${stock.isAboveVwap ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stock.isAboveVwap ? 'Above VWAP ✓' : 'Below VWAP ✗'} · RSI {stock.rsi14}
                    </div>
                  </div>
                </div>

                {/* Algorithmic Recommendation & Trade Execution Plan */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Target className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-slate-300 font-medium">Trade Setup Plan:</span>
                      <span className="text-white font-mono font-semibold">
                        Entry: {stock.recommendation.entryRange}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs">
                      <div>
                        <span className="text-slate-400">Target: </span>
                        <span className="text-emerald-400 font-bold">₹{stock.recommendation.targetPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Stop Loss: </span>
                        <span className="text-rose-400 font-bold">₹{stock.recommendation.stopLoss.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">R:R: </span>
                        <span className="text-cyan-300 font-semibold">{stock.recommendation.riskRewardRatio}</span>
                      </div>
                      <div className="hidden sm:inline text-slate-500">
                        ({stock.recommendation.timeHorizon})
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-slate-300 leading-relaxed text-[11px] sm:text-xs">
                    <span className="text-amber-400 font-medium">Technical &amp; OI Rationale: </span>
                    {stock.recommendation.rationale}
                  </div>

                  <div className="mt-1 text-slate-400 text-[11px]">
                    <span className="text-indigo-400 font-medium">Rebalancing Driver: </span>
                    {stock.recommendation.rebalanceImpact}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Methodology Disclaimer */}
      <div className="p-3.5 bg-slate-900/40 border border-slate-800 rounded-lg text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-slate-300 font-medium">Derivatives Model Note: </span>
          F&amp;O recommendations combine real-time open interest changes, basis spreads, options max pain barriers, and institutional ETF liquidity flows. For educational and research purposes.
        </div>
        <div className="text-amber-400 font-mono text-[11px] shrink-0">
          Strict Stop-Loss Discipline Advised
        </div>
      </div>
    </div>
  );
};
