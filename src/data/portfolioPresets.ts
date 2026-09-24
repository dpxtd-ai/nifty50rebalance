import { UserPortfolioStock, PortfolioAction } from '../types/index.ts';

export interface KnownStockProfile {
  symbol: string;
  name: string;
  nseKey: string; // e.g. "NSE:ZOMATO"
  bseKey: string; // e.g. "BSE:543320"
  isin: string;
  series: string; // e.g. "EQ"
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
    name: 'Zomato Ltd (Eternal)',
    nseKey: 'NSE:ZOMATO',
    bseKey: 'BSE:543320',
    isin: 'INE758T01015',
    series: 'EQ',
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
    nseKey: 'NSE:TRENT',
    bseKey: 'BSE:500251',
    isin: 'INE849A01020',
    series: 'EQ',
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
    nseKey: 'NSE:JIOFIN',
    bseKey: 'BSE:543940',
    isin: 'INE02J301010',
    series: 'EQ',
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
    nseKey: 'NSE:INDUSINDBK',
    bseKey: 'BSE:532187',
    isin: 'INE095A01012',
    series: 'EQ',
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
    nseKey: 'NSE:BPCL',
    bseKey: 'BSE:500547',
    isin: 'INE029A01011',
    series: 'EQ',
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
    nseKey: 'NSE:HEROMOTOCO',
    bseKey: 'BSE:500182',
    isin: 'INE158A01026',
    series: 'EQ',
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
    nseKey: 'NSE:WIPRO',
    bseKey: 'BSE:507685',
    isin: 'INE075A01022',
    series: 'EQ',
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
    nseKey: 'NSE:HDFCBANK',
    bseKey: 'BSE:500180',
    isin: 'INE040A01034',
    series: 'EQ',
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
    nseKey: 'NSE:RELIANCE',
    bseKey: 'BSE:500325',
    isin: 'INE002A01018',
    series: 'EQ',
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
    nseKey: 'NSE:TCS',
    bseKey: 'BSE:532540',
    isin: 'INE467B01029',
    series: 'EQ',
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
    nseKey: 'NSE:INFY',
    bseKey: 'BSE:500209',
    isin: 'INE009A01021',
    series: 'EQ',
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
    nseKey: 'NSE:ICICIBANK',
    bseKey: 'BSE:532174',
    isin: 'INE090A01021',
    series: 'EQ',
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
    symbol: 'SBIN',
    name: 'State Bank of India',
    nseKey: 'NSE:SBIN',
    bseKey: 'BSE:500112',
    isin: 'INE062A01020',
    series: 'EQ',
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
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel Ltd',
    nseKey: 'NSE:BHARTIARTL',
    bseKey: 'BSE:532454',
    isin: 'INE397D01024',
    series: 'EQ',
    sector: 'Telecommunications',
    currentPrice: 1642.00,
    dayChangePercent: 1.25,
    rebalanceStatus: 'Core Constituent (Stable)',
    targetPrice: 1800.0,
    stopLoss: 1550.0,
    riskRating: 'Low',
    baseRationale: 'Telecom industry ARPU expansion and 5G subscriber migration provide high earnings compounding. Safe core constituent.',
    defaultAction: 'HOLD_FIRM'
  },
  {
    symbol: 'ITC',
    name: 'ITC Ltd',
    nseKey: 'NSE:ITC',
    bseKey: 'BSE:500875',
    isin: 'INE154A01025',
    series: 'EQ',
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
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd',
    nseKey: 'NSE:TATAMOTORS',
    bseKey: 'BSE:500570',
    isin: 'INE155A01022',
    series: 'EQ',
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
    symbol: 'INDIGO',
    name: 'InterGlobe Aviation Ltd',
    nseKey: 'NSE:INDIGO',
    bseKey: 'BSE:539448',
    isin: 'INE646L01027',
    series: 'EQ',
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
    symbol: 'CUMMINSIND',
    name: 'Cummins India Ltd',
    nseKey: 'NSE:CUMMINSIND',
    bseKey: 'BSE:500480',
    isin: 'INE298A01020',
    series: 'EQ',
    sector: 'Capital Goods & Infrastructure',
    currentPrice: 3840.10,
    dayChangePercent: 0.95,
    rebalanceStatus: 'High Alpha Contender',
    targetPrice: 4250.0,
    stopLoss: 3620.0,
    riskRating: 'Moderate',
    baseRationale: 'High alpha backup candidate (+31.2% excess return). Strong AI data center generator demand and exports.',
    defaultAction: 'ACCUMULATE'
  },
  {
    symbol: 'TITAN',
    name: 'Titan Company Ltd',
    nseKey: 'NSE:TITAN',
    bseKey: 'BSE:500114',
    isin: 'INE280A01028',
    series: 'EQ',
    sector: 'Consumer Discretionary / Jewellery',
    currentPrice: 3560.00,
    dayChangePercent: 0.80,
    rebalanceStatus: 'Core Constituent (Stable)',
    targetPrice: 3850.0,
    stopLoss: 3380.0,
    riskRating: 'Low',
    baseRationale: 'Tata group flagship in branded jewellery and watches. High domestic demand and permanent constituent retention.',
    defaultAction: 'HOLD_FIRM'
  },
  {
    symbol: 'BAJFINANCE',
    name: 'Bajaj Finance Ltd',
    nseKey: 'NSE:BAJFINANCE',
    bseKey: 'BSE:500034',
    isin: 'INE296A01024',
    series: 'EQ',
    sector: 'NBFC / Financial Services',
    currentPrice: 7120.00,
    dayChangePercent: 0.55,
    rebalanceStatus: 'Core Constituent (Stable)',
    targetPrice: 7800.0,
    stopLoss: 6800.0,
    riskRating: 'Low',
    baseRationale: 'Dominant consumer lending franchise in India. Solid balance sheet and permanent constituent standing.',
    defaultAction: 'HOLD_FIRM'
  },
  {
    symbol: 'LT',
    name: 'Larsen & Toubro Ltd',
    nseKey: 'NSE:LT',
    bseKey: 'BSE:500510',
    isin: 'INE018A01030',
    series: 'EQ',
    sector: 'Infrastructure & Engineering',
    currentPrice: 3680.00,
    dayChangePercent: 0.90,
    rebalanceStatus: 'Core Constituent (Stable)',
    targetPrice: 4050.0,
    stopLoss: 3500.0,
    riskRating: 'Low',
    baseRationale: 'India infrastructure proxy with historic record order book exceeding ₹4.5 Lakh Cr. Zero deletion vulnerability.',
    defaultAction: 'HOLD_FIRM'
  },
  {
    symbol: 'HINDUNILVR',
    name: 'Hindustan Unilever Ltd',
    nseKey: 'NSE:HINDUNILVR',
    bseKey: 'BSE:500696',
    isin: 'INE030A01027',
    series: 'EQ',
    sector: 'FMCG',
    currentPrice: 2680.00,
    dayChangePercent: 0.40,
    rebalanceStatus: 'Core Constituent (Stable)',
    targetPrice: 2950.0,
    stopLoss: 2550.0,
    riskRating: 'Low',
    baseRationale: 'Largest consumer staples business in India. Stable institutional benchmark anchor weight.',
    defaultAction: 'HOLD_FIRM'
  },
  {
    symbol: 'KOTAKBANK',
    name: 'Kotak Mahindra Bank Ltd',
    nseKey: 'NSE:KOTAKBANK',
    bseKey: 'BSE:500247',
    isin: 'INE237A01028',
    series: 'EQ',
    sector: 'Banking',
    currentPrice: 1820.00,
    dayChangePercent: 0.35,
    rebalanceStatus: 'Core Constituent (Stable)',
    targetPrice: 2000.0,
    stopLoss: 1740.0,
    riskRating: 'Low',
    baseRationale: 'Premier private bank with high capital adequacy ratio (>20%). Steady index retention.',
    defaultAction: 'HOLD_FIRM'
  },
  {
    symbol: 'AXISBANK',
    name: 'Axis Bank Ltd',
    nseKey: 'NSE:AXISBANK',
    bseKey: 'BSE:532215',
    isin: 'INE238A01034',
    series: 'EQ',
    sector: 'Banking',
    currentPrice: 1220.00,
    dayChangePercent: 0.70,
    rebalanceStatus: 'Core Constituent (Stable)',
    targetPrice: 1350.0,
    stopLoss: 1160.0,
    riskRating: 'Low',
    baseRationale: 'Third largest private bank in India. Strong credit card and retail loan compounding.',
    defaultAction: 'HOLD_FIRM'
  },
  {
    symbol: 'BEL',
    name: 'Bharat Electronics Ltd',
    nseKey: 'NSE:BEL',
    bseKey: 'BSE:500049',
    isin: 'INE263A01024',
    series: 'EQ',
    sector: 'Defence / Aerospace',
    currentPrice: 295.40,
    dayChangePercent: 1.45,
    rebalanceStatus: 'High Alpha Contender',
    targetPrice: 340.0,
    stopLoss: 275.0,
    riskRating: 'Moderate',
    baseRationale: 'Indian defence indigenization front-runner with multi-year order visibility from Ministry of Defence.',
    defaultAction: 'ACCUMULATE'
  },
  {
    symbol: 'HAL',
    name: 'Hindustan Aeronautics Ltd',
    nseKey: 'NSE:HAL',
    bseKey: 'BSE:541154',
    isin: 'INE066F01012',
    series: 'EQ',
    sector: 'Defence / Aerospace',
    currentPrice: 4620.00,
    dayChangePercent: 1.60,
    rebalanceStatus: 'High Alpha Contender',
    targetPrice: 5200.0,
    stopLoss: 4350.0,
    riskRating: 'Moderate',
    baseRationale: 'Tejas fighter jet manufacturing and engine export deals driving 20%+ earnings CAGR.',
    defaultAction: 'ACCUMULATE'
  },
  {
    symbol: 'TATAPOWER',
    name: 'Tata Power Company Ltd',
    nseKey: 'NSE:TATAPOWER',
    bseKey: 'BSE:500400',
    isin: 'INE245A01021',
    series: 'EQ',
    sector: 'Power Generation & Renewables',
    currentPrice: 442.10,
    dayChangePercent: 0.90,
    rebalanceStatus: 'High Alpha Contender',
    targetPrice: 500.0,
    stopLoss: 410.0,
    riskRating: 'Moderate',
    baseRationale: 'Clean energy transmission and rooftop solar rollout creating major operating cash flow expansion.',
    defaultAction: 'ACCUMULATE'
  }
];

export function searchNSEBSEStocks(query: string): KnownStockProfile[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return KNOWN_STOCKS_CATALOG.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(q) ||
      stock.name.toLowerCase().includes(q) ||
      stock.sector.toLowerCase().includes(q) ||
      stock.nseKey.toLowerCase().includes(q) ||
      stock.bseKey.toLowerCase().includes(q)
  );
}

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
      rationale: `RECOMMENDATION: HOLD FIRM. ${profile.symbol} is in the prime inclusion window. ${profile.baseRationale} Momentum remains firmly in favor of buyers.`
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
