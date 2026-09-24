import React, { useState } from 'react';
import { FOTrendStock, FOSignalType, TimingStatus } from '../types/index.ts';
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
  Info,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlayCircle
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
  const [filterTiming, setFilterTiming] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const buyNowCount = foStocks.filter((s) => s.timing.status === 'BUY_NOW').length;
  const sellNowCount = foStocks.filter((s) => s.timing.status === 'SELL_SHORT_NOW').length;
  const waitDipCount = foStocks.filter((s) => s.timing.status === 'WAIT_FOR_DIP').length;

  const filteredStocks = foStocks.filter((stock) => {
    if (filterTiming === 'buy_now' && stock.timing.status !== 'BUY_NOW') return false;
    if (filterTiming === 'sell_now' && stock.timing.status !== 'SELL_SHORT_NOW') return false;
    if (filterTiming === 'wait_dip' && stock.timing.status !== 'WAIT_FOR_DIP') return false;

    if (filterCategory === 'inclusions' && stock.nifty50Category !== 'Inclusion Contender') return false;
    if (filterCategory === 'exclusions' && stock.nifty50Category !== 'Endangered Constituent') return false;

    return true;
  });

  const getTimingCardClass = (status: TimingStatus) => {
    switch (status) {
      case 'BUY_NOW':
        return 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200';
      case 'SELL_SHORT_NOW':
        return 'bg-rose-950/40 border-rose-500/50 text-rose-200';
      case 'WAIT_FOR_DIP':
        return 'bg-amber-950/40 border-amber-500/40 text-amber-200';
      default:
        return 'bg-slate-900/60 border-slate-800 text-slate-300';
    }
  };

  const getTimingBadge = (status: TimingStatus) => {
    switch (status) {
      case 'BUY_NOW':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold font-mono px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            RIGHT TIME TO BUY NOW
          </span>
        );
      case 'SELL_SHORT_NOW':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold font-mono px-3 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/60 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            RIGHT TIME TO SELL / SHORT NOW
          </span>
        );
      case 'WAIT_FOR_DIP':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold font-mono px-3 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/60">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            WAIT FOR DIP (DO NOT CHASE)
          </span>
        );
      default:
        return (
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
            HOLD / CONSOLIDATING
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium tracking-wide uppercase">
            <span>REAL-TIME DERIVATIVES EXECUTION RADAR</span>
            <span aria-hidden="true">·</span>
            <span>NIFTY 50 F&amp;O UNIVERSE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <span>F&amp;O Real-Time Buy / Sell Timing Signals</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-time algorithmic timing advisor: Instantly signals whether right now is the optimal window to BUY, SELL/SHORT, or WAIT for a pullback.
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
            <span>Refresh Timing Ticks</span>
          </button>
        </div>
      </div>

      {/* Real-Time Timing Window Pulse Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Buy Now Status Card */}
        <div
          onClick={() => setFilterTiming('buy_now')}
          className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
            filterTiming === 'buy_now'
              ? 'bg-emerald-950/60 border-emerald-500 shadow-md'
              : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/40'
          }`}
        >
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span className="font-semibold text-emerald-400">RIGHT TIME TO BUY NOW</span>
            <span className="text-emerald-400 font-mono text-xs font-bold">{buyNowCount} Active</span>
          </div>
          <div className="text-base font-bold font-mono text-white mt-1.5 flex items-center justify-between">
            <span>ZOMATO, JIOFIN, HDFCBANK</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Confirmed VWAP breakout + Call short covering underway
          </div>
        </div>

        {/* Sell / Short Now Status Card */}
        <div
          onClick={() => setFilterTiming('sell_now')}
          className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
            filterTiming === 'sell_now'
              ? 'bg-rose-950/60 border-rose-500 shadow-md'
              : 'bg-slate-900/60 border-slate-800 hover:border-rose-500/40'
          }`}
        >
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span className="font-semibold text-rose-400">RIGHT TIME TO SELL / SHORT NOW</span>
            <span className="text-rose-400 font-mono text-xs font-bold">{sellNowCount} Active</span>
          </div>
          <div className="text-base font-bold font-mono text-rose-300 mt-1.5 flex items-center justify-between">
            <span>INDUSINDBK, BPCL, WIPRO</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Key support broken + Heavy Call writing resistance
          </div>
        </div>

        {/* Wait For Dip Card */}
        <div
          onClick={() => setFilterTiming('wait_dip')}
          className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
            filterTiming === 'wait_dip'
              ? 'bg-amber-950/60 border-amber-500 shadow-md'
              : 'bg-slate-900/60 border-slate-800 hover:border-amber-500/40'
          }`}
        >
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span className="font-semibold text-amber-400">WAIT FOR DIP / DO NOT CHASE</span>
            <span className="text-amber-400 font-mono text-xs font-bold">{waitDipCount} Stocks</span>
          </div>
          <div className="text-base font-bold font-mono text-amber-300 mt-1.5 flex items-center justify-between">
            <span>TRENT, RELIANCE</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Approaching resistance; wait for pullback to entry zone
          </div>
        </div>
      </div>

      {/* Filter Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter Timing:</span>
          </span>
          <button
            onClick={() => setFilterTiming('all')}
            className={`px-3 py-1 rounded transition-colors ${
              filterTiming === 'all'
                ? 'bg-slate-800 text-white font-medium border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Stocks ({foStocks.length})
          </button>
          <button
            onClick={() => setFilterTiming('buy_now')}
            className={`px-3 py-1 rounded transition-colors ${
              filterTiming === 'buy_now'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            Right Time to Buy Now ({buyNowCount})
          </button>
          <button
            onClick={() => setFilterTiming('sell_now')}
            className={`px-3 py-1 rounded transition-colors ${
              filterTiming === 'sell_now'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-medium'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            Right Time to Sell / Short Now ({sellNowCount})
          </button>
          <button
            onClick={() => setFilterTiming('wait_dip')}
            className={`px-3 py-1 rounded transition-colors ${
              filterTiming === 'wait_dip'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            Wait for Dip ({waitDipCount})
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Index Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded px-2.5 py-1 text-xs focus:outline-none focus:border-amber-400 font-mono"
          >
            <option value="all">All Constituents</option>
            <option value="inclusions">Inclusion Contenders (Zomato, Trent, JioFin)</option>
            <option value="exclusions">Endangered Constituents (IndusInd, BPCL, Wipro)</option>
          </select>
        </div>
      </div>

      {/* Stock Cards with Dedicated Real-Time Timing Message */}
      <div className="space-y-4">
        {filteredStocks.map((stock) => (
          <div
            key={stock.id}
            className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-lg p-4 sm:p-5 transition-all space-y-4"
          >
            {/* Header: Ticker, Category & Timing Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
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

              <div>{getTimingBadge(stock.timing.status)}</div>
            </div>

            {/* PROMINENT REAL-TIME TIMING EXECUTION MESSAGE BANNER */}
            <div className={`p-3.5 sm:p-4 rounded-lg border ${getTimingCardClass(stock.timing.status)}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-sm sm:text-base font-bold tracking-tight">
                  {stock.timing.headline}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono opacity-90">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{stock.timing.validityWindow}</span>
                </div>
              </div>

              <div className="text-xs sm:text-sm mt-2 leading-relaxed opacity-95">
                {stock.timing.actionPrompt}
              </div>

              {/* 4-Point Real-Time Trigger Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-current/20 text-[11px]">
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-current opacity-80" />
                  <div>
                    <span className="font-semibold block">Candle Structure:</span>
                    <span className="opacity-80">{stock.timing.checklist.candleSignal}</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-current opacity-80" />
                  <div>
                    <span className="font-semibold block">VWAP Position:</span>
                    <span className="opacity-80">{stock.timing.checklist.vwapStatus}</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-current opacity-80" />
                  <div>
                    <span className="font-semibold block">Volume Surge:</span>
                    <span className="opacity-80">{stock.timing.checklist.volumeConfirmation}</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-current opacity-80" />
                  <div>
                    <span className="font-semibold block">Option Flow:</span>
                    <span className="opacity-80">{stock.timing.checklist.derivativesOrderFlow}</span>
                  </div>
                </div>
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
                <div className="text-[10px] font-mono text-slate-300 mt-0.5">
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

            {/* Trade Execution Plan Levels */}
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
        ))}
      </div>
    </div>
  );
};
