/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { MetricOverview } from './components/MetricOverview.tsx';
import { UpcomingInclusions } from './components/UpcomingInclusions.tsx';
import { ExclusionsWatchlist } from './components/ExclusionsWatchlist.tsx';
import { DeletedArchive } from './components/DeletedArchive.tsx';
import { DailyAnalysisView } from './components/DailyAnalysisView.tsx';
import { RealTimeAlerts } from './components/RealTimeAlerts.tsx';
import { FOTrendsView } from './components/FOTrendsView.tsx';
import { MyPortfolioView } from './components/MyPortfolioView.tsx';
import { StockDetailModal } from './components/StockDetailModal.tsx';
import {
  UPCOMING_INCLUSIONS,
  EXCLUSIONS_WATCHLIST,
  DELETED_STOCKS_ARCHIVE,
  OFFICIAL_REBALANCE_ALERTS,
  DAILY_SNAPSHOT,
} from './data/nifty50Data.ts';
import { FO_NIFTY50_TRENDS } from './data/foData.ts';
import { KNOWN_STOCKS_CATALOG, generateAdvisorRecommendation } from './data/portfolioPresets.ts';
import { UpcomingInclusionStock, ExclusionDelistingStock, RebalanceAlert, NavTab, FOTrendStock, UserPortfolioStock } from './types/index.ts';
import { playAlertChime } from './utils/audio.ts';
import { Search, AlertCircle, Info, BellRing } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('upcoming');
  const [alerts, setAlerts] = useState<RebalanceAlert[]>(OFFICIAL_REBALANCE_ALERTS);
  const [foStocks, setFoStocks] = useState<FOTrendStock[]>(FO_NIFTY50_TRENDS);
  const [isFoRefreshing, setIsFoRefreshing] = useState<boolean>(false);
  const [foLastUpdated, setFoLastUpdated] = useState<string>('Live Session (09:18 IST)');
  const [autoRefreshSecondsLeft, setAutoRefreshSecondsLeft] = useState<number>(30);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [selectedStock, setSelectedStock] = useState<UpcomingInclusionStock | ExclusionDelistingStock | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('24 Sep 2026, 09:18 IST');
  const [bannerAlert, setBannerAlert] = useState<string | null>(null);

  // Portfolio local storage initialization - 100% clean of sample data, preserved permanently
  const [portfolioStocks, setPortfolioStocks] = useState<UserPortfolioStock[]>(() => {
    try {
      const saved = localStorage.getItem('nifty50_radar_portfolio_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }

      // Check legacy storage and purge any old mock sample items
      const legacySaved = localStorage.getItem('nifty50_radar_portfolio');
      if (legacySaved) {
        const parsedLegacy = JSON.parse(legacySaved);
        if (Array.isArray(parsedLegacy)) {
          const userOnly = parsedLegacy.filter(
            (s: any) => s.id !== 'port-1' && s.id !== 'port-2' && s.id !== 'port-3'
          );
          if (userOnly.length > 0) {
            localStorage.setItem('nifty50_radar_portfolio_user', JSON.stringify(userOnly));
            return userOnly;
          }
        }
      }
    } catch (e) {
      console.warn('Could not read portfolio from localStorage:', e);
    }
    return []; // Absolutely no sample data!
  });

  // Sync portfolio changes to browser localStorage permanently across redeployments
  useEffect(() => {
    try {
      localStorage.setItem('nifty50_radar_portfolio_user', JSON.stringify(portfolioStocks));
    } catch (e) {
      console.warn('Could not save portfolio to localStorage:', e);
    }
  }, [portfolioStocks]);

  // Automatic 30-second refresh timer for F&O timing ticks
  useEffect(() => {
    if (activeTab !== 'fo_trends' || !autoRefreshEnabled) {
      setAutoRefreshSecondsLeft(30);
      return;
    }

    const timer = setInterval(() => {
      setAutoRefreshSecondsLeft((prev) => {
        if (prev <= 1) {
          handleRefreshFOTicks();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTab, autoRefreshEnabled]);

  const handleAddPortfolioStock = (stockData: Omit<UserPortfolioStock, 'id'>) => {
    const newStock: UserPortfolioStock = {
      ...stockData,
      id: 'port-' + Date.now(),
    };
    setPortfolioStocks((prev) => [newStock, ...prev]);
    if (soundEnabled) {
      playAlertChime();
    }
  };

  const handleRemovePortfolioStock = (id: string) => {
    setPortfolioStocks((prev) => prev.filter((s) => s.id !== id));
  };

  const handleRestorePortfolio = (stocks: UserPortfolioStock[]) => {
    setPortfolioStocks(stocks);
    if (soundEnabled) {
      playAlertChime();
    }
  };

  const handleToggleAutoRefresh = () => {
    setAutoRefreshEnabled((prev) => !prev);
  };

  const handleUpdatePortfolioStock = (id: string, shares: number, avgBuyPrice: number) => {
    setPortfolioStocks((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const profile = KNOWN_STOCKS_CATALOG.find((s) => s.symbol === item.symbol);
          const advisor = profile
            ? generateAdvisorRecommendation(profile, avgBuyPrice, item.currentPrice)
            : { suggestion: item.suggestion, rationale: item.suggestionRationale };
          return {
            ...item,
            shares,
            avgBuyPrice,
            suggestion: advisor.suggestion,
            suggestionRationale: advisor.rationale,
          };
        }
        return item;
      })
    );
  };

  const handleClearPortfolio = () => {
    setPortfolioStocks([]);
  };

  const unreadCount = alerts.filter((a) => !a.read).length;

  const handleMarkAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  };

  const handleMarkAllAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const handleRefreshFOTicks = () => {
    setIsFoRefreshing(true);
    setTimeout(() => {
      setFoStocks((prev) =>
        prev.map((stock) => {
          const delta = (Math.random() - 0.48) * 0.008; // -0.4% to +0.4%
          const newSpot = Math.round((stock.spotPrice * (1 + delta)) * 100) / 100;
          const newBasis = Math.round((stock.basis + (Math.random() - 0.5) * 0.4) * 100) / 100;
          const newFuture = Math.round((newSpot + newBasis) * 100) / 100;
          const newChangePercent = Math.round((stock.changePercent + delta * 100) * 100) / 100;
          const newOiChange = Math.round((stock.oiChangePercent + (Math.random() - 0.4) * 1.5) * 10) / 10;
          return {
            ...stock,
            spotPrice: newSpot,
            futurePrice: newFuture,
            basis: newBasis,
            changePercent: newChangePercent,
            oiChangePercent: newOiChange,
          };
        })
      );
      setIsFoRefreshing(false);
      const now = new Date();
      const timeStr = `Live Ticks (${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} IST)`;
      setFoLastUpdated(timeStr);
      if (soundEnabled) {
        playAlertChime();
      }
    }, 500);
  };

  const handleSelectStockBySymbol = (symbol: string) => {
    const cleanSym = symbol.toUpperCase().trim();
    const foundUpcoming = UPCOMING_INCLUSIONS.find((s) => s.symbol === cleanSym);
    if (foundUpcoming) {
      setSelectedStock(foundUpcoming);
      return;
    }
    const foundExclusion = EXCLUSIONS_WATCHLIST.find((s) => s.symbol === cleanSym);
    if (foundExclusion) {
      setSelectedStock(foundExclusion);
      return;
    }
  };

  // Simulate real-time official rebalancing announcement
  const handleTriggerLiveAlert = () => {
    const randomCirculars = [
      {
        title: 'NSE Indices Special Notice: Extraordinary Meeting on Nifty 50 Constituent Replacement',
        circularNumber: `NSE/INDEX/2026/${Math.floor(100 + Math.random() * 900)}`,
        category: 'official_circular' as const,
        summary: 'Official circular confirmative: ZOMATO qualifies with Free Float Market Cap > ₹1,68,000 Cr, meeting the 1.5x entry criteria over constituent INDUSINDBK.',
        stocksImpacted: { inclusions: ['ZOMATO'], exclusions: ['INDUSINDBK'] },
        effectiveDate: 'Immediate Index Review Window',
      },
      {
        title: 'Critical 15-Day Cut-Off Threshold Breach: Rank #50 Constituent Triggered',
        circularNumber: `NSE/SURV/2026/${Math.floor(200 + Math.random() * 800)}`,
        category: 'critical_cutoff' as const,
        summary: 'Constituent BPCL trailing 6-month free float rank has dropped below tolerance band. Replacement candidate TRENT has maintained positive alpha differential for 180 trading sessions.',
        stocksImpacted: { inclusions: ['TRENT'], exclusions: ['BPCL'] },
        effectiveDate: 'Next 15 Days Settlement Window',
      },
      {
        title: 'Advance Rebalance Disclosure: Passive Inflow Projection Exceeds ₹4,000 Cr for Top Contender',
        circularNumber: `NSE/INDEX/2026/${Math.floor(300 + Math.random() * 700)}`,
        category: 'advance_notice' as const,
        summary: 'Institutional passive asset managers updated rebalance tracking models with revised constituent weight projections for the upcoming semi-annual review.',
        stocksImpacted: { inclusions: ['TRENT', 'JIOFIN'], exclusions: ['HEROMOTOCO', 'WIPRO'] },
        effectiveDate: 'Upcoming Semi-Annual Review',
      },
    ];

    const pick = randomCirculars[Math.floor(Math.random() * randomCirculars.length)];
    const now = new Date();
    const timeStr = `Just now, ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST`;

    const newAlert: RebalanceAlert = {
      id: 'alt-' + Date.now(),
      timestamp: timeStr,
      title: pick.title,
      circularNumber: pick.circularNumber,
      source: 'NSE Indices Ltd',
      category: pick.category,
      summary: pick.summary,
      stocksImpacted: pick.stocksImpacted,
      effectiveDate: pick.effectiveDate,
      read: false,
      isLiveEvent: true,
    };

    setAlerts((prev) => [newAlert, ...prev]);

    if (soundEnabled) {
      playAlertChime();
    }

    setBannerAlert(`${pick.title} (${pick.circularNumber})`);
    setTimeout(() => {
      setBannerAlert(null);
    }, 6000);
  };

  // Filtered lists if search query is active
  const filteredUpcoming = UPCOMING_INCLUSIONS.filter(
    (s) =>
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExclusions = EXCLUSIONS_WATCHLIST.filter(
    (s) =>
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Bar adhering to Top Bar Contract */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreadAlertsCount={unreadCount}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onTriggerLiveAlert={handleTriggerLiveAlert}
        lastUpdated={lastUpdated}
        portfolioCount={portfolioStocks.length}
      />

      {/* Real-Time Alert Banner if new circular arrives */}
      {bannerAlert && (
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-500/40 px-4 py-2.5 text-xs text-indigo-200 flex items-center justify-between animate-fadeIn">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono">
              <BellRing className="w-4 h-4 text-indigo-400 animate-bounce" />
              <span className="font-bold text-white uppercase text-[11px] bg-indigo-500/30 px-1.5 py-0.5 rounded">
                NEW OFFICIAL CIRCULAR
              </span>
              <span className="truncate text-slate-200 font-sans">{bannerAlert}</span>
            </div>
            <button
              onClick={() => {
                setActiveTab('alerts');
                setBannerAlert(null);
              }}
              className="text-emerald-400 hover:underline font-sans text-xs whitespace-nowrap"
            >
              View Alert &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* High Density Metric Overview */}
        <MetricOverview onSelectStock={handleSelectStockBySymbol} />

        {/* Search & Quick Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Nifty 50 stocks (e.g. ZOMATO, TRENT, INDUSINDBK)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 w-full sm:w-auto justify-between sm:justify-end">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Inclusions: <strong className="text-white font-mono">{filteredUpcoming.length}</strong>
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Exclusions: <strong className="text-white font-mono">{filteredExclusions.length}</strong>
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="font-mono text-[11px] text-cyan-400">
              NSE Cut-off Cycle: Active
            </span>
          </div>
        </div>

        {/* Primary Tab Panels */}
        {activeTab === 'upcoming' && (
          <UpcomingInclusions
            stocks={filteredUpcoming}
            onSelectStock={(stock) => setSelectedStock(stock)}
          />
        )}

        {activeTab === 'exclusions' && (
          <ExclusionsWatchlist
            stocks={filteredExclusions}
            onSelectStock={(stock) => setSelectedStock(stock)}
          />
        )}

        {activeTab === 'fo_trends' && (
          <FOTrendsView
            foStocks={foStocks}
            onSelectStock={handleSelectStockBySymbol}
            onRefreshFOTicks={handleRefreshFOTicks}
            isRefreshing={isFoRefreshing}
            lastUpdated={foLastUpdated}
            autoRefreshSecondsLeft={autoRefreshSecondsLeft}
            autoRefreshEnabled={autoRefreshEnabled}
            onToggleAutoRefresh={handleToggleAutoRefresh}
          />
        )}

        {activeTab === 'portfolio' && (
          <MyPortfolioView
            portfolioStocks={portfolioStocks}
            onAddStock={handleAddPortfolioStock}
            onRemoveStock={handleRemovePortfolioStock}
            onUpdateStock={handleUpdatePortfolioStock}
            onRestorePortfolio={handleRestorePortfolio}
            onClearPortfolio={handleClearPortfolio}
          />
        )}

        {activeTab === 'deleted' && (
          <DeletedArchive stocks={DELETED_STOCKS_ARCHIVE} />
        )}

        {activeTab === 'daily' && (
          <DailyAnalysisView onSelectStock={handleSelectStockBySymbol} />
        )}

        {activeTab === 'alerts' && (
          <RealTimeAlerts
            alerts={alerts}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onTriggerSimulatedAlert={handleTriggerLiveAlert}
            onSelectStock={handleSelectStockBySymbol}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}
      </main>

      {/* Stock Deep Dive Modal */}
      <StockDetailModal
        stock={selectedStock}
        onClose={() => setSelectedStock(null)}
      />

      {/* Institutional Terminal Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">NIFTY 50 REBALANCE RADAR</span>
            <span aria-hidden="true">·</span>
            <span>National Stock Exchange of India (NSE) Index Methodology Compliant</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
            <span>Semi-Annual Reviews: March &amp; September</span>
            <span aria-hidden="true">·</span>
            <span>Cut-off Baseline: Jan 31 &amp; July 31</span>
            <span aria-hidden="true">·</span>
            <span>Rule: 1.5x Free-Float Hurdle</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
