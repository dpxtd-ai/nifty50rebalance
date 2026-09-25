import React, { useState } from 'react';
import { FOTrendStock, FOSignalType, TimingStatus } from '../types/index.ts';
import { useLiveMarket } from '../context/LiveMarketContext.tsx';
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
  autoRefreshSecondsLeft: number;
  autoRefreshEnabled: boolean;
  onToggleAutoRefresh: () => void;
}

export const FOTrendsView: React.FC<FOTrendsViewProps> = ({
  foStocks,
  onSelectStock,
  onRefreshFOTicks,
  isRefreshing,
  lastUpdated,
  autoRefreshSecondsLeft,
  autoRefreshEnabled,
  onToggleAutoRefresh,
}) => {
  const { computeDynamicFOTrend } = useLiveMarket();
  const [filterTiming, setFilterTiming] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterOptionType, setFilterOptionType] = useState<'all' | 'CE' | 'PE'>('all');

  // Dynamically update spot, futures, basis, headlines, and CE/PE options from live quotes
  const liveFOStocks = foStocks.map((stock) => computeDynamicFOTrend(stock));

  const buyNowCount = liveFOStocks.filter((s) => s.timing.status === 'BUY_NOW').length;
  const sellNowCount = liveFOStocks.filter((s) => s.timing.status === 'SELL_SHORT_NOW').length;
  const waitDipCount = liveFOStocks.filter((s) => s.timing.status === 'WAIT_FOR_DIP').length;
  const callCount = liveFOStocks.filter((s) => s.optionSetup?.type === 'CE').length;
  const putCount = liveFOStocks.filter((s) => s.optionSetup?.type === 'PE').length;

  const filteredStocks = liveFOStocks.filter((stock) => {
    if (filterTiming === 'buy_now' && stock.timing.status !== 'BUY_NOW') return false;
    if (filterTiming === 'sell_now' && stock.timing.status !== 'SELL_SHORT_NOW') return false;
    if (filterTiming === 'wait_dip' && stock.timing.status !== 'WAIT_FOR_DIP') return false;

    if (filterCategory === 'inclusions' && stock.nifty50Category !== 'Inclusion Contender') return false;
    if (filterCategory === 'exclusions' && stock.nifty50Category !== 'Endangered Constituent') return false;

    if (filterOptionType === 'CE' && stock.optionSetup?.type !== 'CE') return false;
    if (filterOptionType === 'PE' && stock.optionSetup?.type !== 'PE') return false;

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

        {/* Action button & timestamp with 30s auto-refresh countdown */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 whitespace-nowrap">
          <button
            onClick={onToggleAutoRefresh}
            title={autoRefreshEnabled ? "Click to pause 30s auto-refresh" : "Click to resume 30s auto-refresh"}
            className={`px-2.5 py-1.5 rounded text-xs font-mono border flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              autoRefreshEnabled
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${autoRefreshEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>Auto: {autoRefreshEnabled ? `${autoRefreshSecondsLeft}s` : 'Paused'}</span>
          </button>

          <button
            onClick={onRefreshFOTicks}
            disabled={isRefreshing}
            className="px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-medium text-slate-900 bg-amber-400 hover:bg-amber-300 rounded transition-colors flex items-center gap-1.5 sm:gap-2 font-sans cursor-pointer disabled:opacity-50 shadow-sm shrink-0"
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

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Option Type Filter: CE vs PE */}
          <button
            onClick={() => setFilterOptionType('CE')}
            className={`px-3 py-1 rounded transition-colors ${
              filterOptionType === 'CE'
                ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 font-bold'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            Buy CE Calls ({callCount})
          </button>
          <button
            onClick={() => setFilterOptionType('PE')}
            className={`px-3 py-1 rounded transition-colors ${
              filterOptionType === 'PE'
                ? 'bg-rose-500/25 text-rose-300 border border-rose-500/50 font-bold'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            Buy PE Puts ({putCount})
          </button>
          {filterOptionType !== 'all' && (
            <button
              onClick={() => setFilterOptionType('all')}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              Reset CE/PE
            </button>
          )}
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

            {/* REAL-TIME CE / PE OPTION TRADE RECOMMENDATION (TARGET, STRIKE, MARKET MOVE) */}
            {stock.optionSetup && (
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/50 space-y-3.5 shadow-md">
                {/* Header: Action Badge, Option Contract, and Expiry */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-400" />
                      Option Trade Recommendation (CE / PE)
                    </span>
                    <span className="text-[10px] font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {stock.optionSetup.expiryMonth}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded text-xs font-bold font-mono tracking-wide border shadow-sm ${
                      stock.optionSetup.type === 'CE'
                        ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/60'
                        : 'bg-rose-500/25 text-rose-300 border-rose-500/60'
                    }`}>
                      {stock.optionSetup.actionBadge}
                    </span>
                  </div>
                </div>

                {/* HIGH-VISIBILITY DIRECTION OF MARKET MOVE BANNER */}
                <div className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  stock.optionSetup.type === 'CE'
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {stock.optionSetup.type === 'CE' ? (
                      <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <div>
                      <div className="text-xs sm:text-sm font-bold tracking-tight">
                        {stock.optionSetup.type === 'CE'
                          ? `BULLISH MARKET MOVE: Coiling for Upside Breakout towards Target ₹${stock.optionSetup.underlyingTarget}`
                          : `BEARISH MARKET MOVE: Downside Breakdown Slide towards Target ₹${stock.optionSetup.underlyingTarget}`
                        }
                      </div>
                      <div className="text-[11px] opacity-90 font-mono mt-0.5">
                        Current Spot CMP: <strong>₹{stock.spotPrice.toFixed(2)}</strong> &rarr; Stock Target: <strong>₹{stock.optionSetup.underlyingTarget}</strong> (Stop Loss: ₹{stock.optionSetup.underlyingStopLoss})
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 font-mono text-xs">
                    <span className={`px-2.5 py-1 rounded font-bold border ${
                      stock.optionSetup.type === 'CE'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}>
                      {stock.optionSetup.type === 'CE' ? 'SUGGESTION: BUY CE (CALL)' : 'SUGGESTION: BUY PE (PUT)'}
                    </span>
                  </div>
                </div>

                {/* Option Pricing & Execution Corridor */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                    <div className="text-slate-400 text-[11px] font-medium">Recommended Contract</div>
                    <div className="text-sm font-bold font-mono text-white mt-1">
                      {stock.optionSetup.contractName}
                    </div>
                    <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
                      Strike Price: ₹{stock.optionSetup.strike}
                    </div>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                    <div className="text-slate-400 text-[11px] font-medium">Option Buy Entry (Premium)</div>
                    <div className="text-base font-bold font-mono text-amber-300 mt-1">
                      ₹{stock.optionSetup.entryPremium.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                      {stock.optionSetup.recommendedTiming}
                    </div>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                    <div className="text-slate-400 text-[11px] font-medium">Option Target Price (Premium)</div>
                    <div className="text-base font-bold font-mono text-emerald-400 mt-1">
                      ₹{stock.optionSetup.targetPremium.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-emerald-400 font-mono mt-0.5 font-bold">
                      +{(((stock.optionSetup.targetPremium - stock.optionSetup.entryPremium) / stock.optionSetup.entryPremium) * 100).toFixed(0)}% Profit Potential
                    </div>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                    <div className="text-slate-400 text-[11px] font-medium">Option Stop Loss (SL)</div>
                    <div className="text-base font-bold font-mono text-rose-400 mt-1">
                      ₹{stock.optionSetup.stopLossPremium.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-rose-400 font-mono mt-0.5">
                      Strict Risk: ₹{(stock.optionSetup.entryPremium - stock.optionSetup.stopLossPremium).toFixed(2)} / share
                    </div>
                  </div>
                </div>

                {/* BEST TIME TO BUY / HOLD / SELL STRATEGY BAR */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-300">Best Time to Buy: </strong>
                      <span className="text-slate-300">{stock.optionSetup.recommendedTiming}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-cyan-300">Holding Strategy: </strong>
                      <span className="text-slate-300">Hold position while spot sustains above ₹{stock.optionSetup.underlyingStopLoss}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300">Target Exit: </strong>
                      <span className="text-slate-300">Book profit when option reaches ₹{stock.optionSetup.targetPremium.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Plain-English Market Move Analysis & Drivers */}
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 text-[11px] flex items-start gap-2">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed text-slate-300">
                    <strong className="text-white">Why the Market is Moving: </strong>
                    {stock.optionSetup.marketMoveReason}
                    <span className="text-slate-400 ml-1.5 font-mono">
                      (Underlying Stock Target: <strong className="text-white">₹{stock.optionSetup.underlyingTarget}</strong> · Stop-Loss: <strong className="text-white">₹{stock.optionSetup.underlyingStopLoss}</strong>)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Price, Basis & Technical Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
                <div className="text-slate-400 text-[11px] flex items-center justify-between">
                  <span>Spot Price</span>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded">LIVE</span>
                </div>
                <div className="text-sm font-bold font-mono text-white mt-0.5 tabular-nums">
                  ₹{stock.spotPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`text-[10px] font-mono ${stock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
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
