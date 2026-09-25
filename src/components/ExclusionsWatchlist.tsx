import React, { useState } from 'react';
import { ExclusionDelistingStock, RebalanceTimeline } from '../types/index.ts';
import { useLiveMarket } from '../context/LiveMarketContext.tsx';
import { AlertTriangle, TrendingDown, Clock, ShieldAlert, ChevronRight, ArrowDownRight, Filter } from 'lucide-react';

interface ExclusionsWatchlistProps {
  stocks: ExclusionDelistingStock[];
  onSelectStock: (stock: ExclusionDelistingStock) => void;
}

export const ExclusionsWatchlist: React.FC<ExclusionsWatchlistProps> = ({ stocks, onSelectStock }) => {
  const { computeDynamicExclusion } = useLiveMarket();
  const [selectedHorizon, setSelectedHorizon] = useState<RebalanceTimeline | 'all'>('all');

  // Compute live values dynamically
  const liveDynamicStocks = stocks.map((s) => computeDynamicExclusion(s));

  const filteredStocks = liveDynamicStocks.filter((stock) => {
    if (selectedHorizon === 'all') return true;
    return stock.timelineCategory === selectedHorizon;
  });

  const getTimelineLabel = (timeline: RebalanceTimeline) => {
    switch (timeline) {
      case '15_days':
        return 'Near Next 15 Days (Urgent)';
      case '1_month':
        return 'Next 1 Month (Semi-Annual Cut-off)';
      case '2_months':
        return 'Next 2 Months (Watchlist Buffer)';
    }
  };

  const getTimelineBadgeClass = (timeline: RebalanceTimeline) => {
    switch (timeline) {
      case '15_days':
        return 'text-rose-400 border border-rose-500/30 bg-rose-500/10';
      case '1_month':
        return 'text-amber-400 border border-amber-500/30 bg-amber-500/10';
      case '2_months':
        return 'text-indigo-400 border border-indigo-500/30 bg-indigo-500/10';
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-rose-400 font-medium tracking-wide uppercase">
            <span>NSE INDICES EXCLUSION &amp; DELISTING WATCHLIST</span>
            <span aria-hidden="true">·</span>
            <span>TIMELINES: 15 DAYS · 1 MONTH · 2 MONTHS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Stocks Vulnerable to Nifty 50 Deletion
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Current Nifty 50 constituents in danger of exclusion due to falling free-float rank, negative alpha drag, or replacement rule breach.
          </p>
        </div>

        {/* Horizon Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedHorizon('all')}
            className={`px-3 py-1.5 font-medium rounded transition-colors ${
              selectedHorizon === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Horizons ({stocks.length})
          </button>
          <button
            onClick={() => setSelectedHorizon('15_days')}
            className={`px-3 py-1.5 font-medium rounded transition-colors ${
              selectedHorizon === '15_days'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            Near 15 Days
          </button>
          <button
            onClick={() => setSelectedHorizon('1_month')}
            className={`px-3 py-1.5 font-medium rounded transition-colors ${
              selectedHorizon === '1_month'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            Next 1 Month
          </button>
          <button
            onClick={() => setSelectedHorizon('2_months')}
            className={`px-3 py-1.5 font-medium rounded transition-colors ${
              selectedHorizon === '2_months'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-indigo-300'
            }`}
          >
            Next 2 Months
          </button>
        </div>
      </div>

      {/* Exclusions List */}
      <div className="space-y-3">
        {filteredStocks.map((stock) => (
          <div
            key={stock.id}
            onClick={() => onSelectStock(stock)}
            className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-lg p-4 sm:p-5 transition-all cursor-pointer group"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left Details */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="text-lg font-bold font-mono text-white group-hover:text-rose-300 transition-colors">
                    {stock.symbol}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {stock.name}
                  </span>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${getTimelineBadgeClass(stock.timelineCategory)}`}>
                    {getTimelineLabel(stock.timelineCategory)}
                  </span>
                  <span className="text-xs text-rose-400 font-mono">
                    Current Rank #{stock.currentNifty50Rank}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span>Price: </span>
                    <span className="text-white font-mono font-medium tabular-nums">
                      ₹{stock.metrics.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className={`font-mono tabular-nums ${stock.metrics.dailyChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ({stock.metrics.dailyChangePercent >= 0 ? '+' : ''}{stock.metrics.dailyChangePercent.toFixed(2)}%)
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded">LIVE</span>
                  </div>
                  <span aria-hidden="true" className="text-slate-600">|</span>
                  <div>
                    <span>Free Float: </span>
                    <span className="text-white font-mono tabular-nums">
                      ₹{stock.freeFloatMCapCr.toLocaleString('en-IN')} Cr
                    </span>
                  </div>
                  <span aria-hidden="true" className="text-slate-600">|</span>
                  <div>
                    <span>Cut-off Deficit: </span>
                    <span className="text-rose-400 font-mono font-semibold tabular-nums">
                      ₹{Math.abs(stock.gapToReplacementCutoffCr).toLocaleString('en-IN')} Cr below hurdle
                    </span>
                  </div>
                  <span aria-hidden="true" className="text-slate-600">|</span>
                  <div>
                    <span>Likely Replacement: </span>
                    <span className="text-emerald-400 font-mono font-medium">
                      {stock.likelyReplacementSymbol}
                    </span>
                  </div>
                </div>

                {/* Exclusion Reason & Vulnerability Box */}
                <div className="mt-3 text-xs text-slate-300 bg-slate-950/60 border border-slate-800/80 rounded p-2.5">
                  <div>
                    <span className="text-rose-400 font-medium">Exclusion Reason: </span>
                    <span className="text-slate-300">{stock.exclusionReason}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-amber-400 font-medium">Vulnerability Driver: </span>
                    <span className="text-slate-400">{stock.vulnerabilityFactor}</span>
                  </div>
                </div>
              </div>

              {/* Right: Quant Island (Negative Alpha, Outflow, Days to Absorb) */}
              <div className="flex flex-row sm:flex-row lg:flex-col items-start lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-slate-800 pt-3 lg:pt-0 lg:pl-6 gap-4 min-w-[240px]">
                <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 w-full text-left lg:text-right">
                  <div>
                    <div className="text-[11px] text-slate-400">Alpha Drag (1Y)</div>
                    <div className="text-base sm:text-lg font-bold font-mono text-rose-400 tabular-nums">
                      {stock.metrics.alphaPercent}%
                    </div>
                    <div className="text-[10px] text-slate-500">Underperforming Benchmark</div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-400">Retention Score</div>
                    <div className="text-base sm:text-lg font-bold font-mono text-white tabular-nums flex items-center lg:justify-end gap-1">
                      <span>{stock.metrics.growthProbability}%</span>
                      <span className="text-[10px] text-rose-400 font-sans font-medium">Critical</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className="bg-rose-500 h-full rounded-full"
                        style={{ width: `${Math.max(5, stock.metrics.growthProbability)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full text-left lg:text-right pt-2 border-t border-slate-800/60">
                  <div className="text-[11px] text-slate-400">
                    Projected Passive ETF Outflow
                  </div>
                  <div className="text-sm sm:text-base font-bold font-mono text-rose-300 tabular-nums">
                    -₹{stock.estimatedPassiveOutflowCr.toLocaleString('en-IN')} Cr
                    <span className="text-xs text-slate-400 font-normal ml-1">
                      (~${stock.estimatedPassiveOutflowUsdM}M)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center lg:justify-end gap-1 mt-0.5">
                    <span>Days to Absorb Selling:</span>
                    <span className="font-mono text-white font-medium">{stock.daysToAbsorbOutflow} days</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
