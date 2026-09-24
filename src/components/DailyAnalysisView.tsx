import React, { useState } from 'react';
import { DAILY_ANALYSIS_HISTORY, DAILY_SNAPSHOT, UPCOMING_INCLUSIONS, EXCLUSIONS_WATCHLIST } from '../data/nifty50Data.ts';
import { Calendar, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, RefreshCw, CheckCircle2 } from 'lucide-react';

interface DailyAnalysisViewProps {
  onSelectStock: (symbol: string) => void;
}

export const DailyAnalysisView: React.FC<DailyAnalysisViewProps> = ({ onSelectStock }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [lastCalculatedTime, setLastCalculatedTime] = useState<string>('09:18 IST (Daily Scheduled Run)');

  const handleRecalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastCalculatedTime(`${timeString} IST (Intraday Live Recalculation)`);
    }, 600);
  };

  const currentRun = DAILY_ANALYSIS_HISTORY[selectedDayIndex];

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-medium tracking-wide uppercase">
            <span>DAILY REBALANCING RUN &amp; QUANT MOMENTUM</span>
            <span aria-hidden="true">·</span>
            <span>DAY-OVER-DAY ALPHA TRACKING</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Daily Rebalance Analysis
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Continuous daily tracking of 6-month average free float market capitalization, daily alpha shifts, and cut-off line gap evolution.
          </p>
        </div>

        {/* Daily Run Action & Timestamp */}
        <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
          <button
            onClick={handleRecalculate}
            disabled={isCalculating}
            className="px-3.5 py-2 text-xs font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors flex items-center gap-2 font-sans cursor-pointer disabled:opacity-50 shadow-sm shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCalculating ? 'animate-spin' : ''}`} />
            <span>Recalculate Intraday Run</span>
          </button>
        </div>
      </div>

      {/* Date Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-medium whitespace-nowrap mr-1 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Historical Daily Runs:</span>
        </span>
        {DAILY_ANALYSIS_HISTORY.map((run, index) => (
          <button
            key={run.date}
            onClick={() => setSelectedDayIndex(index)}
            className={`px-3 py-1.5 rounded font-mono transition-colors whitespace-nowrap cursor-pointer ${
              selectedDayIndex === index
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {run.date} {index === 0 ? '(Today)' : ''}
          </button>
        ))}
      </div>

      {/* Daily Comparison Matrix: Top Entrant vs Endangered Exit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Upcoming Candidate Daily Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[11px] text-emerald-400 font-medium uppercase tracking-wide">
                Day's Leading Inclusion Candidate
              </span>
              <div
                onClick={() => onSelectStock(currentRun.topCandidate)}
                className="text-xl font-bold font-mono text-white mt-1 hover:text-emerald-300 cursor-pointer flex items-center gap-2"
              >
                <span>{currentRun.topCandidate}</span>
                <span className="text-xs font-sans text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-normal">
                  Rank #{currentRun.candidateRank}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-400">Excess Alpha (1Y)</div>
              <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                +{currentRun.candidateAlpha}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
            <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
              <div className="text-slate-400">Free Float Gap Over #50 Floor</div>
              <div className="text-base font-bold font-mono text-emerald-300 mt-1 tabular-nums">
                +₹{currentRun.candidateMcapGapCr.toLocaleString('en-IN')} Cr
              </div>
              <div className="text-[10px] text-emerald-400/80 mt-0.5">Surpasses 1.5x rule by 18%</div>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
              <div className="text-slate-400">Passive Flow to ADV Ratio</div>
              <div className="text-base font-bold font-mono text-white mt-1 tabular-nums">
                {currentRun.projectedTurnoverRatio} Days
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Liquidity absorbency rating: High</div>
            </div>
          </div>
        </div>

        {/* Top Endangered Constituent Daily Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[11px] text-rose-400 font-medium uppercase tracking-wide">
                Day's Highest Deletion Risk
              </span>
              <div
                onClick={() => onSelectStock(currentRun.dangerStock)}
                className="text-xl font-bold font-mono text-rose-300 mt-1 hover:text-rose-200 cursor-pointer flex items-center gap-2"
              >
                <span>{currentRun.dangerStock}</span>
                <span className="text-xs font-sans text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded font-normal">
                  Rank #{currentRun.dangerRank} (Lowest)
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-400">Benchmark Drag</div>
              <div className="text-xl font-bold font-mono text-rose-400 tabular-nums">
                {currentRun.dangerAlpha}% α
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
            <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
              <div className="text-slate-400">Deficit to Retention Threshold</div>
              <div className="text-base font-bold font-mono text-rose-400 mt-1 tabular-nums">
                ₹{currentRun.dangerCutoffDeficitCr.toLocaleString('en-IN')} Cr
              </div>
              <div className="text-[10px] text-rose-400/80 mt-0.5">Severe structural gap</div>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
              <div className="text-slate-400">Institutional Action Status</div>
              <div className="text-base font-bold font-mono text-amber-300 mt-1">
                De-weighting
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Passive exit window: 15 Days</div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Free-Float Gap Spectrum (Visual Bar) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-white">
          Free-Float Capitalization vs 1.5x Inclusion Hurdle (₹57,675 Cr)
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">
          Visualizing candidate headroom above the Nifty 50 entry line and constituent deficits below the retention buffer.
        </p>

        <div className="space-y-3 text-xs font-mono">
          {/* Top Upcoming Candidates */}
          {UPCOMING_INCLUSIONS.slice(0, 3).map((stock) => (
            <div key={stock.symbol} className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {stock.symbol} (Contender)
                </span>
                <span className="text-white tabular-nums">
                  ₹{stock.metrics.freeFloatMCapCr.toLocaleString('en-IN')} Cr (+{((stock.metrics.freeFloatMCapCr / DAILY_SNAPSHOT.minimumInclusionThresholdCr - 1) * 100).toFixed(1)}% above hurdle)
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: `${Math.min(100, (stock.metrics.freeFloatMCapCr / 200000) * 100)}%` }}
                />
              </div>
            </div>
          ))}

          {/* Hurdle Marker Line */}
          <div className="pt-2 pb-1 flex items-center gap-2 text-amber-400 font-sans text-xs">
            <span className="w-full h-px bg-amber-500/40" />
            <span className="whitespace-nowrap font-mono text-[11px]">
              --- 1.5X ENTRY HURDLE: ₹57,675 Cr ---
            </span>
            <span className="w-full h-px bg-amber-500/40" />
          </div>

          {/* Endangered Constituents */}
          {EXCLUSIONS_WATCHLIST.slice(0, 2).map((stock) => (
            <div key={stock.symbol} className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span className="font-bold text-rose-400 flex items-center gap-1.5">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  {stock.symbol} (Constituent #{stock.currentNifty50Rank})
                </span>
                <span className="text-rose-400 tabular-nums">
                  ₹{stock.freeFloatMCapCr.toLocaleString('en-IN')} Cr (₹{Math.abs(stock.gapToReplacementCutoffCr).toLocaleString('en-IN')} Cr below hurdle)
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-rose-500 h-full rounded-full"
                  style={{ width: `${(stock.freeFloatMCapCr / 200000) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
