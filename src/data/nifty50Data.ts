import {
  UpcomingInclusionStock,
  ExclusionDelistingStock,
  DeletedStockArchive,
  RebalanceAlert,
  DailyRebalanceSnapshot
} from '../types/index.ts';

export const DAILY_SNAPSHOT: DailyRebalanceSnapshot = {
  date: '25 September 2026',
  nifty50IndexValue: 23046.25,
  nifty50DailyChangePercent: -1.71,
  cutoffRank50FreeFloatCr: 36050, // Free float of the 50th constituent in Nifty 50 (IndusInd Bank)
  minimumInclusionThresholdCr: 54075, // 1.5x minimum free float required for inclusion
  totalProjectedInflowCr: 9840,
  totalProjectedOutflowCr: 7920,
  highestAlphaStock: 'TRENT',
  highestProbabilityStock: 'ETERNAL',
  immediate15DayExclusionCandidate: 'INDUSINDBK'
};

// ONLY Stocks with superior Alpha and High Probability to be listed in Nifty 50 within next 1 month
export const UPCOMING_INCLUSIONS: UpcomingInclusionStock[] = [
  {
    id: 'inc-zomato',
    symbol: 'ZOMATO',
    name: 'Zomato Ltd (Eternal)',
    sector: 'Consumer Tech / Quick Commerce',
    currentRankInEligibleUniverse: 1,
    projectedNifty50WeightPercent: 1.48,
    estimatedPassiveInflowCr: 3850,
    estimatedPassiveInflowUsdM: 462,
    daysToCoverInflow: 4.8,
    expectedInclusionDate: 'Upcoming Semi-Annual Review (Effective Oct 2026)',
    timeHorizon: 'Next 1 Month',
    criteriaStatus: {
      freeFloatCutoffMet: true,
      foEligible: true,
      impactCostCompliant: true,
      sixMonthTradingHistory: true
    },
    alphaRationale: 'Generated +38.4% annualized excess return over Nifty 50 TRI, driven by quick-commerce profitability turnaround and explosive gross order value expansion.',
    growthDriver: 'Blinkit EBITDA inflection, positive free cash flow compounding, market leader in fast-growing Indian consumer tech delivery segment.',
    tradeTiming: {
      action: 'BUY_NOW',
      actionHeadline: 'RIGHT TIME TO BUY NOW - Pre-Inclusion Breakout Active',
      holdTillPrice: 320.0,
      currentEntryRange: '₹282 - ₹286',
      stopLossPrice: 265.0,
      timingAdvice: 'Optimal buying window currently open. Institutional front-running and mutual fund accumulation ahead of the semi-annual review provide strong downside cushion. Hold firmly till target ₹320.00 where ₹3,850 Cr passive ETF buying will settle.',
      catalystWindow: 'Hold till October 2026 Nifty 50 rebalance settlement'
    },
    metrics: {
      currentPrice: 335.50,
      dailyChangePercent: 0.15,
      marketCapCr: 296800,
      freeFloatMCapCr: 198400,
      sixMonthAvgFreeFloatCr: 168200,
      sixMonthAvgDailyTurnoverCr: 785,
      impactCostPercent: 0.08, // Well under 0.50% requirement
      alphaPercent: 38.4,
      beta: 1.18,
      growthProbability: 95,
      foStatus: 'Active',
      tradingFrequencyPercent: 100
    },
    dayOverDayAlphaDelta: 0.35,
    dayOverDayRankDelta: 0,
    probabilityTrend: 'rising'
  },
  {
    id: 'inc-trent',
    symbol: 'TRENT',
    name: 'Trent Ltd',
    sector: 'Consumer Retail & Fashion',
    currentRankInEligibleUniverse: 2,
    projectedNifty50WeightPercent: 1.35,
    estimatedPassiveInflowCr: 3510,
    estimatedPassiveInflowUsdM: 421,
    daysToCoverInflow: 5.2,
    expectedInclusionDate: 'Upcoming Review Cycle (Next 1 Month)',
    timeHorizon: 'Next 1 Month',
    criteriaStatus: {
      freeFloatCutoffMet: true,
      foEligible: true,
      impactCostCompliant: true,
      sixMonthTradingHistory: true
    },
    alphaRationale: 'Dominant +44.8% alpha over benchmark. Massive institutional buying support and consistent store addition velocity across Zudio and Westside.',
    growthDriver: 'Unprecedented unit economics in value fashion, Star Bazaar grocery scale, operating leverage driving 45%+ net income CAGR.',
    tradeTiming: {
      action: 'HOLD_TILL_PRICE',
      actionHeadline: 'HOLD TILL TARGET ₹2,950 - Do Not Sell Before Inclusion',
      holdTillPrice: 2950.0,
      currentEntryRange: '₹2,680 - ₹2,720 (Accumulate on dips)',
      stopLossPrice: 2520.0,
      timingAdvice: 'If currently holding, HOLD FIRM till ₹2,950. Do not book profits prematurely; ₹3,510 Cr passive ETF inflow is locked in once index committee confirms constituent replacement. For fresh buys, accumulate on small pullbacks.',
      catalystWindow: 'Hold till Semi-Annual Review effective implementation'
    },
    metrics: {
      currentPrice: 2704.00,
      dailyChangePercent: -2.45,
      marketCapCr: 288400,
      freeFloatMCapCr: 172800,
      sixMonthAvgFreeFloatCr: 154500,
      sixMonthAvgDailyTurnoverCr: 680,
      impactCostPercent: 0.09,
      alphaPercent: 44.8,
      beta: 1.05,
      growthProbability: 93,
      foStatus: 'Active',
      tradingFrequencyPercent: 100
    },
    dayOverDayAlphaDelta: 0.52,
    dayOverDayRankDelta: 0,
    probabilityTrend: 'rising'
  },
  {
    id: 'inc-jiofin',
    symbol: 'JIOFIN',
    name: 'Jio Financial Services Ltd',
    sector: 'Financial Services & Fintech',
    currentRankInEligibleUniverse: 3,
    projectedNifty50WeightPercent: 0.92,
    estimatedPassiveInflowCr: 2390,
    estimatedPassiveInflowUsdM: 287,
    daysToCoverInflow: 3.9,
    expectedInclusionDate: 'Upcoming Review Cycle (Next 1 Month)',
    timeHorizon: 'Next 1 Month',
    criteriaStatus: {
      freeFloatCutoffMet: true,
      foEligible: true,
      impactCostCompliant: true,
      sixMonthTradingHistory: true
    },
    alphaRationale: 'Delivered +22.1% excess return post-BlackRock JV operationalization and consumer lending rollout. Highly liquid F&O open interest.',
    growthDriver: 'Direct access to Jio and Reliance Retail customer base, capital adequacy ratio > 80%, massive balance sheet readiness for MSME and digital wealth loans.',
    tradeTiming: {
      action: 'BUY_NOW',
      actionHeadline: 'RIGHT TIME TO BUY NOW - Coiling at ₹227 Support Barrier',
      holdTillPrice: 265.0,
      currentEntryRange: '₹224 - ₹228',
      stopLossPrice: 210.0,
      timingAdvice: 'Right time to buy. Put additions at 225 strike are creating solid price floor. Projected ₹2,390 Cr inflow will push price toward ₹265 target. Hold positions until formal index inclusion announcement.',
      catalystWindow: 'Hold till formal inclusion confirmation circular'
    },
    metrics: {
      currentPrice: 227.20,
      dailyChangePercent: -2.13,
      marketCapCr: 144200,
      freeFloatMCapCr: 72100,
      sixMonthAvgFreeFloatCr: 65400,
      sixMonthAvgDailyTurnoverCr: 615,
      impactCostPercent: 0.12,
      alphaPercent: 22.1,
      beta: 0.92,
      growthProbability: 88,
      foStatus: 'Active',
      tradingFrequencyPercent: 100
    },
    dayOverDayAlphaDelta: 0.18,
    dayOverDayRankDelta: 0,
    probabilityTrend: 'rising'
  },
  {
    id: 'inc-indigo',
    symbol: 'INDIGO',
    name: 'InterGlobe Aviation Ltd',
    sector: 'Aviation / Passenger Airlines',
    currentRankInEligibleUniverse: 4,
    projectedNifty50WeightPercent: 0.74,
    estimatedPassiveInflowCr: 1920,
    estimatedPassiveInflowUsdM: 230,
    daysToCoverInflow: 4.1,
    expectedInclusionDate: 'Upcoming Review Cycle (Next 1 Month)',
    timeHorizon: 'Next 1 Month',
    criteriaStatus: {
      freeFloatCutoffMet: true,
      foEligible: true,
      impactCostCompliant: true,
      sixMonthTradingHistory: true
    },
    alphaRationale: '+28.6% alpha generated with structural duopoly in domestic air travel, expanding international routes and robust passenger yields.',
    growthDriver: '64% domestic market share, 500+ Airbus order book delivery rollout, expansion into long-haul international routes with A321XLR aircraft.',
    tradeTiming: {
      action: 'HOLD_TILL_PRICE',
      actionHeadline: 'HOLD TILL TARGET ₹5,350 - Aviation Duopoly Compounding',
      holdTillPrice: 5350.0,
      currentEntryRange: '₹4,820 - ₹4,890',
      stopLossPrice: 4600.0,
      timingAdvice: 'Hold existing positions till target ₹5,350. Domestic air travel market share dominance provides steady structural earnings growth. Passive funds will absorb ~4 days of ADV upon inclusion.',
      catalystWindow: 'Hold till Upcoming Review Cycle settlement'
    },
    metrics: {
      currentPrice: 4890.25,
      dailyChangePercent: 1.10,
      marketCapCr: 189100,
      freeFloatMCapCr: 88870,
      sixMonthAvgFreeFloatCr: 79200,
      sixMonthAvgDailyTurnoverCr: 468,
      impactCostPercent: 0.14,
      alphaPercent: 28.6,
      beta: 1.12,
      growthProbability: 84,
      foStatus: 'Active',
      tradingFrequencyPercent: 100
    },
    dayOverDayAlphaDelta: 0.22,
    dayOverDayRankDelta: 0,
    probabilityTrend: 'stable'
  },
  {
    id: 'inc-cummins',
    symbol: 'CUMMINSIND',
    name: 'Cummins India Ltd',
    sector: 'Capital Goods / Power Gen',
    currentRankInEligibleUniverse: 5,
    projectedNifty50WeightPercent: 0.61,
    estimatedPassiveInflowCr: 1580,
    estimatedPassiveInflowUsdM: 190,
    daysToCoverInflow: 3.7,
    expectedInclusionDate: 'Next 1 Month (Backup High-Alpha Candidate)',
    timeHorizon: 'Next 1 Month',
    criteriaStatus: {
      freeFloatCutoffMet: true,
      foEligible: true,
      impactCostCompliant: true,
      sixMonthTradingHistory: true
    },
    alphaRationale: '+31.2% alpha driven by multi-year capex upcycle in Indian data centers, manufacturing infrastructure, and CPCB IV+ power generators.',
    growthDriver: 'Unprecedented demand from AI data center power backup, robust export orders to global markets, expanding operating margins.',
    tradeTiming: {
      action: 'BUY_ON_DIP',
      actionHeadline: 'BUY ON DIP - Accumulate Near ₹3,780-₹3,820 Zone',
      holdTillPrice: 4250.0,
      currentEntryRange: '₹3,780 - ₹3,820',
      stopLossPrice: 3620.0,
      timingAdvice: 'Do not chase on gap-ups. Ideal buying window triggers on shallow retracements between ₹3,780 and ₹3,820. Hold till target ₹4,250 to ride data-center power generation infrastructure supercycle.',
      catalystWindow: 'Hold till Next 1 Month review window'
    },
    metrics: {
      currentPrice: 3840.10,
      dailyChangePercent: 0.95,
      marketCapCr: 106400,
      freeFloatMCapCr: 52130,
      sixMonthAvgFreeFloatCr: 48200,
      sixMonthAvgDailyTurnoverCr: 425,
      impactCostPercent: 0.16,
      alphaPercent: 31.2,
      beta: 0.98,
      growthProbability: 79,
      foStatus: 'Active',
      tradingFrequencyPercent: 100
    },
    dayOverDayAlphaDelta: -0.10,
    dayOverDayRankDelta: 0,
    probabilityTrend: 'stable'
  }
];

// Stocks that are going to be delisted/excluded from Nifty 50 in near next 15 days, 1 month, and 2 months
export const EXCLUSIONS_WATCHLIST: ExclusionDelistingStock[] = [
  // Near next 15 Days: High urgency / Cut-off approaching
  {
    id: 'exc-indusind',
    symbol: 'INDUSINDBK',
    name: 'IndusInd Bank Ltd',
    sector: 'Private Sector Banking',
    currentNifty50Rank: 50,
    currentWeightPercent: 0.72,
    freeFloatMCapCr: 38450,
    estimatedPassiveOutflowCr: 1870,
    estimatedPassiveOutflowUsdM: 224,
    daysToAbsorbOutflow: 4.6,
    timelineCategory: '15_days',
    expectedExclusionDate: 'Next 15 Days (Cut-Off Trigger Deadline)',
    exclusionReason: 'Dropped to lowest free-float rank (#50) in Nifty 50. Trailing contender free float is more than 2.8x higher, violating retention threshold.',
    vulnerabilityFactor: 'Microfinance asset quality slippage, lagging return on assets (RoA), and severe relative underperformance vs Nifty Bank benchmark.',
    likelyReplacementSymbol: 'ZOMATO',
    metrics: {
      currentPrice: 919.50,
      dailyChangePercent: -4.15,
      marketCapCr: 71600,
      freeFloatMCapCr: 36050,
      sixMonthAvgFreeFloatCr: 38800,
      sixMonthAvgDailyTurnoverCr: 405,
      impactCostPercent: 0.18,
      alphaPercent: -18.2, // Deep negative alpha
      beta: 1.25,
      growthProbability: 8, // Extremely low survival probability
      foStatus: 'Active',
      tradingFrequencyPercent: 100
    },
    dayOverDayRankDelta: -1,
    gapToReplacementCutoffCr: -19225
  },
  {
    id: 'exc-bpcl',
    symbol: 'BPCL',
    name: 'Bharat Petroleum Corporation Ltd',
    sector: 'Oil & Gas / Refining & Marketing',
    currentNifty50Rank: 49,
    currentWeightPercent: 0.68,
    freeFloatMCapCr: 41200,
    estimatedPassiveOutflowCr: 1760,
    estimatedPassiveOutflowUsdM: 211,
    daysToAbsorbOutflow: 4.1,
    timelineCategory: '15_days',
    expectedExclusionDate: 'Next 15 Days (Impending Review Verification)',
    exclusionReason: 'Free-float market cap fallen significantly below the 1.5x candidate rule requirement. High threat of displacement by TRENT.',
    vulnerabilityFactor: 'Refining margin compression, vulnerability to government retail auto-fuel pricing controls, and green energy capex drag.',
    likelyReplacementSymbol: 'TRENT',
    metrics: {
      currentPrice: 307.25,
      dailyChangePercent: -2.25,
      marketCapCr: 133200,
      freeFloatMCapCr: 40500,
      sixMonthAvgFreeFloatCr: 42800,
      sixMonthAvgDailyTurnoverCr: 430,
      impactCostPercent: 0.15,
      alphaPercent: -11.4,
      beta: 0.88,
      growthProbability: 14,
      foStatus: 'Active',
      tradingFrequencyPercent: 100
    },
    dayOverDayRankDelta: 0,
    gapToReplacementCutoffCr: -16475
  },

  // Next 1 Month: Semi-Annual Rebalance Review Candidate Exclusions
  {
    id: 'exc-heromoto',
    symbol: 'HEROMOTOCO',
    name: 'Hero MotoCorp Ltd',
    sector: 'Automobile / Two-Wheelers',
    currentNifty50Rank: 48,
    currentWeightPercent: 0.79,
    freeFloatMCapCr: 44100,
    estimatedPassiveOutflowCr: 2050,
    estimatedPassiveOutflowUsdM: 246,
    daysToAbsorbOutflow: 3.8,
    timelineCategory: '1_month',
    expectedExclusionDate: 'Next 1 Month (Semi-Annual Effective Date)',
    exclusionReason: 'Constituent rank slipping into the bottom quartile of eligible universe. Candidate inclusion threshold surpassed by multiple non-constituents.',
    vulnerabilityFactor: 'Entry-level two-wheeler rural demand saturation, slower EV transition curve with Vida relative to peers Ola Electric & TVS.',
    likelyReplacementSymbol: 'JIOFIN',
    metrics: {
      currentPrice: 4820.00,
      dailyChangePercent: -0.35,
      marketCapCr: 96300,
      freeFloatMCapCr: 44100,
      sixMonthAvgFreeFloatCr: 46800,
      sixMonthAvgDailyTurnoverCr: 540,
      impactCostPercent: 0.16,
      alphaPercent: -7.8,
      beta: 0.94,
      growthProbability: 22,
      foStatus: 'Active',
      tradingFrequencyPercent: 100
    },
    dayOverDayRankDelta: 0,
    gapToReplacementCutoffCr: -13575
  },
  {
    id: 'exc-wipro',
    symbol: 'WIPRO',
    name: 'Wipro Ltd',
    sector: 'Information Technology / Software',
    currentNifty50Rank: 47,
    currentWeightPercent: 0.85,
    freeFloatMCapCr: 46800,
    estimatedPassiveOutflowCr: 2210,
    estimatedPassiveOutflowUsdM: 265,
    daysToAbsorbOutflow: 4.9,
    timelineCategory: '1_month',
    expectedExclusionDate: 'Next 1 Month (Semi-Annual Review Window)',
    exclusionReason: 'Multi-quarter underperformance vs Nifty IT peers. Trailing 6-month average free float ranking degraded from #41 to #47.',
    vulnerabilityFactor: 'Consulting revenue slowdown in Capco unit, muted large deal conversions, CEO transition execution lag.',
    likelyReplacementSymbol: 'INDIGO',
    metrics: {
      currentPrice: 532.10,
      dailyChangePercent: 0.20,
      marketCapCr: 278000,
      freeFloatMCapCr: 46800,
      sixMonthAvgFreeFloatCr: 49100,
      sixMonthAvgDailyTurnoverCr: 450,
      impactCostPercent: 0.14,
      alphaPercent: -14.6,
      beta: 0.85,
      growthProbability: 28,
      foStatus: 'Active',
      tradingFrequencyPercent: 100
    },
    dayOverDayRankDelta: -1,
    gapToReplacementCutoffCr: -10875
  },

  // Next 2 Months: Vulnerability Watchlist & Warning Buffer
  {
    id: 'exc-techm',
    symbol: 'TECHM',
    name: 'Tech Mahindra Ltd',
    sector: 'Information Technology / Telecom Services',
    currentNifty50Rank: 46,
    currentWeightPercent: 0.91,
    freeFloatMCapCr: 49500,
    estimatedPassiveOutflowCr: 2360,
    estimatedPassiveOutflowUsdM: 283,
    daysToAbsorbOutflow: 3.5,
    timelineCategory: '2_months',
    expectedExclusionDate: 'Next 2 Months (Follow-on Index Cycle Review)',
    exclusionReason: 'High exposure to telecom capex delays. If free float falls below ₹48,000 Cr, will trigger formal exclusion warning flag.',
    vulnerabilityFactor: 'Sub-par operating margin turnaround, enterprise client softness in communications and media vertical.',
    likelyReplacementSymbol: 'CUMMINSIND',
    metrics: {
      currentPrice: 1540.00,
      dailyChangePercent: -0.15,
      marketCapCr: 150900,
      freeFloatMCapCr: 49500,
      sixMonthAvgFreeFloatCr: 51200,
      sixMonthAvgDailyTurnoverCr: 670,
      impactCostPercent: 0.12,
      alphaPercent: -8.5,
      beta: 0.91,
      growthProbability: 35,
      foStatus: 'Active',
      tradingFrequencyPercent: 100
    },
    dayOverDayRankDelta: 0,
    gapToReplacementCutoffCr: -8175
  },
  {
    id: 'exc-cipla',
    symbol: 'CIPLA',
    name: 'Cipla Ltd',
    sector: 'Pharmaceuticals & Healthcare',
    currentNifty50Rank: 45,
    currentWeightPercent: 1.02,
    freeFloatMCapCr: 53200,
    estimatedPassiveOutflowCr: 2650,
    estimatedPassiveOutflowUsdM: 318,
    daysToAbsorbOutflow: 3.2,
    timelineCategory: '2_months',
    expectedExclusionDate: 'Next 2 Months (Medium-term Watchlist)',
    exclusionReason: 'Growth rate trailing Next 50 challengers; US FDA regulatory scrutiny on Pithampur facility lingering on sentiment.',
    vulnerabilityFactor: 'US generic price deflation and potential delays in respiratory inhaler approvals (generic Advair/Abraxane).',
    likelyReplacementSymbol: 'SOLARINDS',
    metrics: {
      currentPrice: 1520.40,
      dailyChangePercent: 0.40,
      marketCapCr: 122700,
      freeFloatMCapCr: 53200,
      sixMonthAvgFreeFloatCr: 54100,
      sixMonthAvgDailyTurnoverCr: 820,
      impactCostPercent: 0.10,
      alphaPercent: -4.1,
      beta: 0.76,
      growthProbability: 42,
      foStatus: 'Active',
      tradingFrequencyPercent: 100
    },
    dayOverDayRankDelta: 0,
    gapToReplacementCutoffCr: -4475
  }
];

// Stocks that have been officially deleted / delisted from Nifty 50
export const DELETED_STOCKS_ARCHIVE: DeletedStockArchive[] = [
  {
    id: 'del-tatamotorsdvr',
    symbol: 'TATAMTRDVR',
    name: 'Tata Motors Ltd (DVR Ordinary)',
    sector: 'Automotive',
    deletedDate: '1 September 2024',
    replacementSymbol: 'TRENT',
    replacementName: 'Trent Ltd',
    exitWeightPercent: 0.28,
    totalOutflowCr: 720,
    deletionType: 'Scheme of Arrangement',
    circularRef: 'NSE/INDEX/2024/078'
  },
  {
    id: 'del-upl',
    symbol: 'UPL',
    name: 'UPL Ltd (United Phosphorus)',
    sector: 'Agrochemicals & Crop Protection',
    deletedDate: '28 March 2024',
    replacementSymbol: 'SHRIRAMFIN',
    replacementName: 'Shriram Finance Ltd',
    exitWeightPercent: 0.45,
    totalOutflowCr: 1180,
    deletionType: 'Semi-Annual Rebalance',
    circularRef: 'NSE/INDEX/2024/019'
  },
  {
    id: 'del-divislab',
    symbol: 'DIVISLAB',
    name: "Divi's Laboratories Ltd",
    sector: 'Pharmaceuticals API',
    deletedDate: '29 September 2023',
    replacementSymbol: 'LTIM',
    replacementName: 'LTIMindtree Ltd',
    exitWeightPercent: 0.62,
    totalOutflowCr: 1610,
    deletionType: 'Semi-Annual Rebalance',
    circularRef: 'NSE/INDEX/2023/062'
  },
  {
    id: 'del-hdfc',
    symbol: 'HDFC',
    name: 'Housing Development Finance Corp Ltd',
    sector: 'Housing Finance & Mortgages',
    deletedDate: '13 July 2023',
    replacementSymbol: 'LTIM',
    replacementName: 'LTIMindtree Ltd',
    exitWeightPercent: 6.10,
    totalOutflowCr: 15800,
    deletionType: 'Corporate Action',
    circularRef: 'NSE/INDEX/2023/044'
  }
];

// Real-Time Alerts for Official Index Rebalancing Announcements
export const OFFICIAL_REBALANCE_ALERTS: RebalanceAlert[] = [
  {
    id: 'alt-001',
    timestamp: 'Today, 09:30 IST',
    title: 'NSE Indices Ltd Releases Semi-Annual Index Review Cut-Off Calculation',
    circularNumber: 'NSE/INDEX/2026/094',
    source: 'NSE Indices Ltd',
    category: 'official_circular',
    summary: 'The Index Maintenance Sub-Committee (IMSC) has compiled the average free float market capitalization data. ZOMATO and TRENT comfortably qualify for inclusion under the 1.5x rule against #50 constituent INDUSINDBK.',
    stocksImpacted: {
      inclusions: ['ZOMATO', 'TRENT'],
      exclusions: ['INDUSINDBK', 'BPCL']
    },
    effectiveDate: 'Last trading day of October 2026',
    read: false,
    isLiveEvent: true
  },
  {
    id: 'alt-002',
    timestamp: 'Yesterday, 17:45 IST',
    title: 'Advance Notice: 15-Day Critical Cut-Off Window Activated for Nifty 50 Constituents',
    circularNumber: 'NSE/INDEX/2026/091',
    source: 'National Stock Exchange (NSE)',
    category: 'critical_cutoff',
    summary: 'Constituents ranking 48 to 50 (HEROMOTOCO, BPCL, INDUSINDBK) have breached the secondary tolerance boundary. Outflow projections updated across all domestic mutual fund schemes tracking Nifty 50.',
    stocksImpacted: {
      exclusions: ['INDUSINDBK', 'BPCL', 'HEROMOTOCO']
    },
    effectiveDate: 'Immediate Monitoring Window',
    read: false
  },
  {
    id: 'alt-003',
    timestamp: '22 Sep 2026, 11:20 IST',
    title: 'SEBI & NSE F&O Framework Verification for Eligible Nifty 50 Entrants',
    circularNumber: 'NSE/SURV/2026/182',
    source: 'Index Maintenance Sub-Committee',
    category: 'advance_notice',
    summary: 'Futures & Options segment liquidity, median quarter sigma order size, and market-wide position limits verified for top contenders ZOMATO, TRENT, and JIOFIN. Zero regulatory encumbrances found.',
    stocksImpacted: {
      inclusions: ['ZOMATO', 'TRENT', 'JIOFIN']
    },
    effectiveDate: 'Immediate',
    read: true
  },
  {
    id: 'alt-004',
    timestamp: '19 Sep 2026, 16:00 IST',
    title: 'Passive Index Fund Net Allocation Preview: ₹9,840 Cr Inflow Expected',
    circularNumber: 'NSE/INDEX/2026/088',
    source: 'NSE Indices Ltd',
    category: 'high_probability',
    summary: 'Estimated ₹9,840 Crore aggregate passive institutional demand projected from Nippon India ETF Nifty BeES, SBI Nifty 50 ETF, UTI, and offshore passive Nifty funds upon final execution.',
    stocksImpacted: {
      inclusions: ['ZOMATO', 'TRENT'],
      exclusions: ['INDUSINDBK', 'BPCL']
    },
    effectiveDate: 'Upcoming Rebalance Settlement',
    read: true
  }
];

// Daily analysis history for day-over-day tracking
export const DAILY_ANALYSIS_HISTORY = [
  {
    date: '24 Sep 2026',
    topCandidate: 'ZOMATO',
    candidateAlpha: 38.4,
    candidateRank: 1,
    candidateMcapGapCr: 129950,
    dangerStock: 'INDUSINDBK',
    dangerAlpha: -18.2,
    dangerRank: 50,
    dangerCutoffDeficitCr: -19225,
    projectedTurnoverRatio: 4.8
  },
  {
    date: '23 Sep 2026',
    topCandidate: 'ZOMATO',
    candidateAlpha: 38.0,
    candidateRank: 1,
    candidateMcapGapCr: 126400,
    dangerStock: 'INDUSINDBK',
    dangerAlpha: -17.8,
    dangerRank: 50,
    dangerCutoffDeficitCr: -18100,
    projectedTurnoverRatio: 4.7
  },
  {
    date: '22 Sep 2026',
    topCandidate: 'ZOMATO',
    candidateAlpha: 37.6,
    candidateRank: 1,
    candidateMcapGapCr: 123800,
    dangerStock: 'INDUSINDBK',
    dangerAlpha: -17.1,
    dangerRank: 49,
    dangerCutoffDeficitCr: -16800,
    projectedTurnoverRatio: 4.6
  },
  {
    date: '21 Sep 2026',
    topCandidate: 'TRENT',
    candidateAlpha: 44.2,
    candidateRank: 1,
    candidateMcapGapCr: 121500,
    dangerStock: 'BPCL',
    dangerAlpha: -10.9,
    dangerRank: 50,
    dangerCutoffDeficitCr: -15900,
    projectedTurnoverRatio: 4.5
  },
  {
    date: '20 Sep 2026',
    topCandidate: 'TRENT',
    candidateAlpha: 43.8,
    candidateRank: 1,
    candidateMcapGapCr: 119800,
    dangerStock: 'INDUSINDBK',
    dangerAlpha: -16.5,
    dangerRank: 49,
    dangerCutoffDeficitCr: -15200,
    projectedTurnoverRatio: 4.4
  }
];
