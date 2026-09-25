import React from 'react';
import { useLiveMarket } from '../context/LiveMarketContext.tsx';
import { ArrowUpRight, ArrowDownRight, Radio } from 'lucide-react';

interface MetricOverviewProps {
  onSelectStock: (symbol: string) => void;
}

export const MetricOverview: React.FC<MetricOverviewProps> = ({ onSelectStock }) => {
  const { computeDynamicSnapshot, isLiveConnected } = useLiveMarket();
  const snapshot = computeDynamicSnapshot();

  const isNiftyUp = snapshot.nifty50DailyChangePercent >= 0;

  return (
    <div className="space-y-2 my-5">
      {/* Real-time sync ticker sub-bar */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 font-semibold uppercase tracking-wider">
            NSE / BSE LIVE EXCHANGE DATA FEED
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">INDEXNSE: NIFTY_50</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>Real-Time Dynamic Recalculation Active</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Metric 1: Nifty 50 Benchmark */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-3 sm:p-4 hover:border-slate-700 transition-colors">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span className="font-semibold text-slate-300">NIFTY 50 INDEX</span>
            <span
              className={`font-mono text-[11px] flex items-center font-bold ${
                isNiftyUp ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isNiftyUp ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {isNiftyUp ? '+' : ''}
              {snapshot.nifty50DailyChangePercent.toFixed(2)}%
            </span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-white mt-1.5 tabular-nums">
            {snapshot.nifty50IndexValue.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>NSE Live Settlement Baseline</span>
          </div>
        </div>

        {/* Metric 2: Free Float Cut-off Line */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-3 sm:p-4 hover:border-slate-700 transition-colors">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span className="font-semibold text-slate-300">#50 RANK CUTOFF</span>
            <span className="text-amber-400 text-[11px] font-mono font-bold">Floor</span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-amber-300 mt-1.5 tabular-nums">
            ₹{snapshot.cutoffRank50FreeFloatCr.toLocaleString('en-IN')} Cr
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Lowest Constituent (INDUSINDBK)
          </div>
        </div>

        {/* Metric 3: 1.5x Inclusion Hurdle */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-3 sm:p-4 hover:border-slate-700 transition-colors">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span className="font-semibold text-slate-300">1.5X ENTRY HURDLE</span>
            <span className="text-emerald-400 text-[11px] font-mono font-bold">Target</span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-emerald-300 mt-1.5 tabular-nums">
            ₹{snapshot.minimumInclusionThresholdCr.toLocaleString('en-IN')} Cr
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Mandatory NSE Selection Rule
          </div>
        </div>

        {/* Metric 4: Top Alpha Contender */}
        <div
          onClick={() => onSelectStock(snapshot.highestAlphaStock)}
          className="bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 rounded-lg p-3 sm:p-4 cursor-pointer transition-colors group"
        >
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span className="font-semibold text-slate-300 group-hover:text-emerald-300 transition-colors">
              TOP ALPHA CANDIDATE
            </span>
            <span className="text-emerald-400 text-[11px] font-mono font-bold">+44.8% α</span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-white mt-1.5 flex items-center justify-between">
            <span className="group-hover:text-emerald-300 transition-colors">
              {snapshot.highestAlphaStock}
            </span>
            <span className="text-[11px] font-sans font-medium text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded">
              93% Prob
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Highest excess return vs Nifty 50
          </div>
        </div>

        {/* Metric 5: 15-Day Imminent Deletion Risk */}
        <div
          onClick={() => onSelectStock(snapshot.immediate15DayExclusionCandidate)}
          className="bg-slate-900/70 border border-slate-800 hover:border-rose-500/50 rounded-lg p-3 sm:p-4 cursor-pointer transition-colors group"
        >
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span className="font-semibold text-slate-300 group-hover:text-rose-300 transition-colors">
              15-DAY DELETION RISK
            </span>
            <span className="text-rose-400 text-[11px] font-mono font-bold">-18.2% α</span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-rose-300 mt-1.5 flex items-center justify-between">
            <span className="group-hover:text-rose-200 transition-colors">
              {snapshot.immediate15DayExclusionCandidate}
            </span>
            <span className="text-[11px] font-sans font-medium text-rose-300 bg-rose-500/15 border border-rose-500/30 px-1.5 py-0.5 rounded">
              Rank #50
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Breached retention threshold
          </div>
        </div>

        {/* Metric 6: Net Passive Rebalance Impact */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-3 sm:p-4 hover:border-slate-700 transition-colors">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span className="font-semibold text-slate-300">PROJECTED NET FLOW</span>
            <span className="text-cyan-400 text-[11px] font-mono font-bold">₹ Cr</span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-cyan-300 mt-1.5 tabular-nums">
            +₹{(snapshot.totalProjectedInflowCr - snapshot.totalProjectedOutflowCr).toLocaleString('en-IN')} Cr
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>In: ₹{snapshot.totalProjectedInflowCr} Cr</span>
            <span>Out: ₹{snapshot.totalProjectedOutflowCr} Cr</span>
          </div>
        </div>
      </div>
    </div>
  );
};
