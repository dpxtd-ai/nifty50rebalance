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
  }
];

export const INITIAL_PORTFOLIO_SAMPLE: UserPortfolioStock[] = [
  {
    id: 'port-1',
    symbol: 'ZOMATO',
    name: 'Zomato Ltd',
    shares: 400,
    avgBuyPrice: 245.00,
    buyDate: '2026-06-15',
    notes: 'Bought for Nifty 50 inclusion run-up and Blinkit growth',
    currentPrice: 284.60,
    dayChangePercent: 2.15,
    rebalanceStatus: 'Upcoming Inclusion (+Inflows)',
    suggestion: 'HOLD_FIRM',
    suggestionRationale: 'HOLD FIRM. Stock is in strong profit (+16.2%) and ranks #1 for Nifty 50 inclusion. An estimated ₹3,850 Cr passive ETF buying will execute on rebalance day, supporting prices higher.',
    targetPrice: 320.0,
    stopLoss: 265.0,
    riskRating: 'Moderate'
  },
  {
    id: 'port-2',
    symbol: 'INDUSINDBK',
    name: 'IndusInd Bank Ltd',
    shares: 100,
    avgBuyPrice: 1120.00,
    buyDate: '2026-04-10',
    notes: 'Long-term banking holding in broker account',
    currentPrice: 980.50,
    dayChangePercent: -1.45,
    rebalanceStatus: 'Exclusion Vulnerable (-Outflows)',
    suggestion: 'SELL_EXIT_NOW',
    suggestionRationale: 'RECOMMENDATION: SELL / EXIT NOW. Stock has dropped to rank #50 in Nifty 50 with -18.2% negative alpha. Facing imminent 15-day exclusion with projected ₹1,870 Cr passive mutual fund dump.',
    targetPrice: 920.0,
    stopLoss: 1015.0,
    riskRating: 'Critical'
  },
  {
    id: 'port-3',
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    shares: 80,
    avgBuyPrice: 1590.00,
    buyDate: '2026-03-20',
    notes: 'Core portfolio bluechip',
    currentPrice: 1682.00,
    dayChangePercent: 1.15,
    rebalanceStatus: 'Core Constituent (Stable)',
    suggestion: 'HOLD_FIRM',
    suggestionRationale: 'HOLD FIRM. Top constituent anchor (~11.5% index weight). Zero rebalance deletion risk, steady passive fund backing, and favorable risk-reward.',
    targetPrice: 1800.0,
    stopLoss: 1620.0,
    riskRating: 'Low'
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
