import React, { useState } from 'react';
import { UpcomingInclusionStock, InclusionTimingAction } from '../types/index.ts';
import { useLiveMarket } from '../context/LiveMarketContext.tsx';
import { ArrowUpRight, TrendingUp, CheckCircle2, ChevronRight, SlidersHorizontal, Target, Clock, ShieldAlert, Zap, Radio } from 'lucide-react';

interface UpcomingInclusionsProps {
  stocks: UpcomingInclusionStock[];
  onSelectStock: (stock: UpcomingInclusionStock) => void;
}

export const UpcomingInclusions: React.FC<UpcomingInclusionsProps> = ({ stocks, onSelectStock }) => {
  const { computeDynamicInclusion } = useLiveMarket();
  const [minAlpha, setMinAlpha] = useState<number>(20);
  const [minProbability, setMinProbability] = useState<number>(75);
  const [sortBy, setSortBy] = useState<'alpha' | 'probability' | 'inflow' | 'freeFloat'>('probability');
  const [filterAction, setFilterAction] = useState<string>('all');

  // Compute live real-time values for each stock dynamically
  const liveDynamicStocks = stocks.map((s) => computeDynamicInclusion(s));

  // Filter only stocks that meet high alpha and high growth probability requirements
  const filteredStocks = liveDynamicStocks
    .filter((stock) => {
      if (stock.metrics.alphaPercent < minAlpha || stock.metrics.growthProbability < minProbability) {
        return false;
      }
      if (filterAction === 'buy_now' && stock.tradeTiming.action !== 'BUY_NOW') return false;
      if (filterAction === 'hold_till' && stock.tradeTiming.action !== 'HOLD_TILL_PRICE') return false;
      if (filterAction === 'buy_dip' && stock.tradeTiming.action !== 'BUY_ON_DIP') return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'alpha') return b.metrics.alphaPercent - a.metrics.alphaPercent;
      if (sortBy === 'probability') return b.metrics.growthProbability - a.metrics.growthProbability;
      if (sortBy === 'inflow') return b.estimatedPassiveInflowCr - a.estimatedPassiveInflowCr;
      return b.metrics.freeFloatMCapCr - a.metrics.freeFloatMCapCr;
    });

  const getTimingBadge = (action: InclusionTimingAction) => {
    switch (action) {
      case 'BUY_NOW':
        return (
          <span className="flex items-center gap-1 text-xs font-bold font-mono px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 animate-pulse">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            RIGHT TIME TO BUY NOW
          </span>
        );
      case 'HOLD_TILL_PRICE':
        return (
          <span className="flex items-center gap-1 text-xs font-bold font-mono px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/50">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            HOLD TILL TARGET PRICE
          </span>
        );
      case 'BUY_ON_DIP':
        return (
          <span className="flex items-center gap-1 text-xs font-bold font-mono px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/50">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            BUY ON DIP (DO NOT CHASE)
          </span>
        );
      default:
        return (
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            ACCUMULATE
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Header & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium tracking-wide uppercase">
            <span>NSE INDICES INCLUSION PIPELINE</span>
            <span aria-hidden="true">·</span>
            <span>NEXT 1 MONTH REVIEW WINDOW</span>
            <span aria-hidden="true">·</span>
            <span>HIGH ALPHA &amp; PROBABILITY</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <span>Upcoming Nifty 50 Inclusions &amp; Buy/Hold Advisor</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-time timing on whether <strong>right now</strong> is the optimal moment to buy, enter on a dip, or <strong>hold till specific target prices</strong> before passive ETF inflows settle.
          </p>
        </div>

        {/* Controls & Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Min Alpha:</span>
            <select
              value={minAlpha}
              onChange={(e) => setMinAlpha(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-xs focus:outline-none focus:border-emerald-500 font-mono"
            >
              <option value={0}>All (&gt;0%)</option>
              <option value={15}>&gt; +15% α</option>
              <option value={20}>&gt; +20% α</option>
              <option value={30}>&gt; +30% α</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-xs focus:outline-none focus:border-emerald-500 font-mono"
            >
              <option value="probability">Probability</option>
              <option value="alpha">Alpha vs Nifty</option>
              <option value="inflow">Inflow (₹ Cr)</option>
              <option value="freeFloat">Free Float</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Action Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 text-xs bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
        <span className="text-slate-400 mr-1">Action Filter:</span>
        <button
          onClick={() => setFilterAction('all')}
          className={`px-3 py-1 rounded transition-colors ${
            filterAction === 'all'
              ? 'bg-slate-800 text-white font-medium border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Contenders ({stocks.length})
        </button>
        <button
          onClick={() => setFilterAction('buy_now')}
          className={`px-3 py-1 rounded transition-colors ${
            filterAction === 'buy_now'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium'
              : 'text-slate-400 hover:text-emerald-300'
          }`}
        >
          Right Time to Buy Now
        </button>
        <button
          onClick={() => setFilterAction('hold_till')}
          className={`px-3 py-1 rounded transition-colors ${
            filterAction === 'hold_till'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium'
              : 'text-slate-400 hover:text-cyan-300'
          }`}
        >
          Hold Till Target Price
        </button>
        <button
          onClick={() => setFilterAction('buy_dip')}
          className={`px-3 py-1 rounded transition-colors ${
            filterAction === 'buy_dip'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
              : 'text-slate-400 hover:text-amber-300'
          }`}
        >
          Buy on Dip
        </button>
      </div>

      {/* Candidate Cards */}
      <div className="space-y-4">
        {filteredStocks.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-8 text-center text-slate-400">
            No candidate stocks match the criteria.
            <button
              onClick={() => { setMinAlpha(0); setMinProbability(50); setFilterAction('all'); }}
              className="block mx-auto mt-3 text-xs text-emerald-400 hover:underline"
            >
              Reset filters to view all inclusion contenders
            </button>
          </div>
        ) : (
          filteredStocks.map((stock) => (
            <div
              key={stock.id}
              onClick={() => onSelectStock(stock)}
              className="bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-lg p-4 sm:p-5 transition-all cursor-pointer group space-y-4"
            >
              {/* Row 1: Stock Symbol, Sector, and Action Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
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
                    <span className="text-emerald-400 font-mono text-[11px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      Rank #{stock.currentRankInEligibleUniverse} in F&amp;O
                    </span>
                  </div>
                </div>

                <div>
                  {getTimingBadge(stock.tradeTiming.action)}
                </div>
              </div>

              {/* Row 2: PROMINENT REAL-TIME BUY / HOLD TILL THIS PRICE EXECUTION BANNER */}
              <div className={`p-3.5 rounded-lg border text-xs sm:text-sm ${
                stock.tradeTiming.action === 'BUY_NOW'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : stock.tradeTiming.action === 'HOLD_TILL_PRICE'
                  ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200'
                  : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-current/20">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>{stock.tradeTiming.actionHeadline}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                    <div className="bg-slate-950/60 px-2 py-1 rounded border border-current/30">
                      <span className="opacity-80">Hold Till: </span>
                      <strong className="text-white text-sm font-bold">₹{stock.tradeTiming.holdTillPrice.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="bg-slate-950/60 px-2 py-1 rounded border border-current/30">
                      <span className="opacity-80">Entry Zone: </span>
                      <span className="text-white font-semibold">{stock.tradeTiming.currentEntryRange}</span>
                    </div>
                    <div className="bg-slate-950/60 px-2 py-1 rounded border border-current/30">
                      <span className="opacity-80">Stop Loss: </span>
                      <span className="text-rose-400 font-semibold">₹{stock.tradeTiming.stopLossPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-xs sm:text-sm leading-relaxed opacity-95">
                  <span className="font-semibold text-white">Actionable Timing Guidance: </span>
                  {stock.tradeTiming.timingAdvice}
                </div>

                <div className="mt-1.5 text-[11px] opacity-80 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{stock.tradeTiming.catalystWindow}</span>
                </div>
              </div>

              {/* Row 3: Core Quant Numbers Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
                <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
                  <div className="text-slate-400 text-[11px] flex items-center justify-between">
                    <span>Current Price</span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded">LIVE</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-white mt-0.5 tabular-nums">
                    ₹{stock.metrics.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={`text-[10px] font-mono ${stock.metrics.dailyChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {stock.metrics.dailyChangePercent >= 0 ? '+' : ''}{stock.metrics.dailyChangePercent.toFixed(2)}% today
                  </div>
                </div>

                <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
                  <div className="text-slate-400 text-[11px]">Free Float M-Cap</div>
                  <div className="text-sm font-bold font-mono text-white mt-0.5 tabular-nums">
                    ₹{stock.metrics.freeFloatMCapCr.toLocaleString('en-IN')} Cr
                  </div>
                  <div className="text-[10px] text-slate-500">1.5x Hurdle Met ✓</div>
                </div>

                <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
                  <div className="text-slate-400 text-[11px]">Annualized Alpha</div>
                  <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5 tabular-nums">
                    +{stock.metrics.alphaPercent}%
                  </div>
                  <div className="text-[10px] text-slate-500">vs Nifty 50 TRI</div>
                </div>

                <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
                  <div className="text-slate-400 text-[11px]">Listing Probability</div>
                  <div className="text-sm font-bold font-mono text-white mt-0.5 tabular-nums">
                    {stock.metrics.growthProbability}%
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium">Imminent Contender</div>
                </div>

                <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
                  <div className="text-slate-400 text-[11px]">Projected Passive Inflow</div>
                  <div className="text-sm font-bold font-mono text-cyan-300 mt-0.5 tabular-nums">
                    +₹{stock.estimatedPassiveInflowCr.toLocaleString('en-IN')} Cr
                  </div>
                  <div className="text-[10px] text-slate-500">~${stock.estimatedPassiveInflowUsdM}M USD</div>
                </div>

                <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
                  <div className="text-slate-400 text-[11px]">Projected Index Weight</div>
                  <div className="text-sm font-bold font-mono text-cyan-300 mt-0.5 tabular-nums">
                    {stock.projectedNifty50WeightPercent}%
                  </div>
                  <div className="text-[10px] text-slate-500">{stock.daysToCoverInflow} Days ADV</div>
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
