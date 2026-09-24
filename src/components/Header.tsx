import React from 'react';
import { Bell, BellRing, Volume2, VolumeX, RefreshCw } from 'lucide-react';

interface HeaderProps {
  activeTab: 'upcoming' | 'exclusions' | 'deleted' | 'daily' | 'alerts';
  onTabChange: (tab: 'upcoming' | 'exclusions' | 'deleted' | 'daily' | 'alerts') => void;
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
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              NIFTY 50 REBALANCE RADAR
            </span>
            <span className="hidden lg:inline text-xs text-slate-500 border-l border-slate-800 pl-3">
              NSE India Inclusion & Deletion Intelligence
            </span>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs lg:text-sm font-medium">
            <button
              onClick={() => onTabChange('upcoming')}
              className={`px-3 py-1.5 transition-colors relative whitespace-nowrap ${
                activeTab === 'upcoming'
                  ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Upcoming Inclusions (1M)
            </button>

            <button
              onClick={() => onTabChange('exclusions')}
              className={`px-3 py-1.5 transition-colors relative whitespace-nowrap ${
                activeTab === 'exclusions'
                  ? 'text-rose-400 font-semibold border-b-2 border-rose-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Exclusions & Delistings
            </button>

            <button
              onClick={() => onTabChange('deleted')}
              className={`px-3 py-1.5 transition-colors relative whitespace-nowrap ${
                activeTab === 'deleted'
                  ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Deleted Archive
            </button>

            <button
              onClick={() => onTabChange('daily')}
              className={`px-3 py-1.5 transition-colors relative whitespace-nowrap ${
                activeTab === 'daily'
                  ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Daily Analysis
            </button>

            <button
              onClick={() => onTabChange('alerts')}
              className={`px-3 py-1.5 transition-colors relative whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'alerts'
                  ? 'text-indigo-400 font-semibold border-b-2 border-indigo-400'
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
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute announcement audio alerts' : 'Enable audio alert chime'}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded border border-slate-800 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            <button
              onClick={onTriggerLiveAlert}
              className="px-3 py-1.5 text-xs font-medium text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 font-sans shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Simulate</span> Circular Alert
            </button>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="flex md:hidden overflow-x-auto py-2.5 gap-2 border-t border-slate-800/80 scrollbar-none text-xs">
          <button
            onClick={() => onTabChange('upcoming')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'upcoming' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400'
            }`}
          >
            Inclusions (1M)
          </button>
          <button
            onClick={() => onTabChange('exclusions')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'exclusions' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'text-slate-400'
            }`}
          >
            Exclusions (15D/1M/2M)
          </button>
          <button
            onClick={() => onTabChange('deleted')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'deleted' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'text-slate-400'
            }`}
          >
            Deleted Archive
          </button>
          <button
            onClick={() => onTabChange('daily')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'daily' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-400'
            }`}
          >
            Daily Analysis
          </button>
          <button
            onClick={() => onTabChange('alerts')}
            className={`px-2.5 py-1 rounded whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'alerts' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' : 'text-slate-400'
            }`}
          >
            Alerts {unreadAlertsCount > 0 ? `(${unreadAlertsCount})` : ''}
          </button>
        </div>
      </div>
    </header>
  );
};
