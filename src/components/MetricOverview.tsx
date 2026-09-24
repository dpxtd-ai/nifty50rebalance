import React from 'react';
import { DAILY_SNAPSHOT } from '../data/nifty50Data.ts';
import { TrendingUp, TrendingDown, Clock, ShieldAlert, ArrowUpRight, Layers } from 'lucide-react';

interface MetricOverviewProps {
  onSelectStock: (symbol: string) => void;
}

export const MetricOverview: React.FC<MetricOverviewProps> = ({ onSelectStock }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 my-6">
      {/* Metric 1: Nifty 50 Benchmark */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 sm:p-4">
        <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
          <span>NIFTY 50 INDEX</span>
          <span className="text-emerald-400 font-mono text-[11px] flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +{DAILY_SNAPSHOT.nifty50DailyChangePercent}%
          </span>
        </div>
        <div className="text-lg sm:text-xl font-bold font-mono text-white mt-1.5 tabular-nums">
          {DAILY_SNAPSHOT.nifty50IndexValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          NSE Live Settlement Baseline
        </div>
      </div>

      {/* Metric 2: Free Float Cut-off Line */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 sm:p-4">
        <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
          <span>#50 RANK CUTOFF</span>
          <span className="text-amber-400 text-[11px] font-mono">Floor</span>
        </div>
        <div className="text-lg sm:text-xl font-bold font-mono text-amber-300 mt-1.5 tabular-nums">
          ₹{DAILY_SNAPSHOT.cutoffRank50FreeFloatCr.toLocaleString('en-IN')} Cr
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          Lowest Constituent (INDUSINDBK)
        </div>
      </div>

      {/* Metric 3: 1.5x Inclusion Hurdle */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 sm:p-4">
        <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
          <span>1.5X ENTRY HURDLE</span>
          <span className="text-emerald-400 text-[11px] font-mono">Target</span>
        </div>
        <div className="text-lg sm:text-xl font-bold font-mono text-emerald-300 mt-1.5 tabular-nums">
          ₹{DAILY_SNAPSHOT.minimumInclusionThresholdCr.toLocaleString('en-IN')} Cr
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          Mandatory NSE Selection Rule
        </div>
      </div>

      {/* Metric 4: Top Alpha Contender */}
      <div
        onClick={() => onSelectStock(DAILY_SNAPSHOT.highestAlphaStock)}
        className="bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 rounded-lg p-3 sm:p-4 cursor-pointer transition-colors"
      >
        <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
          <span>TOP ALPHA CANDIDATE</span>
          <span className="text-emerald-400 text-[11px] font-mono font-semibold">+44.8% α</span>
        </div>
        <div className="text-lg sm:text-xl font-bold font-mono text-white mt-1.5 flex items-center justify-between">
          <span>{DAILY_SNAPSHOT.highestAlphaStock}</span>
          <span className="text-[11px] font-sans font-medium text-emerald-400/90 bg-emerald-500/10 px-1.5 py-0.5 rounded">
            93% Prob
          </span>
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          Highest excess return vs Nifty 50
        </div>
      </div>

      {/* Metric 5: 15-Day Imminent Deletion Risk */}
      <div
        onClick={() => onSelectStock(DAILY_SNAPSHOT.immediate15DayExclusionCandidate)}
        className="bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 rounded-lg p-3 sm:p-4 cursor-pointer transition-colors"
      >
        <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
          <span>15-DAY DELETION RISK</span>
          <span className="text-rose-400 text-[11px] font-mono font-semibold">-18.2% α</span>
        </div>
        <div className="text-lg sm:text-xl font-bold font-mono text-rose-300 mt-1.5 flex items-center justify-between">
          <span>{DAILY_SNAPSHOT.immediate15DayExclusionCandidate}</span>
          <span className="text-[11px] font-sans font-medium text-rose-400/90 bg-rose-500/10 px-1.5 py-0.5 rounded">
            Rank #50
          </span>
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          Breached retention threshold
        </div>
      </div>

      {/* Metric 6: Net Passive Rebalance Impact */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 sm:p-4">
        <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
          <span>PROJECTED NET FLOW</span>
          <span className="text-cyan-400 text-[11px] font-mono">₹ Cr</span>
        </div>
        <div className="text-lg sm:text-xl font-bold font-mono text-cyan-300 mt-1.5 tabular-nums">
          +₹{(DAILY_SNAPSHOT.totalProjectedInflowCr - DAILY_SNAPSHOT.totalProjectedOutflowCr).toLocaleString('en-IN')} Cr
        </div>
        <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
          <span>In: ₹{DAILY_SNAPSHOT.totalProjectedInflowCr} Cr</span>
          <span>Out: ₹{DAILY_SNAPSHOT.totalProjectedOutflowCr} Cr</span>
        </div>
      </div>
    </div>
  );
};
