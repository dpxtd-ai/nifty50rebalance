import React from 'react';
import { DeletedStockArchive } from '../types/index.ts';
import { FileText, ArrowRight, CheckCircle2 } from 'lucide-react';

interface DeletedArchiveProps {
  stocks: DeletedStockArchive[];
}

export const DeletedArchive: React.FC<DeletedArchiveProps> = ({ stocks }) => {
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs text-amber-400 font-medium tracking-wide uppercase">
          <span>HISTORICAL &amp; EXECUTED ACTIONS</span>
          <span aria-hidden="true">·</span>
          <span>NIFTY 50 DELETIONS ARCHIVE</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
          Stocks Deleted from Nifty 50
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Constituents officially dropped from the Nifty 50 index along with replacement constituents, exit weights, passive fund outflows, and NSE circular filings.
        </p>
      </div>

      {/* Archive Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-lg bg-slate-900/50">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
              <th className="py-3 px-4">Deleted Stock</th>
              <th className="py-3 px-4">Sector</th>
              <th className="py-3 px-4">Effective Date</th>
              <th className="py-3 px-4">Replacement Stock</th>
              <th className="py-3 px-4 text-right">Exit Weight</th>
              <th className="py-3 px-4 text-right">Passive Outflow</th>
              <th className="py-3 px-4">Reason / Type</th>
              <th className="py-3 px-4">Circular Ref</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {stocks.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-rose-300">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>{item.symbol}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans font-normal">{item.name}</div>
                </td>
                <td className="py-3.5 px-4 text-slate-300">
                  {item.sector}
                </td>
                <td className="py-3.5 px-4 text-slate-300 font-mono">
                  {item.deletedDate}
                </td>
                <td className="py-3.5 px-4 font-mono font-semibold text-emerald-400">
                  <div className="flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <span>{item.replacementSymbol}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans font-normal">{item.replacementName}</div>
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-slate-200 tabular-nums">
                  {item.exitWeightPercent}%
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-rose-400 font-semibold tabular-nums">
                  -₹{item.totalOutflowCr.toLocaleString('en-IN')} Cr
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-slate-300 bg-slate-800/70 border border-slate-700/60 px-2 py-0.5 rounded text-[11px]">
                    {item.deletionType}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-slate-500" />
                    <span>{item.circularRef}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-lg text-xs text-slate-400">
        <span className="text-slate-300 font-medium">Rebalancing Mechanism: </span>
        When an existing constituent is deleted, all passive index tracking funds (ETFs and Index Mutual Funds) execute synchronous block or closing-auction trades on the rebalance effective date to liquidate the outgoing stock and deploy proceeds into the replacement constituent.
      </div>
    </div>
  );
};
