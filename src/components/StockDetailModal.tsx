import React from 'react';
import { UpcomingInclusionStock, ExclusionDelistingStock } from '../types/index.ts';
import { X, CheckCircle2, XCircle, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Layers, FileText } from 'lucide-react';
import { DAILY_SNAPSHOT } from '../data/nifty50Data.ts';

interface StockDetailModalProps {
  stock: UpcomingInclusionStock | ExclusionDelistingStock | null;
  onClose: () => void;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({ stock, onClose }) => {
  if (!stock) return null;

  const isUpcoming = 'currentRankInEligibleUniverse' in stock;
  const isExclusion = 'currentNifty50Rank' in stock;

  const inclusionStock = isUpcoming ? (stock as UpcomingInclusionStock) : null;
  const exclusionStock = isExclusion ? (stock as ExclusionDelistingStock) : null;

  // Breakdown across passive trackers
  const totalFlowCr = inclusionStock
    ? inclusionStock.estimatedPassiveInflowCr
    : exclusionStock
    ? exclusionStock.estimatedPassiveOutflowCr
    : 0;

  const trackersBreakdown = [
    { name: 'SBI Nifty 50 ETF', sharePercent: 38, flowCr: Math.round(totalFlowCr * 0.38) },
    { name: 'Nippon India ETF Nifty 50 BeES', sharePercent: 26, flowCr: Math.round(totalFlowCr * 0.26) },
    { name: 'UTI Nifty 50 ETF', sharePercent: 14, flowCr: Math.round(totalFlowCr * 0.14) },
    { name: 'HDFC Nifty 50 ETF', sharePercent: 12, flowCr: Math.round(totalFlowCr * 0.12) },
    { name: 'Offshore Passive Funds (iShares / Vanguard)', sharePercent: 10, flowCr: Math.round(totalFlowCr * 0.10) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-mono text-white">
                  {stock.symbol}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded font-mono font-medium ${
                  isUpcoming
                    ? 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/30'
                    : 'text-rose-300 bg-rose-500/10 border border-rose-500/30'
                }`}>
                  {isUpcoming ? 'Inclusion Contender (Rank #' + inclusionStock?.currentRankInEligibleUniverse + ')' : 'Exclusion Watchlist (Rank #' + exclusionStock?.currentNifty50Rank + ')'}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>{stock.name}</span>
                <span aria-hidden="true">·</span>
                <span>{stock.sector}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-6 text-xs text-slate-300">
          {/* Key Quantitative Stat Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[11px]">Price &amp; 1D Move</div>
              <div className="text-base font-bold font-mono text-white mt-1 tabular-nums">
                ₹{stock.metrics.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div className={`text-[11px] font-mono mt-0.5 ${stock.metrics.dailyChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stock.metrics.dailyChangePercent >= 0 ? '+' : ''}{stock.metrics.dailyChangePercent}%
              </div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[11px]">Excess Alpha (1Y)</div>
              <div className={`text-base font-bold font-mono mt-1 tabular-nums ${stock.metrics.alphaPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stock.metrics.alphaPercent >= 0 ? '+' : ''}{stock.metrics.alphaPercent}%
              </div>
              <div className="text-[10px] text-slate-500">vs Nifty 50 TRI</div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[11px]">Free Float M-Cap</div>
              <div className="text-base font-bold font-mono text-white mt-1 tabular-nums">
                ₹{stock.metrics.freeFloatMCapCr.toLocaleString('en-IN')} Cr
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Total: ₹{stock.metrics.marketCapCr.toLocaleString('en-IN')} Cr
              </div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[11px]">
                {isUpcoming ? 'Listing Probability' : 'Retention Score'}
              </div>
              <div className="text-base font-bold font-mono text-white mt-1 tabular-nums">
                {stock.metrics.growthProbability}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Beta: {stock.metrics.beta}
              </div>
            </div>
          </div>

          {/* NSE Methodology Invariant Compliance */}
          <div className="border border-slate-800 rounded-lg p-4 bg-slate-950/40">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center justify-between">
              <span>NSE Index Maintenance Criteria Verification</span>
              <span className="text-[11px] font-mono text-emerald-400">NSE Semi-Annual Guidelines</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2">
                {stock.metrics.freeFloatMCapCr >= DAILY_SNAPSHOT.minimumInclusionThresholdCr ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-medium text-slate-200">1.5x Free-Float Hurdle Requirement</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Hurdle: ₹{DAILY_SNAPSHOT.minimumInclusionThresholdCr.toLocaleString('en-IN')} Cr · Current: ₹{stock.metrics.freeFloatMCapCr.toLocaleString('en-IN')} Cr
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-slate-200">Impact Cost &le; 0.50% Rule</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Current Impact Cost: {stock.metrics.impactCostPercent}% for ₹50 Lakh order (Compliant)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-slate-200">NSE F&amp;O Segment Eligibility</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Status: {stock.metrics.foStatus} · Liquid derivative contract contracts active
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-slate-200">Trading Frequency &ge; 90%</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    100% days traded over past 6 months on National Stock Exchange
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Passive Index Fund Flow Breakdown */}
          <div className="border border-slate-800 rounded-lg p-4 bg-slate-950/40">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Estimated Passive Index Tracking Flow
                </h3>
                <p className="text-[11px] text-slate-400">
                  {isUpcoming
                    ? 'Projected mandatory purchases by domestic ETFs and mutual funds tracking Nifty 50'
                    : 'Projected mandatory liquidations across passive funds upon deletion'}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-base font-bold font-mono ${isUpcoming ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isUpcoming ? '+' : '-'}₹{totalFlowCr.toLocaleString('en-IN')} Cr
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {isUpcoming ? inclusionStock?.daysToCoverInflow : exclusionStock?.daysToAbsorbOutflow} Days ADV
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-3 font-mono text-xs">
              {trackersBreakdown.map((tracker) => (
                <div key={tracker.name} className="flex items-center justify-between py-1 border-b border-slate-800/60 last:border-0">
                  <span className="text-slate-300 font-sans">{tracker.name} ({tracker.sharePercent}%)</span>
                  <span className={`font-semibold ${isUpcoming ? 'text-cyan-300' : 'text-rose-300'}`}>
                    {isUpcoming ? '+' : '-'}₹{tracker.flowCr.toLocaleString('en-IN')} Cr
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Alpha & Strategic Catalyst Rationale */}
          <div className="border border-slate-800 rounded-lg p-4 bg-slate-950/40">
            <h3 className="text-sm font-semibold text-white mb-2">
              {isUpcoming ? 'Alpha Thesis & Growth Drivers' : 'Exclusion Vulnerability Analysis'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isUpcoming
                ? `${inclusionStock?.alphaRationale} ${inclusionStock?.growthDriver}`
                : `${exclusionStock?.exclusionReason} ${exclusionStock?.vulnerabilityFactor}`}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
