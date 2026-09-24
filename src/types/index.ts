export type RebalanceTimeline = '15_days' | '1_month' | '2_months';

export type AlertSeverity = 'official_circular' | 'advance_notice' | 'critical_cutoff' | 'high_probability';

export interface StockQuantMetrics {
  currentPrice: number; // in INR
  dailyChangePercent: number;
  marketCapCr: number; // Total MCap in ₹ Crores
  freeFloatMCapCr: number; // Free Float in ₹ Crores
  sixMonthAvgFreeFloatCr: number;
  sixMonthAvgDailyTurnoverCr: number;
  impactCostPercent: number; // Must be <= 0.50%
  alphaPercent: number; // 1-year annualized alpha vs Nifty 50 TRI
  beta: number; // Beta relative to Nifty 50
  growthProbability: number; // 0 to 100%
  foStatus: 'Active' | 'Under Review' | 'Banned' | 'Ineligible';
  tradingFrequencyPercent: number; // e.g. 100%
}

export interface UpcomingInclusionStock {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  currentRankInEligibleUniverse: number; // Rank among non-constituent F&O universe
  projectedNifty50WeightPercent: number;
  estimatedPassiveInflowCr: number; // Estimated inflow from passive Nifty 50 trackers (₹ Cr)
  estimatedPassiveInflowUsdM: number;
  daysToCoverInflow: number; // Inflow / 30-day ADV
  expectedInclusionDate: string; // e.g., "October 2026" or "Semi-Annual Review"
  timeHorizon: 'Next 1 Month';
  criteriaStatus: {
    freeFloatCutoffMet: boolean;
    foEligible: boolean;
    impactCostCompliant: boolean;
    sixMonthTradingHistory: boolean;
  };
  alphaRationale: string;
  growthDriver: string;
  metrics: StockQuantMetrics;
  dayOverDayAlphaDelta: number;
  dayOverDayRankDelta: number;
  probabilityTrend: 'rising' | 'stable' | 'declining';
}

export interface ExclusionDelistingStock {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  currentNifty50Rank: number; // e.g. #48, #49, #50
  currentWeightPercent: number;
  freeFloatMCapCr: number;
  estimatedPassiveOutflowCr: number; // Estimated selling by passive index funds (₹ Cr)
  estimatedPassiveOutflowUsdM: number;
  daysToAbsorbOutflow: number;
  timelineCategory: RebalanceTimeline; // '15_days' | '1_month' | '2_months'
  expectedExclusionDate: string;
  exclusionReason: string;
  vulnerabilityFactor: string;
  likelyReplacementSymbol: string;
  metrics: StockQuantMetrics;
  dayOverDayRankDelta: number; // e.g. -1 means dropped 1 rank
  gapToReplacementCutoffCr: number; // Deficit in ₹ Cr to hold position
}

export interface DeletedStockArchive {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  deletedDate: string;
  replacementSymbol: string;
  replacementName: string;
  exitWeightPercent: number;
  totalOutflowCr: number;
  deletionType: 'Semi-Annual Rebalance' | 'Corporate Action' | 'F&O Exclusion' | 'Scheme of Arrangement';
  circularRef: string;
}

export interface RebalanceAlert {
  id: string;
  timestamp: string;
  title: string;
  circularNumber: string;
  source: 'NSE Indices Ltd' | 'National Stock Exchange (NSE)' | 'Index Maintenance Sub-Committee';
  category: AlertSeverity;
  summary: string;
  stocksImpacted: {
    inclusions?: string[];
    exclusions?: string[];
  };
  effectiveDate: string;
  read: boolean;
  isLiveEvent?: boolean;
}

export interface DailyRebalanceSnapshot {
  date: string;
  nifty50IndexValue: number;
  nifty50DailyChangePercent: number;
  cutoffRank50FreeFloatCr: number; // Free float of the 50th constituent (the threshold line)
  minimumInclusionThresholdCr: number; // 1.5x replacement threshold rule
  totalProjectedInflowCr: number;
  totalProjectedOutflowCr: number;
  highestAlphaStock: string;
  highestProbabilityStock: string;
  immediate15DayExclusionCandidate: string;
}

export type NavTab = 'upcoming' | 'exclusions' | 'deleted' | 'daily' | 'alerts' | 'fo_trends';

export type FOSignalType = 'STRONG_BUY' | 'BUY_ON_DIPS' | 'SELL_SHORT' | 'BOOK_PROFIT_EXIT' | 'NEUTRAL';

export type OITrendType = 'Long Buildup' | 'Short Covering' | 'Short Buildup' | 'Long Unwinding';

export interface FOTrendStock {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  nifty50Category: 'Inclusion Contender' | 'Existing Constituent' | 'Endangered Constituent';
  spotPrice: number;
  futurePrice: number;
  basis: number; // Future price - Spot price (Premium/Discount)
  changePercent: number;
  oiChangePercent: number; // e.g., +14.2%
  oiContracts: number;
  oiTrend: OITrendType;
  pcrRatio: number; // Put-Call ratio
  maxPainStrike: number;
  atmIV: number; // Implied volatility %
  rsi14: number;
  vwap: number;
  isAboveVwap: boolean;
  recommendation: {
    action: FOSignalType;
    confidencePercent: number;
    entryRange: string;
    targetPrice: number;
    stopLoss: number;
    riskRewardRatio: string;
    timeHorizon: 'Intraday / BTST' | 'Positional (1-2 Weeks)' | 'Expiry Swing';
    rationale: string;
    rebalanceImpact: string;
  };
}
