import React from 'react';
import { Volume2, VolumeX, RefreshCw, Zap } from 'lucide-react';
import { NavTab } from '../types/index.ts';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unreadAlertsCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTriggerLiveAlert: () => void;
  lastUpdated: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  unreadAlertsCount,
  soundEnabled,
  onToggleSound,
  onTriggerLiveAlert,
  lastUpdated,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-white flex items-center gap-2 whitespace-nowrap">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              NIFTY 50 RADAR
            </span>
            <span className="hidden xl:inline text-xs text-slate-500 border-l border-slate-800 pl-2.5">
              NSE Rebalance &amp; F&amp;O
            </span>
          </div>

          {/* Zone 2: Clean, non-wrapping navigation links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-medium overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => onTabChange('upcoming')}
              className={`px-2.5 xl:px-3 py-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Inclusions (1M)
            </button>

            <button
              onClick={() => onTabChange('exclusions')}
              className={`px-2.5 xl:px-3 py-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'exclusions'
                  ? 'text-rose-400 font-semibold border-b-2 border-rose-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Exclusions Watchlist
            </button>

            <button
              onClick={() => onTabChange('fo_trends')}
              className={`px-2.5 xl:px-3 py-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'fo_trends'
                  ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>F&amp;O Live Trends &amp; Buy/Sell</span>
            </button>

            <button
              onClick={() => onTabChange('daily')}
              className={`px-2.5 xl:px-3 py-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'daily'
                  ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Daily Analysis
            </button>

            <button
              onClick={() => onTabChange('deleted')}
              className={`px-2.5 xl:px-3 py-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'deleted'
                  ? 'text-indigo-400 font-semibold border-b-2 border-indigo-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Deleted Archive
            </button>

            <button
              onClick={() => onTabChange('alerts')}
              className={`px-2.5 xl:px-3 py-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'alerts'
                  ? 'text-violet-400 font-semibold border-b-2 border-violet-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Official Alerts
              {unreadAlertsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
              )}
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute announcement audio alerts' : 'Enable audio alert chime'}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded border border-slate-800 transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            <button
              onClick={onTriggerLiveAlert}
              className="px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 font-sans shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Simulate</span> Circular
            </button>
          </div>
        </div>

        {/* Medium and Mobile Navigation Bar (Scrollable horizontally) */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-2 border-t border-slate-800/80 scrollbar-none text-xs">
          <button
            onClick={() => onTabChange('upcoming')}
            className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'upcoming' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium' : 'text-slate-400'
            }`}
          >
            Inclusions (1M)
          </button>
          <button
            onClick={() => onTabChange('exclusions')}
            className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'exclusions' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 font-medium' : 'text-slate-400'
            }`}
          >
            Exclusions Watchlist
          </button>
          <button
            onClick={() => onTabChange('fo_trends')}
            className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 ${
              activeTab === 'fo_trends' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 font-medium' : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>F&amp;O Buy/Sell</span>
          </button>
          <button
            onClick={() => onTabChange('daily')}
            className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'daily' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-medium' : 'text-slate-400'
            }`}
          >
            Daily Analysis
          </button>
          <button
            onClick={() => onTabChange('deleted')}
            className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'deleted' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-medium' : 'text-slate-400'
            }`}
          >
            Deleted Archive
          </button>
          <button
            onClick={() => onTabChange('alerts')}
            className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 ${
              activeTab === 'alerts' ? 'bg-violet-500/10 text-violet-400 border border-violet-500/30 font-medium' : 'text-slate-400'
            }`}
          >
            Alerts {unreadAlertsCount > 0 ? `(${unreadAlertsCount})` : ''}
          </button>
        </div>
      </div>
    </header>
  );
};
