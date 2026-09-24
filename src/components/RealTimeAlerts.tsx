import React, { useState } from 'react';
import { RebalanceAlert } from '../types/index.ts';
import { Bell, BellRing, FileText, CheckCircle2, AlertTriangle, Clock, RefreshCw, Volume2, ArrowRight } from 'lucide-react';

interface RealTimeAlertsProps {
  alerts: RebalanceAlert[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onTriggerSimulatedAlert: () => void;
  onSelectStock: (symbol: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const RealTimeAlerts: React.FC<RealTimeAlertsProps> = ({
  alerts,
  onMarkAsRead,
  onMarkAllAsRead,
  onTriggerSimulatedAlert,
  onSelectStock,
  soundEnabled,
  onToggleSound
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [notificationPermission, setNotificationPermission] = useState<string>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const requestNotification = async () => {
    if (typeof Notification !== 'undefined') {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filterCategory === 'all') return true;
    return alert.category === filterCategory;
  });

  const getBadgeStyle = (category: string) => {
    switch (category) {
      case 'official_circular':
        return 'text-emerald-400 border border-emerald-500/40 bg-emerald-500/10';
      case 'critical_cutoff':
        return 'text-rose-400 border border-rose-500/40 bg-rose-500/10';
      case 'advance_notice':
        return 'text-indigo-400 border border-indigo-500/40 bg-indigo-500/10';
      default:
        return 'text-cyan-400 border border-cyan-500/40 bg-cyan-500/10';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'official_circular':
        return 'Official Circular';
      case 'critical_cutoff':
        return 'Critical Cut-Off Alert';
      case 'advance_notice':
        return 'Advance Notice';
      case 'high_probability':
        return 'Quant Model Alert';
      default:
        return 'Index Notice';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium tracking-wide uppercase">
            <span>REAL-TIME ANNOUNCEMENT DISPATCH</span>
            <span aria-hidden="true">·</span>
            <span>NATIONAL STOCK EXCHANGE OF INDIA</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <span>Official Index Rebalancing Alerts</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-time feed of official NSE Indices Ltd circulars, Index Maintenance Sub-Committee filings, and critical cut-off warnings.
          </p>
        </div>

        {/* Top Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {notificationPermission !== 'granted' && typeof Notification !== 'undefined' && (
            <button
              onClick={requestNotification}
              className="px-3 py-1.5 text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded transition-colors"
            >
              Enable Browser Alerts
            </button>
          )}

          <button
            onClick={onMarkAllAsRead}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded transition-colors"
          >
            Mark All Read
          </button>

          <button
            onClick={onTriggerSimulatedAlert}
            className="px-3 py-1.5 text-xs font-medium text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors flex items-center gap-1.5 font-sans"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate Live Announcement</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
            filterCategory === 'all'
              ? 'bg-slate-800 text-white font-medium border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Announcements ({alerts.length})
        </button>

        <button
          onClick={() => setFilterCategory('official_circular')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
            filterCategory === 'official_circular'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium'
              : 'text-slate-400 hover:text-emerald-300'
          }`}
        >
          Official Circulars
        </button>

        <button
          onClick={() => setFilterCategory('critical_cutoff')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
            filterCategory === 'critical_cutoff'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-medium'
              : 'text-slate-400 hover:text-rose-300'
          }`}
        >
          Critical Cut-Off Alerts
        </button>

        <button
          onClick={() => setFilterCategory('advance_notice')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
            filterCategory === 'advance_notice'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-medium'
              : 'text-slate-400 hover:text-indigo-300'
          }`}
        >
          Advance Notices
        </button>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => onMarkAsRead(alert.id)}
            className={`border rounded-lg p-4 sm:p-5 transition-all ${
              !alert.read
                ? 'bg-slate-900/90 border-indigo-500/50 shadow-sm'
                : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${getBadgeStyle(alert.category)}`}>
                  {getCategoryLabel(alert.category)}
                </span>
                <span className="font-mono text-xs text-slate-400 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  {alert.circularNumber}
                </span>
                {!alert.read && (
                  <span className="text-[10px] font-sans font-semibold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-1.5 py-0.2 rounded">
                    NEW
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{alert.timestamp}</span>
              </div>
            </div>

            <h3 className="text-base font-semibold text-white mt-2 group-hover:text-indigo-300">
              {alert.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {alert.summary}
            </p>

            {/* Impacted Stocks Pills */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                {alert.stocksImpacted.inclusions && alert.stocksImpacted.inclusions.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">Inclusions:</span>
                    {alert.stocksImpacted.inclusions.map((sym) => (
                      <button
                        key={sym}
                        onClick={(e) => { e.stopPropagation(); onSelectStock(sym); }}
                        className="font-mono font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 hover:border-emerald-500/50 cursor-pointer transition-colors"
                      >
                        +{sym}
                      </button>
                    ))}
                  </div>
                )}

                {alert.stocksImpacted.exclusions && alert.stocksImpacted.exclusions.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">Exclusions:</span>
                    {alert.stocksImpacted.exclusions.map((sym) => (
                      <button
                        key={sym}
                        onClick={(e) => { e.stopPropagation(); onSelectStock(sym); }}
                        className="font-mono font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 hover:border-rose-500/50 cursor-pointer transition-colors"
                      >
                        -{sym}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-slate-400 font-mono text-[11px]">
                Effective: <span className="text-white">{alert.effectiveDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
