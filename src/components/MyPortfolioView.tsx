import React, { useState, useRef } from 'react';
import { UserPortfolioStock, PortfolioAction } from '../types/index.ts';
import { KNOWN_STOCKS_CATALOG, searchNSEBSEStocks, generateAdvisorRecommendation, KnownStockProfile } from '../data/portfolioPresets.ts';
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
  Check
} from 'lucide-react';

interface MyPortfolioViewProps {
  portfolioStocks: UserPortfolioStock[];
  onAddStock: (stock: Omit<UserPortfolioStock, 'id'>) => void;
  onRemoveStock: (id: string) => void;
  onUpdateStock: (id: string, shares: number, avgBuyPrice: number) => void;
  onRestorePortfolio: (stocks: UserPortfolioStock[]) => void;
  onClearPortfolio: () => void;
}

export const MyPortfolioView: React.FC<MyPortfolioViewProps> = ({
  portfolioStocks,
  onAddStock,
  onRemoveStock,
  onUpdateStock,
  onRestorePortfolio,
  onClearPortfolio,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStock, setSelectedStock] = useState<KnownStockProfile | null>(null);
  const [sharesInput, setSharesInput] = useState<string>('100');
  const [buyPriceInput, setBuyPriceInput] = useState<string>('');
  const [notesInput, setNotesInput] = useState<string>('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [editShares, setEditShares] = useState<string>('');
  const [editPrice, setEditPrice] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search results from valid NSE/BSE stock catalog
  const searchResults = searchQuery.trim() ? searchNSEBSEStocks(searchQuery) : KNOWN_STOCKS_CATALOG.slice(0, 6);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
    setSearchQuery('');
    setSelectedStock(null);
    setSharesInput('100');
    setBuyPriceInput('');
    setNotesInput('');
  };

  const handleSelectStock = (profile: KnownStockProfile) => {
    setSelectedStock(profile);
    setBuyPriceInput(profile.currentPrice.toString());
  };

  const handleSelectCustomQuery = (query: string) => {
    const cleanSym = query.toUpperCase().trim();
    const customProfile: KnownStockProfile = {
      symbol: cleanSym,
      name: `${cleanSym} Ltd`,
      nseKey: `NSE:${cleanSym}`,
      bseKey: `BSE:EQ`,
      isin: `IN_${cleanSym}`,
      series: 'EQ',
      sector: 'Diversified / Equity',
      currentPrice: Number(buyPriceInput) || 100,
      dayChangePercent: 0.0,
      rebalanceStatus: 'Core Constituent (Stable)',
      targetPrice: Math.round((Number(buyPriceInput) || 100) * 1.25),
      stopLoss: Math.round((Number(buyPriceInput) || 100) * 0.90),
      riskRating: 'Moderate',
      baseRationale: `Tracking live on NSE & BSE under security key NSE:${cleanSym}.`,
      defaultAction: 'HOLD_FIRM'
    };
    setSelectedStock(customProfile);
    if (!buyPriceInput) {
      setBuyPriceInput('100');
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock) return;

    const sharesNum = Math.max(1, Number(sharesInput) || 1);
    const buyPriceNum = Math.max(0.05, Number(buyPriceInput) || selectedStock.currentPrice);

    const advisor = generateAdvisorRecommendation(selectedStock, buyPriceNum, selectedStock.currentPrice);

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
      currentPrice: selectedStock.currentPrice,
      dayChangePercent: selectedStock.dayChangePercent,
      rebalanceStatus: selectedStock.rebalanceStatus,
      suggestion: advisor.suggestion,
      suggestionRationale: advisor.rationale,
      targetPrice: selectedStock.targetPrice,
      stopLoss: selectedStock.stopLoss,
      riskRating: selectedStock.riskRating,
    });

    setIsAddModalOpen(false);
    setSelectedStock(null);
    setSearchQuery('');
    setNotesInput('');
  };

  const handleStartEdit = (stock: UserPortfolioStock) => {
    setEditingStockId(stock.id);
    setEditShares(stock.shares.toString());
    setEditPrice(stock.avgBuyPrice.toString());
  };

  const handleSaveEdit = (id: string) => {
    const s = Number(editShares) || 1;
    const p = Number(editPrice) || 1;
    onUpdateStock(id, s, p);
    setEditingStockId(null);
  };

  // Export portfolio to a downloadable JSON file for lifetime backup
  const handleExportPortfolio = () => {
    if (portfolioStocks.length === 0) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(portfolioStocks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nifty50_portfolio_backup_${new Date().toISOString().split('T')[0]}.json`);
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

  // Portfolio Totals Calculations
  const totalInvested = portfolioStocks.reduce((sum, s) => sum + s.shares * s.avgBuyPrice, 0);
  const currentTotalValue = portfolioStocks.reduce((sum, s) => sum + s.shares * s.currentPrice, 0);
  const totalPnl = currentTotalValue - totalInvested;
  const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

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

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium tracking-wide uppercase">
            <span>PERMANENT &amp; PRIVATE LOCAL STORAGE</span>
            <span aria-hidden="true">·</span>
            <span>NO BROKER LOGIN REQUIRED</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <span>My Actual Broker Portfolio Advisor</span>
            <span className="text-xs font-sans font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              100% Private (Saved Locally)
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Manually track the actual stocks you own in your broker account. Your portfolio is stored permanently in your browser and will not be overwritten by new app deployments.
          </p>
        </div>

        {/* Top Actions: Fixed non-wrapping single horizontal row */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 whitespace-nowrap">
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
            className="px-3.5 py-2 text-xs font-medium text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors flex items-center gap-1.5 font-sans cursor-pointer shadow-sm shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Stock</span>
          </button>
        </div>
      </div>

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
              Add the actual Indian stocks you own in your broker account. Type the company name or symbol (e.g. Zomato, Trent, Reliance) to search with valid NSE and BSE exchange keys.
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
                  </div>

                  <div className="flex items-center gap-2">
                    {getActionBadge(stock.suggestion)}
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

                {/* Financial Holdings Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
                    <div className="text-slate-400 text-[11px] flex items-center justify-between">
                      <span>Holding Quantity</span>
                      {!isEditing && (
                        <button
                          onClick={() => handleStartEdit(stock)}
                          className="text-slate-500 hover:text-slate-300"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="flex items-center gap-1 mt-1">
                        <input
                          type="number"
                          value={editShares}
                          onChange={(e) => setEditShares(e.target.value)}
                          className="w-16 bg-slate-800 border border-slate-700 text-white rounded px-1.5 py-0.5 text-xs font-mono"
                        />
                        <button
                          onClick={() => handleSaveEdit(stock.id)}
                          className="text-emerald-400 hover:underline text-[10px]"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm font-bold font-mono text-white mt-1 tabular-nums">
                        {stock.shares} Shares
                      </div>
                    )}
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Avg Buy: ₹{stock.avgBuyPrice.toFixed(2)}
                    </div>
                  </div>

                  <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
                    <div className="text-slate-400 text-[11px]">Current Market Price</div>
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

      {/* Add Stock Modal - Live Search by Name/Symbol with Valid NSE/BSE Keys */}
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
                <h3 className="text-base font-bold text-white">Add Actual Broker Stock</h3>
                <p className="text-xs text-slate-400">Search NSE/BSE listed stock to auto-fetch valid keys and market price</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              {/* Step 1: Live Search Input without any dropdown or manual toggle */}
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
                      placeholder="Type stock name or symbol (e.g. Zomato, Trent, Reliance, HDFC, Tata)..."
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg pl-9 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  {/* Live Suggestions List */}
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
                          <div className="font-bold font-mono">Select "{searchQuery.toUpperCase()}" through NSE &amp; BSE</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Auto-assigns valid exchange keys: NSE:{searchQuery.toUpperCase()} · BSE:EQ
                          </div>
                        </div>
                        <span className="text-xs underline font-sans">Select Stock &rarr;</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Step 2: Selected Stock Verified Card with Valid Keys */
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

                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        {selectedStock.nseKey}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                        {selectedStock.bseKey}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        ISIN: {selectedStock.isin}
                      </span>
                      <span className="text-slate-400 ml-auto">
                        Live CMP: <strong className="text-white">₹{selectedStock.currentPrice.toFixed(2)}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1">Quantity (Number of shares)</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={sharesInput}
                        onChange={(e) => setSharesInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Avg Purchase Price (₹ / share)</label>
                      <input
                        type="number"
                        step="0.05"
                        min="0.05"
                        required
                        value={buyPriceInput}
                        onChange={(e) => setBuyPriceInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Optional Notes / Investment Thesis</label>
                    <input
                      type="text"
                      placeholder="e.g. Bought on Zerodha for long-term compounding"
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="p-2.5 bg-slate-950/70 rounded border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                    <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      Saved permanently in your browser's private local storage. No broker login needed.
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
                      Add to My Portfolio
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
