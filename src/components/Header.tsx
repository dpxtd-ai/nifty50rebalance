import React from 'react';
import { Volume2, VolumeX, RefreshCw, Zap, Briefcase, Radio, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { NavTab } from '../types/index.ts';
import { useLiveMarket } from '../context/LiveMarketContext.tsx';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unreadAlertsCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTriggerLiveAlert: () => void;
  lastUpdated: string;
  portfolioCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  unreadAlertsCount,
  soundEnabled,
  onToggleSound,
  onTriggerLiveAlert,
  portfolioCount,
}) => {
  const { indices, lastSyncedTime, refreshMarketData, isLiveConnected } = useLiveMarket();
  const [isRefreshingMarket, setIsRefreshingMarket] = React.useState<boolean>(false);

  const handleManualRefresh = async () => {
    setIsRefreshingMarket(true);
    try {
      await refreshMarketData();
    } finally {
      setTimeout(() => setIsRefreshingMarket(false), 600);
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2 whitespace-nowrap">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              NIFTY 50 RADAR
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 text-xs xl:text-sm font-medium">
            <button
              onClick={() => onTabChange('upcoming')}
              className={`px-2.5 py-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Inclusions
            </button>

            <button
              onClick={() => onTabChange('exclusions')}
              className={`px-2.5 py-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'exclusions'
                  ? 'text-rose-400 font-semibold border-b-2 border-rose-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Exclusions
            </button>

            <button
              onClick={() => onTabChange('fo_trends')}
              className={`px-2.5 py-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'fo_trends'
                  ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>F&amp;O Signals</span>
            </button>

            {/* Portfolio Advisor Tab */}
            <button
              onClick={() => onTabChange('portfolio')}
              className={`px-2.5 py-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'portfolio'
                  ? 'text-emerald-300 font-semibold border-b-2 border-emerald-400'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              <span>Portfolio Advisor</span>
              {portfolioCount > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {portfolioCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('daily')}
              className={`px-2.5 py-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'daily'
                  ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Daily Run
            </button>

            <button
              onClick={() => onTabChange('deleted')}
              className={`px-2.5 py-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'deleted'
                  ? 'text-indigo-400 font-semibold border-b-2 border-indigo-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Archive
            </button>

            <button
              onClick={() => onTabChange('alerts')}
              className={`px-2.5 py-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'alerts'
                  ? 'text-violet-400 font-semibold border-b-2 border-violet-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Alerts</span>
              {unreadAlertsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
              )}
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshingMarket}
              title="Refresh live real-time market data across all stocks, indices, F&O and portfolio"
              className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 font-sans shadow-sm cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingMarket ? 'animate-spin' : ''}`} />
              <span>{isRefreshingMarket ? 'Updating...' : 'Refresh Market Data'}</span>
            </button>

            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute announcement audio alerts' : 'Enable audio alert chime'}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded border border-slate-800 transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            <button
              onClick={onTriggerLiveAlert}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 font-sans cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate</span>
            </button>
          </div>
        </div>

        {/* Real-Time Live Index Ticker Bar */}
        <div className="py-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono overflow-x-auto scrollbar-none gap-4">
          <div className="flex items-center gap-4 shrink-0">
            {/* Nifty 50 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold">NIFTY 50</span>
              <span className="text-white font-bold tabular-nums">
                {indices.nifty50.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`flex items-center text-[10px] font-bold ${indices.nifty50.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {indices.nifty50.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {indices.nifty50.change >= 0 ? '+' : ''}{indices.nifty50.change.toFixed(2)}%
              </span>
            </div>

            <span className="text-slate-700">|</span>

            {/* SENSEX */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold">SENSEX</span>
              <span className="text-white font-bold tabular-nums">
                {indices.sensex.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`flex items-center text-[10px] font-bold ${indices.sensex.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {indices.sensex.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {indices.sensex.change >= 0 ? '+' : ''}{indices.sensex.change.toFixed(2)}%
              </span>
            </div>

            <span className="text-slate-700">|</span>

            {/* NIFTY BANK */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold">NIFTY BANK</span>
              <span className="text-white font-bold tabular-nums">
                {indices.niftyBank.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`flex items-center text-[10px] font-bold ${indices.niftyBank.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {indices.niftyBank.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {indices.niftyBank.change >= 0 ? '+' : ''}{indices.niftyBank.change.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-auto">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 font-medium">LIVE EXCHANGE FEED</span>
            </div>
            <span className="text-slate-500">Synced: {lastSyncedTime}</span>
            <button
              onClick={handleManualRefresh}
              title="Refresh live market quotes"
              disabled={isRefreshingMarket}
              className="text-slate-400 hover:text-emerald-300 p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingMarket ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-2 border-t border-slate-800/80 scrollbar-none text-xs">
          <button
            onClick={() => onTabChange('upcoming')}
            className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'upcoming' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium' : 'text-slate-400'
            }`}
          >
            Inclusions
          </button>
          <button
            onClick={() => onTabChange('exclusions')}
            className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'exclusions' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 font-medium' : 'text-slate-400'
            }`}
          >
            Exclusions
          </button>
          <button
            onClick={() => onTabChange('fo_trends')}
            className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 ${
              activeTab === 'fo_trends' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 font-medium' : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>F&amp;O Signals</span>
          </button>
          <button
            onClick={() => onTabChange('portfolio')}
            className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 ${
              activeTab === 'portfolio' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 font-medium' : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <Briefcase className="w-3 h-3 text-emerald-400" />
            <span>Portfolio Advisor {portfolioCount > 0 ? `(${portfolioCount})` : ''}</span>
          </button>
          <button
            onClick={() => onTabChange('daily')}
            className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'daily' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-medium' : 'text-slate-400'
            }`}
          >
            Daily Run
          </button>
          <button
            onClick={() => onTabChange('deleted')}
            className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'deleted' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-medium' : 'text-slate-400'
            }`}
          >
            Archive
          </button>
          <button
            onClick={() => onTabChange('alerts')}
            className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 ${
              activeTab === 'alerts' ? 'bg-violet-500/10 text-violet-400 border border-violet-500/30 font-medium' : 'text-slate-400'
            }`}
          >
            <span>Alerts</span>
            {unreadAlertsCount > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
