/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
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
import {
  KNOWN_STOCKS_CATALOG,
  generateAdvisorRecommendation,
  resolveRealtimeMarketQuote
} from './data/portfolioPresets.ts';
import { fetchBatchRealtimeQuotes, fetchRealtimeQuote } from './services/marketDataService.ts';
import { LiveMarketProvider, useLiveMarket } from './context/LiveMarketContext.tsx';
import { UpcomingInclusionStock, ExclusionDelistingStock, RebalanceAlert, NavTab, FOTrendStock, UserPortfolioStock } from './types/index.ts';
import { playAlertChime } from './utils/audio.ts';
import { Search, AlertCircle, Info, BellRing } from 'lucide-react';

function AppContent() {
  const { indices, lastSyncedTime, refreshMarketData, quotes } = useLiveMarket();
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
  const [lastUpdated, setLastUpdated] = useState<string>('25 Sep 2026, Live IST');
  const [bannerAlert, setBannerAlert] = useState<string | null>(null);

  // Portfolio local storage initialization - Auto-sync live market quotes for true valuation
  const [portfolioStocks, setPortfolioStocks] = useState<UserPortfolioStock[]>(() => {
    try {
      const saved = localStorage.getItem('nifty50_radar_portfolio_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Auto-sync real-time market quotes without destroying custom or live market prices
          return parsed.map((stock: UserPortfolioStock) => {
            const quote = resolveRealtimeMarketQuote(stock.symbol || stock.name);
            if (quote) {
              const activePrice = stock.currentPrice > 0 ? stock.currentPrice : quote.currentPrice;
              const advisor = generateAdvisorRecommendation(quote, stock.avgBuyPrice, activePrice, stock.shares);
              return {
                ...stock,
                symbol: quote.symbol,
                name: quote.name,
                nseKey: quote.nseKey,
                bseKey: quote.bseKey,
                isin: quote.isin,
                currentPrice: activePrice,
                dayChangePercent: stock.dayChangePercent || quote.dayChangePercent,
                rebalanceStatus: quote.rebalanceStatus,
                targetPrice: quote.targetPrice,
                stopLoss: quote.stopLoss,
                riskRating: quote.riskRating,
                suggestion: advisor.suggestion,
                suggestionRationale: advisor.rationale,
                predictions: advisor.predictions,
                targetPrice1Y: advisor.targetPrice1Y,
                targetPrice3Y: advisor.targetPrice3Y,
                targetPrice5Y: advisor.targetPrice5Y,
                targetPrice10Y: advisor.targetPrice10Y,
              };
            }
            return stock;
          });
        }
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
    return [];
  });

  // Sync portfolio changes to browser localStorage permanently across redeployments
  useEffect(() => {
    try {
      localStorage.setItem('nifty50_radar_portfolio_user', JSON.stringify(portfolioStocks));
    } catch (e) {
      console.warn('Could not save portfolio to localStorage:', e);
    }
  }, [portfolioStocks]);

  const handleRefreshAllPortfolioQuotes = async () => {
    // 1. Preserve existing current prices or initialize missing quotes
    setPortfolioStocks((prev) =>
      prev.map((item) => {
        const profile = resolveRealtimeMarketQuote(item.symbol || item.name);
        const priceToUse = item.currentPrice > 0
          ? item.currentPrice
          : (profile && profile.currentPrice > 0 ? profile.currentPrice : 350);
        const dayChangeToUse = item.dayChangePercent !== undefined
          ? item.dayChangePercent
          : (profile ? profile.dayChangePercent : 0);
        const advisor = generateAdvisorRecommendation(profile, item.avgBuyPrice, priceToUse, item.shares);
        return {
          ...item,
          symbol: profile.symbol || item.symbol,
          name: profile.name || item.name,
          nseKey: profile.nseKey || item.nseKey,
          bseKey: profile.bseKey || item.bseKey,
          isin: profile.isin || item.isin,
          currentPrice: priceToUse,
          dayChangePercent: dayChangeToUse,
          suggestion: advisor.suggestion,
          suggestionRationale: advisor.rationale,
          predictions: advisor.predictions,
          targetPrice1Y: advisor.targetPrice1Y,
          targetPrice3Y: advisor.targetPrice3Y,
          targetPrice5Y: advisor.targetPrice5Y,
          targetPrice10Y: advisor.targetPrice10Y,
        };
      })
    );

    // 2. Fetch live quotes from API for all portfolio stocks
    try {
      const symbols = portfolioStocks.map((s) => s.symbol || s.name);
      if (symbols.length > 0) {
        const liveQuotes = await fetchBatchRealtimeQuotes(symbols);
        setPortfolioStocks((prev) =>
          prev.map((item) => {
            const sym = item.symbol || item.name;
            const live = liveQuotes[sym];
            if (live && live.currentPrice > 0) {
              const profile = resolveRealtimeMarketQuote(sym);
              const advisor = generateAdvisorRecommendation(profile, item.avgBuyPrice, live.currentPrice, item.shares);
              return {
                ...item,
                currentPrice: live.currentPrice,
                dayChangePercent: live.dayChangePercent,
                suggestion: advisor.suggestion,
                suggestionRationale: advisor.rationale,
                predictions: advisor.predictions,
                targetPrice1Y: advisor.targetPrice1Y,
                targetPrice3Y: advisor.targetPrice3Y,
                targetPrice5Y: advisor.targetPrice5Y,
                targetPrice10Y: advisor.targetPrice10Y,
              };
            }
            return item;
          })
        );
      }
    } catch {
      // keep current
    }

    if (soundEnabled) {
      playAlertChime();
    }
  };

  // Synchronize any existing saved portfolio holdings to current real-time prices on mount
  useEffect(() => {
    if (portfolioStocks.length > 0) {
      handleRefreshAllPortfolioQuotes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Automatic 30-second refresh timer for F&O timing ticks and portfolio quotes
  useEffect(() => {
    if (!autoRefreshEnabled) {
      setAutoRefreshSecondsLeft(30);
      return;
    }

    const timer = setInterval(() => {
      setAutoRefreshSecondsLeft((prev) => {
        if (prev <= 1) {
          if (activeTab === 'fo_trends') {
            handleRefreshFOTicks();
          } else if (activeTab === 'portfolio') {
            handleRefreshAllPortfolioQuotes();
          }
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTab, autoRefreshEnabled, portfolioStocks]);

  const handleAddPortfolioStock = (stockData: Omit<UserPortfolioStock, 'id'>) => {
    const newStock: UserPortfolioStock = {
      ...stockData,
      id: 'port-' + Date.now(),
    };
    setPortfolioStocks((prev) => [newStock, ...prev]);
    if (soundEnabled) {
      playAlertChime();
    }

    // Immediately fetch and apply the true real-time market price for the added stock
    (async () => {
      try {
        const live = await fetchRealtimeQuote(newStock.symbol || newStock.name);
        if (live && live.currentPrice > 0) {
          setPortfolioStocks((prev) =>
            prev.map((item) => {
              if (item.id === newStock.id) {
                const profile = resolveRealtimeMarketQuote(item.symbol || item.name);
                const advisor = generateAdvisorRecommendation(profile, item.avgBuyPrice, live.currentPrice, item.shares);
                return {
                  ...item,
                  currentPrice: live.currentPrice,
                  dayChangePercent: live.dayChangePercent,
                  suggestion: advisor.suggestion,
                  suggestionRationale: advisor.rationale,
                  predictions: advisor.predictions,
                  targetPrice1Y: advisor.targetPrice1Y,
                  targetPrice3Y: advisor.targetPrice3Y,
                  targetPrice5Y: advisor.targetPrice5Y,
                  targetPrice10Y: advisor.targetPrice10Y,
                };
              }
              return item;
            })
          );
        }
      } catch {
        // preserve submitted quote
      }
    })();
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

  const handleBatchUpdatePortfolioStocks = (updatedStocks: UserPortfolioStock[]) => {
    setPortfolioStocks(updatedStocks);
    if (soundEnabled) {
      playAlertChime();
    }
  };

  const handleToggleAutoRefresh = () => {
    setAutoRefreshEnabled((prev) => !prev);
  };

  const handleUpdatePortfolioStock = (id: string, shares: number, avgBuyPrice: number, currentPrice?: number) => {
    setPortfolioStocks((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const profile = resolveRealtimeMarketQuote(item.symbol || item.name);
          const activePrice = currentPrice !== undefined
            ? currentPrice
            : (item.currentPrice > 0 ? item.currentPrice : (profile ? profile.currentPrice : item.currentPrice));
          const advisor = profile
            ? generateAdvisorRecommendation(profile, avgBuyPrice, activePrice, shares)
            : {
                suggestion: item.suggestion,
                rationale: item.suggestionRationale,
                predictions: item.predictions,
                targetPrice1Y: item.targetPrice1Y,
                targetPrice3Y: item.targetPrice3Y,
                targetPrice5Y: item.targetPrice5Y,
                targetPrice10Y: item.targetPrice10Y,
              };
          return {
            ...item,
            symbol: profile.symbol,
            name: profile.name,
            nseKey: profile.nseKey,
            bseKey: profile.bseKey,
            isin: profile.isin,
            shares,
            avgBuyPrice,
            currentPrice: activePrice,
            suggestion: advisor.suggestion,
            suggestionRationale: advisor.rationale,
            predictions: advisor.predictions,
            targetPrice1Y: advisor.targetPrice1Y,
            targetPrice3Y: advisor.targetPrice3Y,
            targetPrice5Y: advisor.targetPrice5Y,
            targetPrice10Y: advisor.targetPrice10Y,
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

  // Filtered lists across all menus when search query is active
  const q = searchQuery.trim().toLowerCase();

  const filteredUpcoming = useMemo(() => {
    if (!q) return UPCOMING_INCLUSIONS;
    return UPCOMING_INCLUSIONS.filter(
      (s) =>
        s.symbol.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q) ||
        s.alphaRationale.toLowerCase().includes(q) ||
        (s.tradeTiming && s.tradeTiming.actionHeadline.toLowerCase().includes(q))
    );
  }, [q]);

  const filteredExclusions = useMemo(() => {
    if (!q) return EXCLUSIONS_WATCHLIST;
    return EXCLUSIONS_WATCHLIST.filter(
      (s) =>
        s.symbol.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q) ||
        s.exclusionReason.toLowerCase().includes(q) ||
        s.likelyReplacementSymbol.toLowerCase().includes(q)
    );
  }, [q]);

  const filteredFoStocks = useMemo(() => {
    if (!q) return foStocks;
    return foStocks.filter(
      (s) =>
        s.symbol.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q) ||
        s.timing.status.toLowerCase().includes(q) ||
        s.timing.headline.toLowerCase().includes(q) ||
        s.timing.actionPrompt.toLowerCase().includes(q) ||
        s.oiTrend.toLowerCase().includes(q)
    );
  }, [foStocks, q]);

  const filteredPortfolio = useMemo(() => {
    if (!q) return portfolioStocks;
    return portfolioStocks.filter(
      (s) =>
        s.symbol.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        (s.nseKey && s.nseKey.toLowerCase().includes(q)) ||
        (s.bseKey && s.bseKey.toLowerCase().includes(q)) ||
        (s.notes && s.notes.toLowerCase().includes(q)) ||
        s.suggestion.toLowerCase().includes(q) ||
        s.rebalanceStatus.toLowerCase().includes(q)
    );
  }, [portfolioStocks, q]);

  const filteredDeletedArchive = useMemo(() => {
    if (!q) return DELETED_STOCKS_ARCHIVE;
    return DELETED_STOCKS_ARCHIVE.filter(
      (s) =>
        s.symbol.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q) ||
        s.replacementSymbol.toLowerCase().includes(q) ||
        s.circularRef.toLowerCase().includes(q)
    );
  }, [q]);

  const filteredAlerts = useMemo(() => {
    if (!q) return alerts;
    return alerts.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.circularNumber.toLowerCase().includes(q) ||
        (a.stocksImpacted?.inclusions && a.stocksImpacted.inclusions.some((s) => s.toLowerCase().includes(q))) ||
        (a.stocksImpacted?.exclusions && a.stocksImpacted.exclusions.some((s) => s.toLowerCase().includes(q)))
    );
  }, [alerts, q]);

  // Check how many matches exist on the current active tab
  const currentTabMatchesCount =
    activeTab === 'upcoming'
      ? filteredUpcoming.length
      : activeTab === 'exclusions'
      ? filteredExclusions.length
      : activeTab === 'fo_trends'
      ? filteredFoStocks.length
      : activeTab === 'portfolio'
      ? filteredPortfolio.length
      : activeTab === 'deleted'
      ? filteredDeletedArchive.length
      : filteredAlerts.length;

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
        onRefreshPortfolio={handleRefreshAllPortfolioQuotes}
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

        {/* Global Menu-Wise Search & Quick Navigation Bar */}
        <div className="mb-6 space-y-2">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search across all menus (e.g. TRENT, ZOMATO, RELIANCE, HDFC)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-md pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Interactive Menu-Wise Match Badges with Click-to-Switch */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0 ${
                  activeTab === 'upcoming'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-400 hover:text-emerald-300 bg-slate-900 border border-slate-800'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Inclusions:</span>
                <strong className="font-mono text-white">{filteredUpcoming.length}</strong>
              </button>

              <button
                onClick={() => setActiveTab('exclusions')}
                className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0 ${
                  activeTab === 'exclusions'
                    ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40'
                    : 'text-slate-400 hover:text-rose-300 bg-slate-900 border border-slate-800'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>Exclusions:</span>
                <strong className="font-mono text-white">{filteredExclusions.length}</strong>
              </button>

              <button
                onClick={() => setActiveTab('fo_trends')}
                className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0 ${
                  activeTab === 'fo_trends'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                    : 'text-slate-400 hover:text-amber-300 bg-slate-900 border border-slate-800'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>F&amp;O:</span>
                <strong className="font-mono text-white">{filteredFoStocks.length}</strong>
              </button>

              <button
                onClick={() => setActiveTab('portfolio')}
                className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0 ${
                  activeTab === 'portfolio'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-cyan-300 bg-slate-900 border border-slate-800'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Portfolio:</span>
                <strong className="font-mono text-white">{filteredPortfolio.length}</strong>
              </button>

              <button
                onClick={() => setActiveTab('deleted')}
                className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0 ${
                  activeTab === 'deleted'
                    ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/40'
                    : 'text-slate-400 hover:text-indigo-300 bg-slate-900 border border-slate-800'
                }`}
              >
                <span>Archive:</span>
                <strong className="font-mono text-white">{filteredDeletedArchive.length}</strong>
              </button>

              <button
                onClick={() => setActiveTab('alerts')}
                className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0 ${
                  activeTab === 'alerts'
                    ? 'bg-violet-500/20 text-violet-300 font-bold border border-violet-500/40'
                    : 'text-slate-400 hover:text-violet-300 bg-slate-900 border border-slate-800'
                }`}
              >
                <span>Alerts:</span>
                <strong className="font-mono text-white">{filteredAlerts.length}</strong>
              </button>
            </div>
          </div>

          {/* Quick Cross-Tab Navigation Suggestion Banner if 0 matches on active tab */}
          {q && currentTabMatchesCount === 0 && (
            <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-lg text-xs text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fadeIn">
              <div>
                <span>No results for "<strong>{searchQuery}</strong>" in the currently selected <strong>{activeTab.toUpperCase()}</strong> menu.</span>
              </div>
              <div className="flex items-center gap-2">
                {filteredUpcoming.length > 0 && (
                  <button
                    onClick={() => setActiveTab('upcoming')}
                    className="underline text-emerald-300 hover:text-white font-medium cursor-pointer"
                  >
                    View Inclusions ({filteredUpcoming.length}) &rarr;
                  </button>
                )}
                {filteredExclusions.length > 0 && (
                  <button
                    onClick={() => setActiveTab('exclusions')}
                    className="underline text-rose-300 hover:text-white font-medium cursor-pointer"
                  >
                    View Exclusions ({filteredExclusions.length}) &rarr;
                  </button>
                )}
                {filteredFoStocks.length > 0 && (
                  <button
                    onClick={() => setActiveTab('fo_trends')}
                    className="underline text-amber-300 hover:text-white font-medium cursor-pointer"
                  >
                    View F&amp;O Signals ({filteredFoStocks.length}) &rarr;
                  </button>
                )}
                {filteredPortfolio.length > 0 && (
                  <button
                    onClick={() => setActiveTab('portfolio')}
                    className="underline text-cyan-300 hover:text-white font-medium cursor-pointer"
                  >
                    View Portfolio Advisor ({filteredPortfolio.length}) &rarr;
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Primary Tab Panels with All Menu-Wise Filters Connected */}
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
            foStocks={filteredFoStocks}
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
            portfolioStocks={filteredPortfolio}
            onAddStock={handleAddPortfolioStock}
            onRemoveStock={handleRemovePortfolioStock}
            onUpdateStock={handleUpdatePortfolioStock}
            onRestorePortfolio={handleRestorePortfolio}
            onClearPortfolio={handleClearPortfolio}
            onRefreshQuotes={handleRefreshAllPortfolioQuotes}
            onBatchUpdateStocks={handleBatchUpdatePortfolioStocks}
          />
        )}

        {activeTab === 'deleted' && (
          <DeletedArchive stocks={filteredDeletedArchive} />
        )}

        {activeTab === 'daily' && (
          <DailyAnalysisView onSelectStock={handleSelectStockBySymbol} />
        )}

        {activeTab === 'alerts' && (
          <RealTimeAlerts
            alerts={filteredAlerts}
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

export default function App() {
  return (
    <LiveMarketProvider>
      <AppContent />
    </LiveMarketProvider>
  );
}
