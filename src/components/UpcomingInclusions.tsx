import React, { useState } from 'react';
import { UpcomingInclusionStock } from '../types/index.ts';
import { ArrowUpRight, TrendingUp, CheckCircle2, ChevronRight, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface UpcomingInclusionsProps {
  stocks: UpcomingInclusionStock[];
  onSelectStock: (stock: UpcomingInclusionStock) => void;
}

export const UpcomingInclusions: React.FC<UpcomingInclusionsProps> = ({ stocks, onSelectStock }) => {
  const [minAlpha, setMinAlpha] = useState<number>(20);
  const [minProbability, setMinProbability] = useState<number>(75);
  const [sortBy, setSortBy] = useState<'alpha' | 'probability' | 'inflow' | 'freeFloat'>('probability');

  // Filter only stocks that meet high alpha and high growth probability requirements
  const filteredStocks = stocks
    .filter((stock) => stock.metrics.alphaPercent >= minAlpha && stock.metrics.growthProbability >= minProbability)
    .sort((a, b) => {
      if (sortBy === 'alpha') return b.metrics.alphaPercent - a.metrics.alphaPercent;
      if (sortBy === 'probability') return b.metrics.growthProbability - a.metrics.growthProbability;
      if (sortBy === 'inflow') return b.estimatedPassiveInflowCr - a.estimatedPassiveInflowCr;
      return b.metrics.freeFloatMCapCr - a.metrics.freeFloatMCapCr;
    });

  return (
    <div className="space-y-4">
      {/* Section Header & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium tracking-wide uppercase">
            <span>NSE INDICES INCLUSION PIPELINE</span>
            <span aria-hidden="true">·</span>
            <span>TIMELINE: NEXT 1 MONTH</span>
            <span aria-hidden="true">·</span>
            <span>HIGH ALPHA &amp; PROBABILITY FILTER</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Upcoming Nifty 50 Inclusions
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Non-constituent Indian stocks qualifying for Nifty 50 entry based on 6-month free float hurdle (1.5x rule), F&amp;O liquidity, superior alpha generation, and growth momentum.
          </p>
        </div>

        {/* Controls & Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Min Alpha:</span>
            <select
              value={minAlpha}
              onChange={(e) => setMinAlpha(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-xs focus:outline-none focus:border-emerald-500 font-mono"
            >
              <option value={0}>All positive (&gt;0%)</option>
              <option value={15}>&gt; +15% α</option>
              <option value={20}>&gt; +20% α (Strict)</option>
              <option value={30}>&gt; +30% α (High Alpha)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span>Min Prob:</span>
            <select
              value={minProbability}
              onChange={(e) => setMinProbability(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-xs focus:outline-none focus:border-emerald-500 font-mono"
            >
              <option value={50}>&gt; 50%</option>
              <option value={70}>&gt; 70%</option>
              <option value={75}>&gt; 75% (High Prob)</option>
              <option value={85}>&gt; 85% (Imminent)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-xs focus:outline-none focus:border-emerald-500 font-mono"
            >
              <option value="probability">Growth Probability</option>
              <option value="alpha">Alpha vs Nifty 50</option>
              <option value="inflow">Passive Inflow (₹ Cr)</option>
              <option value="freeFloat">Free Float MCap</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidate Cards / Table */}
      <div className="space-y-3">
        {filteredStocks.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-8 text-center text-slate-400">
            No candidate stocks match the strict alpha (&gt;{minAlpha}%) and growth probability (&gt;{minProbability}%) filters.
            <button
              onClick={() => { setMinAlpha(0); setMinProbability(50); }}
              className="block mx-auto mt-3 text-xs text-emerald-400 hover:underline"
            >
              Reset criteria to view all contenders
            </button>
          </div>
        ) : (
          filteredStocks.map((stock) => (
            <div
              key={stock.id}
              onClick={() => onSelectStock(stock)}
              className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-lg p-4 sm:p-5 transition-all cursor-pointer group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Stock Identification and Core Metrics */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold font-mono text-white group-hover:text-emerald-300 transition-colors">
                      {stock.symbol}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {stock.name}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <span aria-hidden="true">·</span>
                      <span>{stock.sector}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-400 font-mono">F&amp;O Active</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-400">
                    <div>
                      <span>Price: </span>
                      <span className="text-white font-mono font-medium tabular-nums">
                        ₹{stock.metrics.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-emerald-400 font-mono ml-1 tabular-nums">
                        (+{stock.metrics.dailyChangePercent}%)
                      </span>
                    </div>
                    <span aria-hidden="true" className="text-slate-600">|</span>
                    <div>
                      <span>Free Float: </span>
                      <span className="text-white font-mono tabular-nums">
                        ₹{stock.metrics.freeFloatMCapCr.toLocaleString('en-IN')} Cr
                      </span>
                    </div>
                    <span aria-hidden="true" className="text-slate-600">|</span>
                    <div>
                      <span>Impact Cost: </span>
                      <span className="text-white font-mono tabular-nums">
                        {stock.metrics.impactCostPercent}% (≤0.50% ✓)
                      </span>
                    </div>
                    <span aria-hidden="true" className="text-slate-600">|</span>
                    <div>
                      <span>Projected Weight: </span>
                      <span className="text-cyan-300 font-mono font-medium tabular-nums">
                        {stock.projectedNifty50WeightPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Alpha & Catalyst summary */}
                  <div className="mt-3 text-xs text-slate-300 bg-slate-950/60 border border-slate-800/80 rounded p-2.5">
                    <div className="text-slate-400">
                      <span className="text-emerald-400 font-medium">Alpha Rationale: </span>
                      {stock.alphaRationale}
                    </div>
                    <div className="mt-1 text-slate-400">
                      <span className="text-cyan-400 font-medium">Growth Driver: </span>
                      {stock.growthDriver}
                    </div>
                  </div>
                </div>

                {/* Right: Alpha, Probability, and Passive Inflow Quant Island */}
                <div className="flex flex-row sm:flex-row lg:flex-col items-start lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-slate-800 pt-3 lg:pt-0 lg:pl-6 gap-4 min-w-[240px]">
                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 w-full text-left lg:text-right">
                    <div>
                      <div className="text-[11px] text-slate-400">Annualized Alpha</div>
                      <div className="text-base sm:text-lg font-bold font-mono text-emerald-400 tabular-nums">
                        +{stock.metrics.alphaPercent}%
                      </div>
                      <div className="text-[10px] text-slate-500">vs Nifty 50 TRI</div>
                    </div>

                    <div>
                      <div className="text-[11px] text-slate-400">Listing Probability</div>
                      <div className="text-base sm:text-lg font-bold font-mono text-white tabular-nums flex items-center lg:justify-end gap-1">
                        <span>{stock.metrics.growthProbability}%</span>
                        <span className="text-[10px] text-emerald-400 font-sans font-medium">High</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-emerald-400 h-full rounded-full"
                          style={{ width: `${stock.metrics.growthProbability}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-full text-left lg:text-right pt-2 border-t border-slate-800/60">
                    <div className="text-[11px] text-slate-400">
                      Projected Passive ETF Inflow
                    </div>
                    <div className="text-sm sm:text-base font-bold font-mono text-cyan-300 tabular-nums">
                      +₹{stock.estimatedPassiveInflowCr.toLocaleString('en-IN')} Cr
                      <span className="text-xs text-slate-400 font-normal ml-1">
                        (~${stock.estimatedPassiveInflowUsdM}M)
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center lg:justify-end gap-1 mt-0.5">
                      <span>Days to Cover:</span>
                      <span className="font-mono text-white font-medium">{stock.daysToCoverInflow} days</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Methodology Reference Footer Note */}
      <div className="p-3 bg-slate-900/40 border border-slate-800/80 rounded-lg text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-slate-300 font-medium">NSE Selection Invariant: </span>
          Eligible stocks must have 6-month average free float market cap &ge; 1.5x of the smallest constituent (#50 floor: ₹38,450 Cr &rarr; Hurdle: ₹57,675 Cr).
        </div>
        <div className="text-emerald-400 font-mono text-[11px] shrink-0">
          All displayed candidates pass 1.5x rule
        </div>
      </div>
    </div>
  );
};
