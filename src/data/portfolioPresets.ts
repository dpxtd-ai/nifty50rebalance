import { UserPortfolioStock, PortfolioAction } from '../types/index.ts';

export interface KnownStockProfile {
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  dayChangePercent: number;
  rebalanceStatus: 'Upcoming Inclusion (+Inflows)' | 'Exclusion Vulnerable (-Outflows)' | 'Core Constituent (Stable)' | 'High Alpha Contender';
  targetPrice: number;
  stopLoss: number;
  riskRating: 'Low' | 'Moderate' | 'High' | 'Critical';
  baseRationale: string;
  defaultAction: PortfolioAction;
}

export const KNOWN_STOCKS_CATALOG: KnownStockProfile[] = [
  {
    symbol: 'ZOMATO',
    name: 'Zomato Ltd',
    sector: 'Consumer Tech / Quick Commerce',
    currentPrice: 284.60,
    dayChangePercent: 2.15,
    rebalanceStatus: 'Upcoming Inclusion (+Inflows)',
    targetPrice: 320.0,
    stopLoss: 265.0,
    riskRating: 'Moderate',
    baseRationale: 'Expected ₹3,850 Cr passive ETF buying on effective Nifty 50 listing date. Blinkit turnaround provides strong earnings tailwind.',
    defaultAction: 'HOLD_FIRM'
  },
  {
    symbol: 'TRENT',
    name: 'Trent Ltd',
    sector: 'Retail & Fashion',
    currentPrice: 7420.00,
    dayChangePercent: 1.84,
    rebalanceStatus: 'Upcoming Inclusion (+Inflows)',
    targetPrice: 8000.0,
    stopLoss: 7100.0,
    riskRating: 'Moderate',
    baseRationale: 'Dominant +44.8% alpha over benchmark. High probability inclusion in upcoming review cycle with ₹3,510 Cr institutional inflows.',
    defaultAction: 'HOLD_FIRM'
  },
  {
    symbol: 'JIOFIN',
    name: 'Jio Financial Services Ltd',
    sector: 'Financial Services',
    currentPrice: 348.50,
    dayChangePercent: 0.72,
    rebalanceStatus: 'Upcoming Inclusion (+Inflows)',
    targetPrice: 390.0,
    stopLoss: 330.0,
    riskRating: 'Moderate',
    baseRationale: 'BlackRock joint venture and high liquidity position it as top 3 inclusion candidate with ₹2,390 Cr projected inflows.',
    defaultAction: 'ACCUMULATE'
  },
  {
    symbol: 'INDUSINDBK',
    name: 'IndusInd Bank Ltd',
    sector: 'Banking',
    currentPrice: 980.50,
    dayChangePercent: -1.45,
    rebalanceStatus: 'Exclusion Vulnerable (-Outflows)',
    targetPrice: 920.0,
    stopLoss: 1015.0,
    riskRating: 'Critical',
    baseRationale: 'Rank #50 constituent at severe risk of exclusion in the near 15-day window. ₹1,870 Cr passive ETF selling imminent upon circular confirmation.',
    defaultAction: 'SELL_EXIT_NOW'
  },
  {
    symbol: 'BPCL',
    name: 'Bharat Petroleum Corp Ltd',
    sector: 'Oil & Gas',
    currentPrice: 312.40,
    dayChangePercent: -0.80,
    rebalanceStatus: 'Exclusion Vulnerable (-Outflows)',
    targetPrice: 290.0,
    stopLoss: 326.0,
    riskRating: 'High',
    baseRationale: 'Free float deficit of ₹16,475 Cr against replacement contender TRENT. High probability of deletion triggering ₹1,760 Cr outflow.',
    defaultAction: 'SELL_EXIT_NOW'
  },
  {
    symbol: 'HEROMOTOCO',
    name: 'Hero MotoCorp Ltd',
    sector: 'Automobile',
    currentPrice: 4820.00,
    dayChangePercent: -0.35,
    rebalanceStatus: 'Exclusion Vulnerable (-Outflows)',
    targetPrice: 4600.0,
    stopLoss: 4980.0,
    riskRating: 'High',
    baseRationale: 'Slipping toward bottom quartile (#48) of eligible universe. Passive selling pressure anticipated in 1-month horizon.',
    defaultAction: 'SELL_EXIT_NOW'
  },
  {
    symbol: 'WIPRO',
    name: 'Wipro Ltd',
    sector: 'IT Services',
    currentPrice: 532.10,
    dayChangePercent: 0.20,
    rebalanceStatus: 'Exclusion Vulnerable (-Outflows)',
    targetPrice: 510.0,
    stopLoss: 550.0,
    riskRating: 'High',
    baseRationale: 'Multi-quarter underperformance vs Nifty IT peers; trailing free-float rank degraded to #47 with ₹2,210 Cr outflow risk.',
    defaultAction: 'SELL_EXIT_NOW'
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    sector: 'Banking',
    currentPrice: 1682.00,
    dayChangePercent: 1.15,
    rebalanceStatus: 'Core Constituent (Stable)',
    targetPrice: 1800.0,
    stopLoss: 1620.0,
    riskRating: 'Low',
    baseRationale: 'Highest weighted anchor constituent in Nifty 50 (~11.5%). Stable foreign institutional ownership baseline and low rebalance risk.',
    defaultAction: 'HOLD_FIRM'
  },
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    sector: 'Energy & Telecom',
    currentPrice: 2985.00,
    dayChangePercent: 0.85,
    rebalanceStatus: 'Core Constituent (Stable)',
    targetPrice: 3200.0,
    stopLoss: 2890.0,
    riskRating: 'Low',
    baseRationale: 'Core bellwether constituent with ~9.5% weight. High free float buffer guarantees permanent constituent retention.',
    defaultAction: 'HOLD_FIRM'
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd',
    sector: 'IT Services',
    currentPrice: 4290.00,
    dayChangePercent: 0.60,
    rebalanceStatus: 'Core Constituent (Stable)',
    targetPrice: 4600.0,
    stopLoss: 4100.0,
    riskRating: 'Low',
    baseRationale: 'Largest Indian IT services exporter with robust cash flows and high dividend payout. Zero index exclusion vulnerability.',
    defaultAction: 'HOLD_FIRM'
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd',
    sector: 'IT Services',
    currentPrice: 1895.00,
    dayChangePercent: 0.45,
    rebalanceStatus: 'Core Constituent (Stable)',
    targetPrice: 2050.0,
    stopLoss: 1800.0,
    riskRating: 'Low',
    baseRationale: 'Liquid index heavyweight with second largest IT weighting in Nifty 50. Safe long-term compounder.',
    defaultAction: 'HOLD_FIRM'
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd',
    sector: 'Banking',
    currentPrice: 1285.00,
    dayChangePercent: 0.90,
    rebalanceStatus: 'Core Constituent (Stable)',
    targetPrice: 1400.0,
    stopLoss: 1220.0,
    riskRating: 'Low',
    baseRationale: 'Market leader in net interest margin (NIM) and asset quality metrics. Core constituent holding with solid institutional support.',
    defaultAction: 'HOLD_FIRM'
  },
  {
    symbol: 'INDIGO',
    name: 'InterGlobe Aviation Ltd',
    sector: 'Aviation',
    currentPrice: 4890.25,
    dayChangePercent: 1.10,
    rebalanceStatus: 'High Alpha Contender',
    targetPrice: 5350.0,
    stopLoss: 4600.0,
    riskRating: 'Moderate',
    baseRationale: 'High alpha contender with 64% domestic market share. On watchlist for upcoming entry with ₹1,920 Cr projected passive inflow.',
    defaultAction: 'ACCUMULATE'
  },
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd',
    sector: 'Automobile',
    currentPrice: 975.40,
    dayChangePercent: 0.65,
    rebalanceStatus: 'Core Constituent (Stable)',
    targetPrice: 1100.0,
    stopLoss: 920.0,
    riskRating: 'Low',
    baseRationale: 'Established Nifty 50 constituent; JLR debt reduction and EV market leadership support steady institutional retention.',
    defaultAction: 'HOLD_FIRM'
  },
  {
    symbol: 'SBIN',
    name: 'State Bank of India',
    sector: 'Banking & Financials',
    currentPrice: 792.30,
    dayChangePercent: 0.40,
    rebalanceStatus: 'Core Constituent (Stable)',
    targetPrice: 870.0,
    stopLoss: 750.0,
    riskRating: 'Low',
    baseRationale: 'Largest Indian public sector lender. Heavy domestic institutional anchor holding with permanent Nifty 50 status.',
    defaultAction: 'HOLD_FIRM'
  },
  {
    symbol: 'ITC',
    name: 'ITC Ltd',
    sector: 'FMCG / Diversified',
    currentPrice: 508.80,
    dayChangePercent: 0.30,
    rebalanceStatus: 'Core Constituent (Stable)',
    targetPrice: 560.0,
    stopLoss: 480.0,
    riskRating: 'Low',
    baseRationale: 'Defensive blue-chip constituent with high cash dividend yield and zero rebalance deletion vulnerability.',
    defaultAction: 'HOLD_FIRM'
  },
  {
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel Ltd',
    sector: 'Telecommunications',
    currentPrice: 1642.00,
    dayChangePercent: 1.25,
    rebalanceStatus: 'Core Constituent (Stable)',
    targetPrice: 1800.0,
    stopLoss: 1550.0,
    riskRating: 'Low',
    baseRationale: 'Telecom industry ARPU expansion and 5G subscriber migration provide high earnings compounding. Safe core constituent.',
    defaultAction: 'HOLD_FIRM'
  }
];

export function generateAdvisorRecommendation(
  profile: KnownStockProfile,
  avgBuyPrice: number,
  currentPrice: number
): {
  suggestion: PortfolioAction;
  rationale: string;
} {
  const pnlPercent = ((currentPrice - avgBuyPrice) / avgBuyPrice) * 100;

  if (profile.rebalanceStatus === 'Exclusion Vulnerable (-Outflows)') {
    return {
      suggestion: 'SELL_EXIT_NOW',
      rationale: `RECOMMENDATION: SELL / EXIT. ${profile.symbol} is facing critical deletion from Nifty 50 with expected passive ETF selling. Technical breakdown below VWAP further increases risk of liquidation.`
    };
  }

  if (profile.rebalanceStatus === 'Upcoming Inclusion (+Inflows)') {
    if (pnlPercent > 40) {
      return {
        suggestion: 'BOOK_PARTIAL_PROFIT',
        rationale: `RECOMMENDATION: BOOK PARTIAL PROFIT (25-30%) & HOLD REMAINDER. You have +${pnlPercent.toFixed(1)}% unrealized gain. Secure profits while riding the remaining position into official Nifty 50 listing date.`
      };
    }
    return {
      suggestion: 'HOLD_FIRM',
      rationale: `RECOMMENDATION: HOLD FIRM. ${profile.symbol} is in the prime inclusion window. ₹${profile.baseRationale.slice(0, 80)}... Momentum remains firmly in favor of buyers.`
    };
  }

  if (pnlPercent < -15) {
    return {
      suggestion: 'SELL_EXIT_NOW',
      rationale: `RECOMMENDATION: CONSIDER EXIT / TAX LOSS HARVESTING. Position down ${pnlPercent.toFixed(1)}% from buy price ₹${avgBuyPrice}. Reallocate capital into higher-alpha Nifty 50 contenders.`
    };
  }

  if (pnlPercent > 25) {
    return {
      suggestion: 'BOOK_PARTIAL_PROFIT',
      rationale: `RECOMMENDATION: BOOK PARTIAL PROFIT. Up +${pnlPercent.toFixed(1)}%. Trailing stop-loss to ₹${(currentPrice * 0.95).toFixed(0)} to protect gains.`
    };
  }

  return {
    suggestion: profile.defaultAction,
    rationale: `RECOMMENDATION: ${profile.defaultAction.replace('_', ' ')}. ${profile.baseRationale}`
  };
}
