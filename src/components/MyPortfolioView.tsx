import React, { useState, useRef, useEffect } from 'react';
import { UserPortfolioStock, PortfolioAction } from '../types/index.ts';
import {
  KNOWN_STOCKS_CATALOG,
  searchNSEBSEStocks,
  resolveRealtimeMarketQuote,
  generateAdvisorRecommendation,
  calculateHorizonPredictions,
  KnownStockProfile
} from '../data/portfolioPresets.ts';
import { fetchRealtimeQuote, fetchBatchRealtimeQuotes } from '../services/marketDataService.ts';
import {
  Briefcase,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Edit2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  SlidersHorizontal,
  Target,
  Download,
  Upload,
  Search,
  Check,
  CheckCheck,
  Clock
} from 'lucide-react';

interface MyPortfolioViewProps {
  portfolioStocks: UserPortfolioStock[];
  onAddStock: (stock: Omit<UserPortfolioStock, 'id'>) => void;
  onRemoveStock: (id: string) => void;
  onUpdateStock: (id: string, shares: number, avgBuyPrice: number, currentPrice?: number) => void;
  onRestorePortfolio: (stocks: UserPortfolioStock[]) => void;
  onClearPortfolio: () => void;
  onRefreshQuotes?: () => void;
  onBatchUpdateStocks?: (updatedStocks: UserPortfolioStock[]) => void;
}

export const MyPortfolioView: React.FC<MyPortfolioViewProps> = ({
  portfolioStocks,
  onAddStock,
  onRemoveStock,
  onUpdateStock,
  onRestorePortfolio,
  onClearPortfolio,
  onRefreshQuotes,
  onBatchUpdateStocks,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStock, setSelectedStock] = useState<KnownStockProfile | null>(null);
  const [sharesInput, setSharesInput] = useState<string>('100');
  const [buyPriceInput, setBuyPriceInput] = useState<string>('');
  const [notesInput, setNotesInput] = useState<string>('');
  const [filterAction, setFilterAction] = useState<string>('all');
  
  // Dual-field editable state: Both Quantity (Shares) AND Avg Purchase Price
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [editShares, setEditShares] = useState<string>('');
  const [editBuyPrice, setEditBuyPrice] = useState<string>('');
  
  // Status feedback for live validation
  const [validationSuccessMessage, setValidationSuccessMessage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isLoadingQuote, setIsLoadingQuote] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-sync real-time quotes on mount for all holdings
  useEffect(() => {
    if (portfolioStocks.length === 0) return;

    (async () => {
      const symbols = portfolioStocks.map((s) => s.symbol || s.name);
      try {
        const quotesMap = await fetchBatchRealtimeQuotes(symbols);
        for (const stock of portfolioStocks) {
          const sym = stock.symbol || stock.name;
          const live = quotesMap[sym];
          if (live && live.currentPrice > 0 && Math.abs(live.currentPrice - stock.currentPrice) > 0.01) {
            onUpdateStock(stock.id, stock.shares, stock.avgBuyPrice, live.currentPrice);
          }
        }
      } catch {
        // keep calibrated quotes
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search results from valid NSE/BSE stock catalog
  const searchResults = searchQuery.trim() ? searchNSEBSEStocks(searchQuery) : KNOWN_STOCKS_CATALOG.slice(0, 6);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
    setSearchQuery('');
    setSelectedStock(null);
    setSharesInput('100');
    setBuyPriceInput('');
    setNotesInput('');
    setIsLoadingQuote(false);
  };

  const handleSelectStock = async (profile: KnownStockProfile) => {
    setSelectedStock(profile);
    setBuyPriceInput('');
    setIsLoadingQuote(true);
    try {
      const live = await fetchRealtimeQuote(profile.symbol || profile.name);
      if (live && live.currentPrice > 0) {
        setSelectedStock((prev) =>
          prev && (prev.symbol === profile.symbol || prev.name === profile.name)
            ? {
                ...prev,
                currentPrice: live.currentPrice,
                dayChangePercent: live.dayChangePercent,
              }
            : prev
        );
      }
    } catch {
      // keep catalog price
    } finally {
      setIsLoadingQuote(false);
    }
  };

  const handleSelectCustomQuery = async (query: string) => {
    const resolved = resolveRealtimeMarketQuote(query);
    setSelectedStock(resolved);
    setBuyPriceInput('');
    setIsLoadingQuote(true);
    try {
      const live = await fetchRealtimeQuote(query);
      if (live && live.currentPrice > 0) {
        setSelectedStock((prev) =>
          prev
            ? {
                ...prev,
                currentPrice: live.currentPrice,
                dayChangePercent: live.dayChangePercent,
                isFallback: false,
              }
            : prev
        );
      }
    } catch {
      // keep resolved quote
    } finally {
      setIsLoadingQuote(false);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock) return;

    const sharesNum = Math.max(1, Number(sharesInput) || 1);
    // User purchase price entered, or falls back to live CMP if left blank
    const buyPriceNum = Number(buyPriceInput) > 0 ? Number(buyPriceInput) : selectedStock.currentPrice;

    // Real-time market price is ALWAYS auto-fetched from live quote
    const realTimeMarketPrice = selectedStock.currentPrice;

    const advisor = generateAdvisorRecommendation(selectedStock, buyPriceNum, realTimeMarketPrice, sharesNum);

    onAddStock({
      symbol: selectedStock.symbol,
      name: selectedStock.name,
      nseKey: selectedStock.nseKey,
      bseKey: selectedStock.bseKey,
      isin: selectedStock.isin,
      shares: sharesNum,
      avgBuyPrice: buyPriceNum,
      buyDate: new Date().toISOString().split('T')[0],
      notes: notesInput.trim() || undefined,
      currentPrice: realTimeMarketPrice,
      dayChangePercent: selectedStock.dayChangePercent,
      rebalanceStatus: selectedStock.rebalanceStatus,
      suggestion: advisor.suggestion,
      suggestionRationale: advisor.rationale,
      targetPrice: selectedStock.targetPrice,
      stopLoss: selectedStock.stopLoss,
      riskRating: selectedStock.riskRating,
      predictions: advisor.predictions,
      targetPrice1Y: advisor.targetPrice1Y,
      targetPrice3Y: advisor.targetPrice3Y,
      targetPrice5Y: advisor.targetPrice5Y,
      targetPrice10Y: advisor.targetPrice10Y,
    });

    setIsAddModalOpen(false);
    setSelectedStock(null);
    setSearchQuery('');
    setNotesInput('');
    setIsLoadingQuote(false);
  };

  // Start editing both shares quantity AND average purchase price
  const handleStartEdit = (stock: UserPortfolioStock) => {
    setEditingStockId(stock.id);
    setEditShares(stock.shares.toString());
    setEditBuyPrice(stock.avgBuyPrice.toString());
  };

  // Cancel inline editing
  const handleCancelEdit = () => {
    setEditingStockId(null);
    setEditShares('');
    setEditBuyPrice('');
  };

  // Save both edited shares quantity AND average buy price
  const handleSaveEdit = (id: string) => {
    const s = Math.max(1, Number(editShares) || 1);
    const p = Math.max(0.01, Number(editBuyPrice) || 1);
    onUpdateStock(id, s, p);
    setEditingStockId(null);
  };

  // Validate and re-analyze all portfolio stocks with live real-time situation
  const handleValidateAllWithRealtimeData = async () => {
    setIsValidating(true);
    try {
      const symbols = portfolioStocks.map((s) => s.symbol || s.name);
      const quotesMap = await fetchBatchRealtimeQuotes(symbols);

      const updatedList: UserPortfolioStock[] = portfolioStocks.map((stock) => {
        const sym = stock.symbol || stock.name;
        const live = quotesMap[sym];
        const profile = resolveRealtimeMarketQuote(sym);

        // Active price is real-time current market price
        const activePrice = (live && live.currentPrice > 0)
          ? live.currentPrice
          : (stock.currentPrice > 0 ? stock.currentPrice : profile.currentPrice);

        const dayChange = (live && live.dayChangePercent !== undefined)
          ? live.dayChangePercent
          : (profile.dayChangePercent ?? stock.dayChangePercent);

        const advisor = generateAdvisorRecommendation(
          profile,
          stock.avgBuyPrice,
          activePrice,
          stock.shares
        );

        return {
          ...stock,
          symbol: profile.symbol || stock.symbol,
          name: profile.name || stock.name,
          nseKey: profile.nseKey || stock.nseKey,
          bseKey: profile.bseKey || stock.bseKey,
          isin: profile.isin || stock.isin,
          currentPrice: activePrice,
          dayChangePercent: dayChange,
          suggestion: advisor.suggestion,
          suggestionRationale: advisor.rationale,
          predictions: advisor.predictions,
          targetPrice1Y: advisor.targetPrice1Y,
          targetPrice3Y: advisor.targetPrice3Y,
          targetPrice5Y: advisor.targetPrice5Y,
          targetPrice10Y: advisor.targetPrice10Y,
        };
      });

      if (onBatchUpdateStocks) {
        onBatchUpdateStocks(updatedList);
      } else {
        for (const s of updatedList) {
          onUpdateStock(s.id, s.shares, s.avgBuyPrice, s.currentPrice);
        }
      }

      setValidationSuccessMessage(
        `Validated & recalculated all ${updatedList.length} stock${updatedList.length === 1 ? '' : 's'} using live Current Market Prices (CMP). Updated Hold/Sell ratings, P&L, and 1, 3, 5, & 10-year compounding targets!`
      );
      setTimeout(() => {
        setValidationSuccessMessage(null);
      }, 5000);
    } catch {
      portfolioStocks.forEach((stock) => {
        const quote = resolveRealtimeMarketQuote(stock.symbol || stock.name);
        if (quote && !quote.isFallback) {
          onUpdateStock(stock.id, stock.shares, stock.avgBuyPrice, quote.currentPrice);
        }
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Export portfolio to a downloadable JSON file for lifetime backup
  const handleExportPortfolio = () => {
    if (portfolioStocks.length === 0) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(portfolioStocks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `portfolio_advisor_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import / Restore portfolio from JSON file
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onRestorePortfolio(parsed);
        }
      } catch (err) {
        console.error('Failed to import portfolio JSON:', err);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Portfolio Totals Calculations (Calculated directly from real-time Current Market Prices)
  const totalInvested = portfolioStocks.reduce((sum, s) => sum + s.shares * s.avgBuyPrice, 0);
  const currentTotalValue = portfolioStocks.reduce((sum, s) => sum + s.shares * s.currentPrice, 0);
  const totalPnl = currentTotalValue - totalInvested;
  const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

  // Multi-Year Long-Term Compounding Projections (1Y, 3Y, 5Y, 10Y) across all portfolio stocks
  const totalProjected1Y = portfolioStocks.reduce((sum, s) => {
    const t = s.targetPrice1Y && s.targetPrice1Y > 0 ? s.targetPrice1Y : (s.currentPrice * 1.18);
    return sum + t * s.shares;
  }, 0);
  const totalProjected3Y = portfolioStocks.reduce((sum, s) => {
    const t = s.targetPrice3Y && s.targetPrice3Y > 0 ? s.targetPrice3Y : (s.currentPrice * Math.pow(1.17, 3));
    return sum + t * s.shares;
  }, 0);
  const totalProjected5Y = portfolioStocks.reduce((sum, s) => {
    const t = s.targetPrice5Y && s.targetPrice5Y > 0 ? s.targetPrice5Y : (s.currentPrice * Math.pow(1.185, 5));
    return sum + t * s.shares;
  }, 0);
  const totalProjected10Y = portfolioStocks.reduce((sum, s) => {
    const t = s.targetPrice10Y && s.targetPrice10Y > 0 ? s.targetPrice10Y : (s.currentPrice * Math.pow(1.175, 10));
    return sum + t * s.shares;
  }, 0);

  const upsideTotal1Y = currentTotalValue > 0 ? (((totalProjected1Y - currentTotalValue) / currentTotalValue) * 100).toFixed(1) : '0';
  const upsideTotal3Y = currentTotalValue > 0 ? (((totalProjected3Y - currentTotalValue) / currentTotalValue) * 100).toFixed(1) : '0';
  const upsideTotal5Y = currentTotalValue > 0 ? (((totalProjected5Y - currentTotalValue) / currentTotalValue) * 100).toFixed(1) : '0';
  const upsideTotal10Y = currentTotalValue > 0 ? (((totalProjected10Y - currentTotalValue) / currentTotalValue) * 100).toFixed(1) : '0';

  // Rebalance health breakdown
  const vulnerableStocks = portfolioStocks.filter((s) => s.suggestion === 'SELL_EXIT_NOW');
  const holdFirmStocks = portfolioStocks.filter((s) => s.suggestion === 'HOLD_FIRM' || s.suggestion === 'ACCUMULATE');

  const filteredPortfolio = portfolioStocks.filter((stock) => {
    if (filterAction === 'sell' && stock.suggestion !== 'SELL_EXIT_NOW') return false;
    if (filterAction === 'hold' && stock.suggestion !== 'HOLD_FIRM') return false;
    if (filterAction === 'accumulate' && stock.suggestion !== 'ACCUMULATE') return false;
    if (filterAction === 'profit' && stock.suggestion !== 'BOOK_PARTIAL_PROFIT') return false;
    return true;
  });

  const getActionBadge = (action: PortfolioAction) => {
    switch (action) {
      case 'HOLD_FIRM':
        return (
          <span className="flex items-center gap-1 font-mono font-bold text-xs px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            HOLD FIRM
          </span>
        );
      case 'SELL_EXIT_NOW':
        return (
          <span className="flex items-center gap-1 font-mono font-bold text-xs px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            SELL / EXIT NOW
          </span>
        );
      case 'ACCUMULATE':
        return (
          <span className="flex items-center gap-1 font-mono font-bold text-xs px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 border border-teal-500/50">
            <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
            ACCUMULATE
          </span>
        );
      case 'BOOK_PARTIAL_PROFIT':
        return (
          <span className="flex items-center gap-1 font-mono font-bold text-xs px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/50">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            BOOK PARTIAL PROFIT
          </span>
        );
    }
  };

  const getRebalanceStatusBadgeClass = (status: string) => {
    if (status.includes('Upcoming')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (status.includes('Exclusion')) return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    return 'text-slate-300 bg-slate-800 border-slate-700';
  };

  return (
    <div className="space-y-5">
      {/* Hidden File Input for Restore */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFile}
        accept=".json"
        className="hidden"
      />

      {/* Header Banner - Updated to "Portfolio Advisor" */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium tracking-wide uppercase">
            <span>REAL-TIME QUANTITATIVE VALUATION</span>
            <span aria-hidden="true">·</span>
            <span>DAILY REBALANCE ADVISORY</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <span>Portfolio Advisor</span>
            <span className="text-xs font-sans font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              100% Private (Saved Locally)
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-time algorithmic advisor for your holdings. Live market prices and daily institutional rebalance ratings determine optimal HOLD or SELL execution.
          </p>
        </div>

        {/* Top Actions Toolbar */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 whitespace-nowrap">
          {portfolioStocks.length > 0 && (
            <button
              onClick={handleValidateAllWithRealtimeData}
              disabled={isValidating}
              title="Re-validate all stocks with live market prices & daily rebalance ratings"
              className="px-3 py-1.5 sm:py-2 text-xs font-medium text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors flex items-center gap-1.5 font-sans cursor-pointer shadow-sm disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin' : ''}`} />
              <span>Validate &amp; Re-Analyze</span>
            </button>
          )}

          {portfolioStocks.length > 0 && (
            <button
              onClick={handleExportPortfolio}
              title="Download portfolio as JSON file"
              className="px-2.5 py-1.5 text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Backup (.json)</span>
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            title="Restore portfolio from a JSON backup file"
            className="px-2.5 py-1.5 text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>Restore (.json)</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-medium text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors flex items-center gap-1.5 font-sans cursor-pointer shadow-sm shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Stock</span>
          </button>
        </div>
      </div>

      {/* Long-Term Horizon & 6-Month Cooling Period Principle Banner */}
      <div className="p-3.5 bg-blue-950/40 border border-blue-500/40 rounded-lg text-xs text-blue-200 flex items-start gap-3 shadow-sm">
        <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-white tracking-wide">
              LONG-TERM INVESTMENT HORIZON: MINIMUM 6-MONTH COOLING PERIOD ENFORCED
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              Semi-Annual Rebalance Calibration
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            This Portfolio Advisor is <strong>not for intraday or short-term swing trading</strong>. Quality Nifty 50 inclusion and core compounder stocks require a minimum <strong>6-month cooling &amp; compounding window</strong> to absorb institutional passive ETF inflows and navigate semi-annual index review cycles. Normal interim market drawdowns (-5% to -15%) during the cooling period represent rupee-cost averaging opportunities rather than premature exit triggers. Only structural index exclusions warrant selling.
          </p>
        </div>
      </div>

      {/* Validation Success Notification Banner */}
      {validationSuccessMessage && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-lg text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-sans font-medium">{validationSuccessMessage}</span>
        </div>
      )}

      {/* Portfolio Overall Financial Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 sm:p-4">
          <div className="text-xs text-slate-400">Total Portfolio Value</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-white mt-1 tabular-nums">
            ₹{currentTotalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Invested: ₹{totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 sm:p-4">
          <div className="text-xs text-slate-400">Total Unrealized P&amp;L</div>
          <div className={`text-lg sm:text-xl font-bold font-mono mt-1 tabular-nums ${totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalPnl >= 0 ? '+' : ''}₹{totalPnl.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          <div className={`text-[11px] font-mono mt-0.5 ${totalPnlPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalPnlPercent >= 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}% Overall Return
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 sm:p-4">
          <div className="text-xs text-slate-400">Rebalance Safe / Hold Stocks</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-emerald-300 mt-1 tabular-nums flex items-center justify-between">
            <span>{holdFirmStocks.length} Stocks</span>
            <span className="text-xs text-emerald-400 font-sans font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
              Safe Inflows
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Upcoming inclusions or core constituents
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 sm:p-4">
          <div className="text-xs text-slate-400">Vulnerable / Sell Warnings</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-rose-300 mt-1 tabular-nums flex items-center justify-between">
            <span>{vulnerableStocks.length} Stocks</span>
            <span className="text-xs text-rose-400 font-sans font-medium bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/30">
              Action Advised
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Facing Nifty 50 deletion &amp; passive outflow
          </div>
        </div>
      </div>

      {/* Portfolio Multi-Year Long-Term Compounding Forecast (1Y · 3Y · 5Y · 10Y) */}
      {portfolioStocks.length > 0 && (
        <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-cyan-500/40 rounded-xl p-4 sm:p-5 shadow-lg space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Portfolio Multi-Year Long-Term Wealth Compounding Forecast
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  Calculated from Live CMP
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Target wealth projection if you hold your {portfolioStocks.length} positions through 1, 3, 5, and 10-year holding horizons and institutional rebalance cycles.
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="text-[11px] text-slate-400">Current Portfolio Value (at Live CMP): </span>
              <strong className="text-sm sm:text-base font-mono font-bold text-emerald-400 ml-1">
                ₹{currentTotalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </strong>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1-Year Forecast */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">1-Year Horizon</span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                  12-Month Target
                </span>
              </div>
              <div className="text-base sm:text-lg font-bold font-mono text-white mt-1">
                ₹{totalProjected1Y.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs font-mono text-emerald-400 flex items-center justify-between">
                <span>+{upsideTotal1Y}% Growth</span>
                <span className="text-slate-500 text-[10px] font-sans">Index Inflows</span>
              </div>
            </div>

            {/* 3-Year Forecast */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">3-Year Horizon</span>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                  36-Month Target
                </span>
              </div>
              <div className="text-base sm:text-lg font-bold font-mono text-white mt-1">
                ₹{totalProjected3Y.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs font-mono text-emerald-400 flex items-center justify-between">
                <span>+{upsideTotal3Y}% Growth</span>
                <span className="text-slate-500 text-[10px] font-sans">EBITDA Ramp</span>
              </div>
            </div>

            {/* 5-Year Forecast */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">5-Year Horizon</span>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                  60-Month Target
                </span>
              </div>
              <div className="text-base sm:text-lg font-bold font-mono text-white mt-1">
                ₹{totalProjected5Y.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs font-mono text-emerald-400 flex items-center justify-between">
                <span>+{upsideTotal5Y}% Growth</span>
                <span className="text-slate-500 text-[10px] font-sans">Full Capex Growth</span>
              </div>
            </div>

            {/* 10-Year Forecast */}
            <div className="bg-slate-950/70 border border-cyan-500/40 rounded-lg p-3 space-y-1 bg-gradient-to-br from-slate-950 to-cyan-950/20">
              <div className="flex items-center justify-between text-xs">
                <span className="text-cyan-300 font-medium">10-Year Wealth Engine</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                  Decade Compounding
                </span>
              </div>
              <div className="text-base sm:text-lg font-bold font-mono text-cyan-300 mt-1">
                ₹{totalProjected10Y.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs font-mono text-emerald-400 flex items-center justify-between">
                <span>+{upsideTotal10Y}% Growth</span>
                <span className="text-slate-400 text-[10px] font-sans">
                  {currentTotalValue > 0 ? (totalProjected10Y / currentTotalValue).toFixed(1) : '1.0'}x Capital Multiple
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Management Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter Suggestion:</span>
          </span>
          <button
            onClick={() => setFilterAction('all')}
            className={`px-3 py-1 rounded transition-colors ${
              filterAction === 'all'
                ? 'bg-slate-800 text-white font-medium border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Holdings ({portfolioStocks.length})
          </button>
          <button
            onClick={() => setFilterAction('sell')}
            className={`px-3 py-1 rounded transition-colors ${
              filterAction === 'sell'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-medium'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            Sell / Exit Warnings ({vulnerableStocks.length})
          </button>
          <button
            onClick={() => setFilterAction('hold')}
            className={`px-3 py-1 rounded transition-colors ${
              filterAction === 'hold'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            Hold Firm
          </button>
          <button
            onClick={() => setFilterAction('accumulate')}
            className={`px-3 py-1 rounded transition-colors ${
              filterAction === 'accumulate'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-medium'
                : 'text-slate-400 hover:text-teal-300'
            }`}
          >
            Accumulate
          </button>
        </div>

        {portfolioStocks.length > 0 && (
          <button
            onClick={onClearPortfolio}
            className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Holdings List */}
      <div className="space-y-4">
        {portfolioStocks.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-10 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-semibold text-white">Your Portfolio is Clean &amp; Empty</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Add the actual Indian stocks you own in your broker account. Real-time market prices are auto-fetched so you never have to type market prices manually.
            </p>
            <div className="pt-3 flex justify-center gap-3">
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 text-xs font-medium text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded font-sans cursor-pointer"
              >
                Add Your First Stock
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded font-sans cursor-pointer flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Restore from JSON Backup</span>
              </button>
            </div>
          </div>
        ) : filteredPortfolio.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-6 text-center text-xs text-slate-400">
            No portfolio stocks match the selected suggestion filter.
          </div>
        ) : (
          filteredPortfolio.map((stock) => {
            const holdingValue = stock.shares * stock.currentPrice;
            const investedValue = stock.shares * stock.avgBuyPrice;
            const stockPnl = holdingValue - investedValue;
            const stockPnlPercent = investedValue > 0 ? (stockPnl / investedValue) * 100 : 0;
            const isEditing = editingStockId === stock.id;

            return (
              <div
                key={stock.id}
                className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-lg p-4 sm:p-5 transition-all space-y-4"
              >
                {/* Top Row: Symbol, Valid Keys, Action Advice */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-bold font-mono text-white">
                      {stock.symbol}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {stock.name}
                    </span>
                    {stock.nseKey && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        {stock.nseKey}
                      </span>
                    )}
                    {stock.bseKey && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                        {stock.bseKey}
                      </span>
                    )}
                    <span className={`text-[11px] font-sans px-2 py-0.5 rounded border ${getRebalanceStatusBadgeClass(stock.rebalanceStatus)}`}>
                      {stock.rebalanceStatus}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-cyan-400" />
                      Min. 6-Mo Cooling
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {getActionBadge(stock.suggestion)}
                    <button
                      onClick={() => handleStartEdit(stock)}
                      title="Edit shares quantity and purchase price"
                      className="px-2 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3 text-cyan-400" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onRemoveStock(stock.id)}
                      title="Remove from portfolio"
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Real-Time Advisor Suggestion Banner */}
                <div className={`p-3.5 rounded-lg border text-xs sm:text-sm ${
                  stock.suggestion === 'SELL_EXIT_NOW'
                    ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                    : stock.suggestion === 'HOLD_FIRM'
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                }`}>
                  <div className="font-semibold mb-1 flex items-center justify-between">
                    <span>Quantitative Advisor Verdict:</span>
                    <span className="text-[11px] font-mono opacity-80">
                      Target: ₹{stock.targetPrice} · Stop-Loss: ₹{stock.stopLoss}
                    </span>
                  </div>
                  <div className="leading-relaxed opacity-95">
                    {stock.suggestionRationale}
                  </div>
                </div>

                {/* 6-Month Cooling Period & Long-Term Horizon Status */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded bg-slate-950/70 border border-slate-800 text-[11px]">
                  <div className="flex flex-wrap items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="font-semibold text-white">Investment Horizon:</span>
                    <span className="text-cyan-300 font-medium">Minimum 6-Month Cooling Period</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">Intraday noise filtered out · Compounding through semi-annual Nifty 50 review cycles</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                      180-Day Institutional Compounding Window
                    </span>
                  </div>
                </div>

                {/* DUAL-FIELD EDITING PANEL (Shares Quantity & Avg Purchase Price) */}
                {isEditing && (
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-cyan-500/50 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit Quantity &amp; Avg Purchase Price for {stock.symbol}
                      </span>
                      <button
                        onClick={handleCancelEdit}
                        className="text-slate-400 hover:text-white text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-300 mb-1 font-medium">
                          Holding Quantity (Number of shares)
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={editShares}
                          onChange={(e) => setEditShares(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 mb-1 font-medium">
                          Average Purchase / Buy Price (₹ / share)
                        </label>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={editBuyPrice}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                              setEditBuyPrice(val);
                            }
                          }}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(stock.id)}
                        className="px-4 py-1.5 text-xs font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded cursor-pointer transition-colors shadow-sm font-sans"
                      >
                        Save &amp; Recalculate
                      </button>
                    </div>
                  </div>
                )}

                {/* Financial Holdings Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
                    <div className="text-slate-400 text-[11px] flex items-center justify-between">
                      <span>Holding Quantity</span>
                      <button
                        onClick={() => handleStartEdit(stock)}
                        title="Click to edit quantity or avg buy price"
                        className="text-slate-500 hover:text-cyan-300 cursor-pointer p-0.5"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-sm font-bold font-mono text-white mt-1 tabular-nums">
                      {stock.shares} Shares
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-between">
                      <span>Avg Buy: <strong>₹{stock.avgBuyPrice.toFixed(2)}</strong></span>
                      <button
                        onClick={() => handleStartEdit(stock)}
                        className="text-[10px] text-cyan-400 hover:underline cursor-pointer ml-1"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
                    <div className="text-slate-400 text-[11px] flex items-center justify-between">
                      <span>Current Market Price</span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Live Quote
                      </span>
                    </div>
                    <div className="text-sm font-bold font-mono text-white mt-1 tabular-nums">
                      ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`text-[10px] font-mono mt-0.5 ${stock.dayChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stock.dayChangePercent >= 0 ? '+' : ''}{stock.dayChangePercent}% today
                    </div>
                  </div>

                  <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
                    <div className="text-slate-400 text-[11px]">Total Holding Value</div>
                    <div className="text-sm font-bold font-mono text-white mt-1 tabular-nums">
                      ₹{holdingValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Invested: ₹{investedValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
                    <div className="text-slate-400 text-[11px]">Your Unrealized P&amp;L</div>
                    <div className={`text-sm font-bold font-mono mt-1 tabular-nums ${stockPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stockPnl >= 0 ? '+' : ''}₹{stockPnl.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </div>
                    <div className={`text-[10px] font-mono mt-0.5 ${stockPnlPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stockPnlPercent >= 0 ? '+' : ''}{stockPnlPercent.toFixed(2)}% Return
                    </div>
                  </div>
                </div>

                {/* Multi-Year Long-Term Price Predictions & Compounding Targets (1Y, 3Y, 5Y, 10Y) */}
                {(() => {
                  const predictions = stock.predictions && stock.predictions.length > 0
                    ? stock.predictions
                    : calculateHorizonPredictions(
                        resolveRealtimeMarketQuote(stock.symbol || stock.name),
                        stock.currentPrice,
                        stock.shares
                      );

                  return (
                    <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-800/80 pb-2">
                        <div className="flex items-center gap-1.5 font-semibold text-white">
                          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Long-Term Holding Outlook &amp; Compounding Targets (Based on Live CMP ₹{stock.currentPrice.toFixed(2)})</span>
                        </div>
                        <span className="text-[10px] text-cyan-300 font-mono bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                          Hold Horizon: 1, 3, 5, &amp; 10 Years
                        </span>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                        {predictions.map((pred) => (
                          <div
                            key={pred.horizon}
                            className="bg-slate-900/80 p-2.5 rounded border border-slate-800 flex flex-col justify-between space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-slate-300">{pred.label}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                                {pred.horizon}
                              </span>
                            </div>

                            <div>
                              <div className="text-sm font-bold font-mono text-emerald-400">
                                ₹{pred.targetPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </div>
                              <div className="text-[10px] font-mono text-emerald-300/90 mt-0.5 flex items-center justify-between">
                                <span>+{pred.upsidePercent}% Upside</span>
                                <span className="text-slate-400">({pred.cagrPercent}% CAGR)</span>
                              </div>
                            </div>

                            <div className="pt-1 border-t border-slate-800/60 text-[10px] text-slate-400 flex items-center justify-between">
                              <span>Holding Value ({stock.shares} sh):</span>
                              <strong className="text-white font-mono">
                                ₹{pred.projectedHoldingValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                              </strong>
                            </div>

                            <div className="text-[9px] text-slate-500 line-clamp-1 leading-tight" title={pred.thesis}>
                              {pred.thesis}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {stock.notes && (
                  <div className="text-[11px] text-slate-400 bg-slate-950/40 p-2 rounded border border-slate-800/60">
                    <span className="text-slate-500">Your Broker Note: </span>
                    {stock.notes}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Stock Modal - Live Search with Real-Time Price Auto-Quoted */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Add Stock to Portfolio Advisor</h3>
                <p className="text-xs text-slate-400">Search stock to fetch real-time market price automatically</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} noValidate className="space-y-4 text-xs">
              {/* Step 1: Live Search Input */}
              {!selectedStock ? (
                <div className="space-y-2">
                  <label className="block text-slate-300 font-medium">
                    Search Stock through NSE / BSE
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Type stock name or symbol (e.g. Cochin Shipyard, Zomato, Trent, Mazagon, Reliance)..."
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg pl-9 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  {/* Live Suggestions List with Real-Time Prices */}
                  <div className="mt-2 max-h-56 overflow-y-auto space-y-1.5 p-1 bg-slate-950/90 rounded-lg border border-slate-800">
                    {searchResults.length > 0 ? (
                      searchResults.map((item) => (
                        <div
                          key={item.symbol}
                          onClick={() => handleSelectStock(item)}
                          className="p-2.5 rounded hover:bg-slate-800/90 cursor-pointer transition-colors border border-transparent hover:border-slate-700 flex items-center justify-between group"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold font-mono text-white text-xs sm:text-sm group-hover:text-emerald-300">
                                {item.symbol}
                              </span>
                              <span className="text-xs text-slate-300 font-sans">
                                {item.name}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                                {item.nseKey}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                                {item.bseKey}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                              <span>{item.sector}</span>
                              <span>·</span>
                              <span>ISIN: {item.isin}</span>
                            </div>
                          </div>
                          <div className="text-right font-mono text-xs shrink-0 pl-2">
                            <div className="text-white font-bold">₹{item.currentPrice.toFixed(2)}</div>
                            <div className={item.dayChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                              {item.dayChangePercent >= 0 ? '+' : ''}{item.dayChangePercent}%
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        onClick={() => handleSelectCustomQuery(searchQuery)}
                        className="p-3 rounded hover:bg-slate-800 cursor-pointer border border-emerald-500/30 bg-emerald-500/5 text-emerald-300 text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold font-mono">Select "{searchQuery.toUpperCase()}" with Live Quote</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Real-time quote lookup on National Stock Exchange
                          </div>
                        </div>
                        <span className="text-xs underline font-sans">Select Stock &rarr;</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Step 2: Selected Stock Verified Card with Real-Time Price Auto-Quoted */
                <div className="space-y-3">
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-emerald-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold font-mono text-white text-base">
                          {selectedStock.symbol}
                        </span>
                        <span className="text-xs text-slate-300">
                          {selectedStock.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedStock(null)}
                        className="text-xs text-emerald-400 hover:underline cursor-pointer"
                      >
                        Change Stock
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-slate-800">
                      <div className="flex items-center gap-2 text-[11px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          {selectedStock.nseKey}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                          {selectedStock.bseKey}
                        </span>
                      </div>
                      <div className="text-right flex items-center justify-end">
                        {isLoadingQuote ? (
                          <span className="flex items-center gap-1.5 text-xs text-amber-300 font-mono animate-pulse">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                            Fetching live quote...
                          </span>
                        ) : (
                          <>
                            <span className="text-slate-400 text-xs mr-1.5">Live Real-Time Market Price (CMP):</span>
                            <strong className="text-emerald-400 font-mono text-base">
                              ₹{selectedStock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </strong>
                            <span className={`text-[11px] font-mono ml-1.5 ${selectedStock.dayChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              ({selectedStock.dayChangePercent >= 0 ? '+' : ''}{selectedStock.dayChangePercent}%)
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Real-time market price is {isLoadingQuote ? 'loading...' : <>live at <strong>₹{selectedStock.currentPrice.toFixed(2)}</strong></>}. Enter your purchase price or leave blank to use the live CMP.</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Quantity (Number of shares)</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={sharesInput}
                        onChange={(e) => setSharesInput(e.target.value)}
                        placeholder="e.g. 85"
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Your Purchase / Buy Price (₹ / share)</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={buyPriceInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                            setBuyPriceInput(val);
                          }
                        }}
                        placeholder={`e.g. ${selectedStock.currentPrice.toFixed(2)}`}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                      />
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                        <span>Accepts any broker price (e.g. 249.13)</span>
                        <button
                          type="button"
                          onClick={() => setBuyPriceInput(selectedStock.currentPrice.toFixed(2))}
                          className="text-emerald-400 hover:underline cursor-pointer font-mono font-medium"
                        >
                          Use CMP: ₹{selectedStock.currentPrice.toFixed(2)}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-blue-950/40 border border-blue-500/30 text-[11px] text-blue-200 flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Long-Term Compounding:</strong> Stock will be monitored with a <strong>minimum 6-month cooling period</strong>. Intraday fluctuation is ignored to allow semi-annual index rebalancing and passive ETF inflows to unfold.
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Optional Notes / Investment Thesis</label>
                    <input
                      type="text"
                      placeholder="e.g. Bought on Zerodha/Groww for long-term holding"
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="p-2.5 bg-slate-950/70 rounded border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                    <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      Saved permanently in your browser's private local storage.
                    </span>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setSelectedStock(null)}
                      className="px-4 py-2 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-medium text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors font-sans cursor-pointer shadow-sm"
                    >
                      Add to Portfolio Advisor
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
